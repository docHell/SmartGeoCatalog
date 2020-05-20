import { FileUploadResult } from './../models/FileUploadResult';

import request = require('superagent');
import axios from 'axios';
import { ExportParsing } from '../models/ExportParsing';
import { Risposta } from '../models/Risposta';
export class ElasticRemote {

  private static _instance: ElasticRemote;

  private URL: string;
  private SAVE_METADATA_TO: string;
  private TO_PARSE: string;
  private TO_UPLOAD: string;

  public isURL(str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
  }

  public setURL(url: string): boolean {

    if (this.isURL(url)) {
      this.URL = url;
      this.SAVE_METADATA_TO = this.URL + '/saveMetadata/';
      this.TO_PARSE = this.URL + '/toParse/';
      this.TO_UPLOAD = this.URL + '/upload/';
      return true;
    } else {
      return false;
    }

  }

  private constructor() {
    ElasticRemote._instance = this;
  }

  public async  addNewMetadata(metadata: ExportParsing, filename: string): Promise<Risposta> {
    let exit: Risposta;
    // console.log("-> " + JSON.stringify(metadata)) ;
    await axios.post(this.TO_UPLOAD, metadata).then(async (value) => {
      // console.log("-> Response :") 
      // console.log(JSON.stringify(value.data))
      if (value.data.esito) {
        let fur: FileUploadResult = FileUploadResult.success(filename);
        exit = new Risposta("OK!", true, fur);
      } else {
        let fur: FileUploadResult = FileUploadResult.error(filename, value.data);
        exit = new Risposta("ERROR 1 ", false, fur);
      }
    }).catch((err) => {
      let fur: FileUploadResult = FileUploadResult.error(filename, err);
      exit = new Risposta("ERROR 2 ", false, fur);
    })

    return exit;

  }
  // public async  addNewMetadata(metadata: ExportParsing, filename : string): Promise<Risposta> {
  //   let exit: Risposta;
  //   // console.log("-> " + JSON.stringify(metadata)) ;
  //   await axios.post(this.TO_PARSE, metadata).then(async (value) => {
  //     // console.log("-> Response :") 
  //     // console.log(JSON.stringify(value.data))
  //     if (value.data.esito) {
  //       await axios.post(this.SAVE_METADATA_TO, value.data.valore).then((value2) => {
  //         // console.log("-> Response :")
  //         // console.log(JSON.stringify(value2.data))
  //         if (value2.data.esito) {
  //           let fur : FileUploadResult = FileUploadResult.success(filename);
  //           exit = new Risposta("OK!", true, fur);
  //         } else {
  //           let fur : FileUploadResult = FileUploadResult.error(filename,value2.data);
  //           exit = new Risposta("ERROR 1 ", false, fur);
  //         }
  //       }).catch((err) => {
  //         let fur : FileUploadResult = FileUploadResult.error(filename,err);
  //         exit = new Risposta("ERROR 2 ", false, fur);
  //       })
  //     } else {
  //       let fur : FileUploadResult = FileUploadResult.error(filename,value.data);
  //       exit = new Risposta("ERROR 1 ", false, fur);
  //     }
  //   }).catch((err) => {
  //     let fur : FileUploadResult = FileUploadResult.error(filename,err);
  //     exit = new Risposta("ERROR 2 ", false, fur);
  //   })
  //   return exit;

  // }



  public static getInstance(): ElasticRemote {
    if (!this._instance) {
      this._instance = new ElasticRemote();
    }
    return this._instance;
  }


}
