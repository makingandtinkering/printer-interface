import Serial from "./Serial.js";

const OK_TIMEOUT = 10000;

export default class MarlinSerial extends Serial {
  sending: boolean;

  async waitOk() {
    let done = false;

    return Promise.race([
      new Promise((_, reject) => {
        setTimeout(
          () => !done && reject("Timed out waiting for ok"),
          OK_TIMEOUT
        );
      }),
      new Promise((resolve, _) => {
        function handler(line) {
          if (line === "ok") {
            done = true;
            this.removeListener("line", handler);
            resolve(null);
          }
        }

        this.on("line", handler);
      }),
    ]);
  }

  async writeLine(line: string) {
    await super.writeLine(line);
    await this.waitOk();
  }
}
