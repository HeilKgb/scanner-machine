class Debug {
  constructor() {
    this._debug = process.env.DEBUG || false;
  }

  log(data) {
    if (this._debug) {
      console.log(`[${new Date().toLocaleString()}] ${data}`);
    }
  }
}

module.exports = new Debug();
