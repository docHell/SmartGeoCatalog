import { Constant } from './../models/Constants';
import fs = require("fs");

import parse = require("csv-parse"); 
import { Utils } from './Utils';
// You need this to analyse the large csv file 
// It prints the bounding box and some stats. 


export class Analysis {
  private static _instance: Analysis;

  public readonly FINE_MEASURE: number = 0.1;

  private constructor() {
    Analysis._instance = this;
  }

  public doAnalysis(toAnalyze: string, ROW_IN_THE_FILE : number) {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("Fine Analyzer ");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let value_dist: number[] = [Constant.RANGE_MEASURE];
    for (let i = 0; i < Constant.RANGE_MEASURE; i++) {
      value_dist[i] = 0;
    }
    let max_lat: number = 0;
    let min_lat: number = 60;

    let max_lng: number = 0;
    let min_lng: number = 60;

    let min_val: number = 0;
    let max_val: number = 0;

    let counter: number = 0;
    let determinaDate = new Set();
    fs.createReadStream(toAnalyze)
      .pipe(parse({ delimiter: "," }))
      .on("data", csvrow => {





        Utils.getInstance().writeWaitingPercent((counter / ROW_IN_THE_FILE) * 100);

        counter = counter + 1;

        if (csvrow[4] != "vel") {


          let data = csvrow[5].split("T")[0];

          determinaDate.add(data);

          let lat: number = +csvrow[2];
          let lng: number = +csvrow[3];


          if (lat > max_lat) {
            max_lat = lat;
          } else {
            if (lat < min_lat) {
              min_lat = lat;
            }
          }


          if (lng > max_lng) {
            max_lng = lng;
          } else {
            if (lng < min_lng) {
              min_lng = lng;
            }
          }

          if (+csvrow[4] < min_val) {
            min_val = csvrow[4];
          }
          if (+csvrow[4] > max_val) {
            max_val = csvrow[4];
          }


          if (csvrow.length > 3) {

            let found: boolean = false;

            let conta = 1;

            while (!found) {
              let value = Math.floor(((conta - 1 + Constant.MIN_R) * 10)) / 10;
 
              if (+csvrow[4] <= value) {
                let val: number = Math.round((conta - Constant.FINE_MEASURE) / Constant.FINE_MEASURE) - 1;
 
                value_dist[val] = value_dist[val] + 1;
                if (+csvrow[4] < 0) { 
                  for (let i = 0; i < value_dist.length; i++) {
                    var bottom = Math.round((Constant.MIN_R - 1 + (Constant.FINE_MEASURE * i)) * 10) / 10;
                    var top = Math.round((Constant.MIN_R - 1 + (Constant.FINE_MEASURE * i) + Constant.FINE_MEASURE ) * 10) / 10;
                 
                  }
                }
                found = true;
              
              } else {
                conta = conta + Constant.FINE_MEASURE ;
              }
            }
          }
        }
      })
      .on("end", () => {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("DISTRIBUTION");
        console.log(" - FROM : " + (Constant.MIN_R - 1));
        console.log(" - TO : " + (Constant.MAX + 1));
        console.log(" - STEP: " + Constant.FINE_MEASURE);
        console.log(JSON.stringify(value_dist));
        console.log("----");

        for (let i = 0; i < value_dist.length; i++) {
          var bottom = Math.round((Constant.MIN_R - 1 + (Constant.FINE_MEASURE * i)) * 10) / 10;
          var top = Math.round((Constant.MIN_R - 1 + (Constant.FINE_MEASURE * i) + Constant.FINE_MEASURE) * 10) / 10;
          console.log("[" + i + "][" + bottom + "," + top + "] -> " + value_dist[i]);
        }

        console.log("-------------DATE--------------------------------------------------");
        determinaDate.forEach(function (value) {

          console.log(value + ",");               //1 2 3 4 5 6

        });
        console.log("-------------------------------------------------------------------");
        console.log("-------------BBOX--------------------------------------------------");
        console.log("Max Lat : " + max_lat);
        console.log("Max Lng : " + max_lng);
        console.log("Min Lat : " + min_lat);
        console.log("Min Lng : " + min_lng);
        console.log("-------------------------------------------------------------------");
        console.log("-------------SUGGESTED---------------------------------------------");
        let x: number = max_lat - min_lat;
        let y: number = max_lng - min_lng;
        console.log("(X) lat : " + x);
        console.log("(Y) lng : " + y);
        console.log("Aspect Ratio 1 : " + (y / x));
        console.log("Aspect Ratio 2 : " + (x / y));
        console.log("-------------------------------------------------------------------");
        console.log("-------------MAX/MIN-----------------------------------------------");
        console.log("(MAX) : " + max_val);
        console.log("(MIN) : " + min_val);
        console.log("-------------------------------------------------------------------");


      });
  }



  public static getInstance(): Analysis {
    if (!this._instance) {
      this._instance = new Analysis();
    }
    return this._instance;
  }
}
