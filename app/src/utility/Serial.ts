import { EventEmitter } from "events";

export default class Serial extends EventEmitter {
  port: SerialPort;
  connected: boolean;
  streams: {
    reader: ReadableStreamDefaultReader<string>;
    readerDone: Promise<void>;
    writer: WritableStreamDefaultWriter<string>;
    writerDone: Promise<void>;
  };

  static isSupported(): boolean {
    return "serial" in navigator;
  }

  async selectPort(): Promise<SerialPort | null> {
    try {
      const port = await navigator.serial.requestPort();
      return port;
    } catch (err) {
      if (err.message !== "No port selected by the user.") {
        console.error("Failed to select port:", err);
        throw err;
      }
      return null;
    }
  }

  onConnect() {
    this.connected = true;
    this.emit("connect");
  }

  onDisconnect() {
    this.connected = false;
    this.emit("disconnect");
  }

  async open(port: SerialPort, baudRate: number) {
    try {
      await port.open({ baudRate });
    } catch (err) {
      console.error("Failed to open serial port:", err);
      throw err;
    }

    port.addEventListener("disconnect", () => this.onDisconnect());

    this.port = port;
    this.onConnect();

    const textDecoder = new TextDecoderStream();
    const textEncoder = new TextEncoderStream();

    this.streams = {
      readerDone: port.readable.pipeTo(textDecoder.writable),
      reader: textDecoder.readable.getReader(),
      writerDone: textEncoder.readable.pipeTo(port.writable),
      writer: textEncoder.writable.getWriter(),
    };

    setTimeout(async () => {
      let buffer = "";
      while (true) {
        const { value, done } = await this.streams.reader.read();
        if (done) {
          this.streams.reader.releaseLock();
          break;
        }

        buffer += value;
        const lines = buffer.split(/[\r\n]+/);
        // Last element is not complete, buffer until newline received
        buffer = lines.pop();
        for (const line of lines) {
          this.emit("line", line);
        }
      }
    }, 0);
  }

  async close() {
    this.streams.reader.cancel();
    // Suppress stream close error
    await this.streams.readerDone.catch(() => {});
    this.streams.writer.close();
    await this.streams.writerDone;

    await this.port.close();
    this.onDisconnect();
  }

  async writeLine(line: string) {
    await this.streams.writer.write(line.trim() + "\n");
  }
}
