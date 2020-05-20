import { ElasticRemote } from './ElasticRemote';

import fs = require("fs"); 
import { FileUploadResult } from '../models/FileUploadResult';
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
export class UIController {
 
  private failed_file : FileUploadResult [] = [];
  public total_files : number;
  

  private static _instance: UIController;
 
  private constructor() {
    UIController._instance = this;
  }

  public static getInstance(): UIController {
    if (!this._instance) {
      this._instance = new UIController();
    }
    return this._instance;
  }

 

  public init() {

    clear();
    console.log(
      chalk.cyan.bold(
        figlet.textSync('SMART GEO CATALOG', { horizontalLayout: 'full' })
      )
    );
    console.log(chalk.magenta.bold("MASSIVE METADATA UPLOADER"));
    console.log("To exit press CTRL+C ")
    console.log("")

  }


  public addFailedFile(filename:FileUploadResult) {
      this.failed_file.push(filename);
  }

  public getFailedFiles() : FileUploadResult [] {
    return this.failed_file;
  }

  public getSuccessfullyUploaded() : number {
    return this.total_files - this.failed_file.length;
  }

  public printStatus() {
    console.log("---------------------------------------------------------------------------------")
    console.log("SUCCESSFULLY UPLOADED : " + this.getSuccessfullyUploaded())
    if (this.getFailedFiles().length > 0) {
      console.log("ERRORS : " + this.getFailedFiles().length)
      console.log("Those files have errors :");
      this.getFailedFiles().forEach((f)=>{
        console.log("--------------------------------------" );
        console.log("->" +f.filename );
        console.log("->" + JSON.stringify(f.error) );
      })
    } else {
      console.log("NON ERRORS!")
    }
    

    
    console.log("---------------------------------------------------------------------------------")
  }
 
}
