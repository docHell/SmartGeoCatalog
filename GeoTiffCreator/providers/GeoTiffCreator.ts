import { Observable, Subject } from 'rxjs';
import { GeoToExport } from './../models/GeoJson';
import { FileUtil } from './FileUtil';
import { Constant } from './../models/Constants';
import { DateUtil } from './DateUtil';
import fs = require("fs");
import parse = require("csv-parse");
import { UUID } from "angular2-uuid";
import { Utils } from "./Utils";

import { exec } from "child_process";
export class GeoTiffCreator {
  private static _instance: GeoTiffCreator;

  public readonly FINE_MEASURE: number = 0.1;

  private constructor() {
    GeoTiffCreator._instance = this;
  }

  public createGeoTiff(FILEPATH: string) {
    let end: string = "]}";

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("From GeoJson to tiff");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    for (let data of Constant.padova_date) {
      // for (let data of Constant.milano_sate) {
      console.log("data ->", data)
      FileUtil.getInstance().checkDirectory(
        FILEPATH + "out/immagini/" + data
      );
      for (let i = 0; i < 31; i = (i + Constant.FINE_MEASURE)) {
        // geos.push([]);
        // let filename =
        // FILEPATH  + data +
        //   "/from" +
        //   round(i - 26) +
        //   "To" +
        //   round(i - 26+misuraFine) +
        //   ".json";
        let filenameout =
          FILEPATH + "out/" + data +
          "/from" +
          Utils.getInstance().round(i - 26) +
          "To" +
          Utils.getInstance().round(i - 26 + Constant.FINE_MEASURE) +
          ".json";

        console.log("->" + filenameout)

        let imageout =
          FILEPATH + "out/immagini/" + data +
          "/image" +
          Utils.getInstance().round(i - 26) +
          "To" +
          Utils.getInstance().round(i - 26 + Constant.FINE_MEASURE) +
          ".tif";
        let colors: number[] = [3];
        let col1: number;
        let col2: number;
        let col3: number;

        let value = Utils.getInstance().round(i - 26);




        if ((value >= -30) && (value < -2.5)) {
          colors = Utils.getInstance().hexToRgb("#40004b");
        } else if ((value >= -2.5) && (value < -2)) {
          colors = Utils.getInstance().hexToRgb("#762a83");
        } else if ((value >= -2) && (value < -1.5)) {
          colors = Utils.getInstance().hexToRgb("#9970ab");
        } else if ((value >= -1.5) && (value < -1)) {
          colors = Utils.getInstance().hexToRgb("#c2a5cf");
        } else if ((value >= -1) && (value < -0.5)) {
          colors = Utils.getInstance().hexToRgb("#e7d4e8");
        } else if ((value >= -0.5) && (value < 0.5)) {
          colors = Utils.getInstance().hexToRgb("#f7f7f7");
        } else if ((value >= 0.5) && (value < 1)) {
          colors = Utils.getInstance().hexToRgb("#d9f0d3");
        } else if ((value >= 1) && (value < 1.5)) {
          colors = Utils.getInstance().hexToRgb("#a6dba0");
        } else if ((value >= 1.5) && (value < 2)) {
          colors = Utils.getInstance().hexToRgb("#5aae61");
        } else if ((value >= 2) && (value < 2.5)) {
          colors = Utils.getInstance().hexToRgb("#1b7837");
        } else {
          colors = Utils.getInstance().hexToRgb("#00441b");
        }


        let command: string = "gdal_rasterize -ot byte -co alpha=yes " +
          " -burn " + colors[0] +
          " -burn " + colors[1] +
          " -burn " + colors[2] +
          " -burn 255" +
          //      " -ts 500 500 " +
          // TORINO 

          // " -ts 1176 686 "+
          // NAPOLI
          // " -ts 2056 752 "+
          // MILANO
          // " -ts 1436 752 " +

          //ROMA 
          // " -ts 1022 1089 "+ 
          //PADOVA 
          // " -ts 2160 1938 "+ 

          " -ts 1080 969 " +
          filenameout +
          " " +
          imageout

        exec(command, (err, stdout, stderr) => {

          if (err) {
            console.log("--> " + err);
          }

        });
      }
    }
  }


  public mergeTiff(FILEPATH: string) {
    let end: string = "]}";

    for (let data of Constant.padova_date) {
      console.log("data ->", data);
      FileUtil.getInstance().checkDirectory(
        FILEPATH + "out/immagini/" + data
      );

      fs.readdir(
        FILEPATH + "out/immagini/" + data,
        (err, files) => {
          let command: string = "gdal_merge.py ";
          let tomerge: string = "";
          if (files.length > 0) {
            files.forEach(file => {
              console.log(file);
              tomerge =
                tomerge +
                " " +
                FILEPATH + "out/immagini/" +
                data +
                "/" +
                file;
            });
          }

          if (tomerge !== "") {
            //  console.log("tomerge : ", tomerge);
            let data2: string = data.replace(/-/g, "");
            command = command + tomerge + " -o " + FILEPATH + "out/merged/merged-" + data2 + ".tif"
            console.log("------------------------------------------------------------");
            console.log("command : ", command);
            exec(command, (err, stdout, stderr) => {
              if (err) console.log(err);

            });
          }
        }
      );
    }
  }


  public static getInstance(): GeoTiffCreator {
    if (!this._instance) {
      this._instance = new GeoTiffCreator();
    }
    return this._instance;
  }
}
