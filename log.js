class LogUpdater {
  constructor() {
    this.counter = 1;
    this.lastLog = '';
  }

  update(text) {
    if (text === this.lastLog) {
      this.counter++;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${text} | x${this.counter}`);
    } else {
      this.counter = 1;
      process.stdout.write(`\n  ${text}`);
    }

    this.lastLog = text;
  }
}

module.exports = LogUpdater;
