import fs = require("fs");
import { Risposta } from "../models/Risposta";
import { ElasticRemote } from './ElasticRemote';
import { ExportParsing } from '../models/ExportParsing';
import { FileUploadResult } from "../models/FileUploadResult";

export class Filters {
  private static _instance: Filters;
  public static readonly CHILDREN: string = "children";
  public static readonly GEOGRAPHICELEMENT: string = "geographicElement";

  private constructor() {
    Filters._instance = this;
  }

  public async xmlUpload(path: string, filename: string): Promise<Risposta> {
    let exit: Risposta;
    path = path + "/" + filename;
    fs.readFile(path, "base64", async (err, result) => {
      await ElasticRemote.getInstance().addNewMetadata(new ExportParsing(result), filename).then((ris: Risposta) => {
        exit = ris;
      }).catch((err) => {
        let fur: FileUploadResult = FileUploadResult.error(filename, err);
        exit = new Risposta("Errore 3", false, err);
      });
    });
    return exit;
  }

  public static getInstance(): Filters {
    if (!this._instance) {
      this._instance = new Filters();
    }
    return this._instance;
  }

}
