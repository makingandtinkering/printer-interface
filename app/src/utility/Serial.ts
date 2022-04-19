import { EventEmitter } from "events";

export default class Serial extends EventEmitter {
  port: SerialPort;
  connected: boolean;

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
  }

  async close() {
    await this.port.close();
    this.onDisconnect();
  }
}
