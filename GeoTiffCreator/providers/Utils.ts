import fs = require("fs");
import * as readline from "readline";
export class Utils {
  private static _instance: Utils;

  private constructor() {
    Utils._instance = this;
  }


  public   hexToRgb = hex => hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));

  public round(x: number) {
    return Math.round(x * 100) / 100;
  }

  public writeWaitingPercent(p: number) {
    p = Math.round(p * 100) / 100;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    let text = `Process status : ... ${p}%`;
    // for (let i = 0; i < Math.round(p); i++) {
    //   text = text +"="
    // }
    // for (let i = 0; i < (100-Math.round(p)); i++) {
    //   text = text +"."
    // }
    // text = text +"] "
    process.stdout.write(text);
  }

  public static getInstance(): Utils {
    if (!this._instance) {
      this._instance = new Utils();
    }
    return this._instance;
  }
}
