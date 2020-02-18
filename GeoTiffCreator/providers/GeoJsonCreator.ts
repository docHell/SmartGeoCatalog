import { Observable, Subject } from 'rxjs';
import { GeoToExport } from './../models/GeoJson';
import { FileUtil } from './FileUtil';
import { Constant } from './../models/Constants';
import { DateUtil } from './DateUtil';
import fs = require("fs");
import parse = require("csv-parse"); 
import { Utils } from "./Utils";
export class GeoJsonCreator {
  private static _instance: GeoJsonCreator;

 

  private constructor() {
    GeoJsonCreator._instance = this;
  }

  private readonly start: string =
  '{"type": "FeatureCollection",  "features": [{"type":"Feature","geometry":{"type":"Point","coordinates":[11.45958, 45.04319]},"properties":{"prop":"0.0"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[12.42597,45.65069]},"properties":{"prop":"0.0"}},';


  public createGeoJson(toAnalyze: string, ROW_IN_THE_FILE: number, FILEPATH: string, max : number ) : Observable<boolean> {
    let exit: Subject<boolean> = new Subject<boolean>();
    let counter: number = 0;
    let maximum: number = 0;
    let minimum: number = 0;
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("GeoJson Creation Process");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    fs.createReadStream(toAnalyze)
      .pipe(parse({ delimiter: "," }))
      .on("data", csvrow => {

        Utils.getInstance().writeWaitingPercent((counter / ROW_IN_THE_FILE) * 100);
        counter = counter + 1;
        if (csvrow.length > 3) {
          let found: boolean = false;
          let conta = 1;
          let isFirst = true;
          while (!found) {
            //   console.log("->" +(min + (conta * unity)))

            let value = (conta - 26);

            if (+csvrow[4] <= value) {
              let i = conta - Constant.FINE_MEASURE;


              let data: string = DateUtil.getInstance().fromDateToString(
                new Date(csvrow[5])
              );

              if (Constant.padova_date.indexOf(data) > -1) {
                FileUtil.getInstance().checkDirectory(FILEPATH + data);

                let filename =
                  FILEPATH +
                  data +
                  "/from" +
                  Utils.getInstance().round(i - 26) +
                  "To" +
                  Utils.getInstance().round(i - 26 + Constant.FINE_MEASURE) +
                  ".json";
                fs.appendFileSync(
                  filename,
                  JSON.stringify(GeoToExport.of(csvrow)) + ","
                );
              }
              found = true;
            } else {
              if (value > max) {
                found = true;
              }
              conta = conta + Constant.FINE_MEASURE;
            }
          }

        }
        if (csvrow.length > 3) {
          if (+csvrow[4] > maximum) {
            maximum = csvrow[4];
          }

          if (+csvrow[4] < minimum) {
            minimum = csvrow[4];
          }
        }


      })
      .on("end", () => {
        exit.next(true)

      }).on('error', ()=> {
        exit.next(false)
      });


      return exit;
  }

  public correctGeoJson(FILEPATH: string) {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("GeoJson File correction");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    let end: string = "]}";
    for (let data of Constant.padova_date) {
      console.log("-->" + data);
      FileUtil.getInstance().checkDirectory( FILEPATH + "out/" + data);
      for (let i = 0; i < 31; i= (i+Constant.FINE_MEASURE)) {
        // geos.push([]);
    
        let filename = FILEPATH +  data + "/from" +  Utils.getInstance().round(i - 26) + "To" +  Utils.getInstance().round(i - 26+Constant.FINE_MEASURE) + ".json";
        let filenameout =  FILEPATH + "out/" + data + "/from" +  Utils.getInstance().round(i - 26) + "To" +  Utils.getInstance().round(i - 26+Constant.FINE_MEASURE) + ".json";
    
        console.log("-->" + filename);
    
        fs.readFile(filename, "utf8", function(err, data) {
          if (!err) {
            fs.appendFileSync(
              filenameout,
              this.start + data.substring(0, data.length - 1) + end
            );
          } else {
          }
        });
      } 
    }
  }

  public static getInstance(): GeoJsonCreator {
    if (!this._instance) {
      this._instance = new GeoJsonCreator();
    }
    return this._instance;
  }
}
