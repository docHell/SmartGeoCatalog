import fs = require("fs");

export class FileUtil {
  private static _instance: FileUtil;

  private constructor() {
    FileUtil._instance = this;
  }

  public checkDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  public static getInstance(): FileUtil {
    if (!this._instance) {
      this._instance = new FileUtil();
    }
    return this._instance;
  }
}
