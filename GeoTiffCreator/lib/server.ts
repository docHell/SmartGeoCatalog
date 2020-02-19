import { GeoTiffCreator } from './../providers/GeoTiffCreator';
import { GeoJsonCreator } from './../providers/GeoJsonCreator';
import { Analysis } from './../providers/Analysis';


import * as jsonfile from "jsonfile";
import fs = require("fs");

import * as readline from "readline";
 
import { exec } from "child_process";
 
const FILEPATH: string = "/media/carnauser/Volume/CNR/DatiPadova/WMTS/"
// NAPOLI
  // "/media/carnauser/Volume/CNR/Napoli_out/temp5/";
//MILANO 
  // "/media/carnauser/Volume/CNR/DatiMilano/MilanoOutFinale/";
let toAnalyze: string ="/media/carnauser/Volume/CNR/DatiPadova/out/WMTS_2019-07-19-16-57-08.csv"
 
//this value depends on how many rows u want to consider. 

let ROWS : number = 1000000;

// First Step Analyse the csv
Analysis.getInstance().doAnalysis(toAnalyze,ROWS);


// Use the data from Analysis to create GeoTiff
let MAXVALUE : number = 30.3; //< -- example

GeoJsonCreator.getInstance().createGeoJson(toAnalyze,ROWS,FILEPATH,MAXVALUE).subscribe( (esito : boolean) => {
  if ( esito) {
    // It ok, now correct the files.
      GeoJsonCreator.getInstance().correctGeoJson(FILEPATH);
  } else {
    // some errors    
  }
}
)
// Check the files and the uncomment next line. 
//Now we have the GeoJson Files we need...lets create a GeoTiff 

//GeoTiffCreator.getInstance().createGeoTiff(FILEPATH);

// Check the files and the uncomment next line. 
// Now Merge Them
// widht -> image pixel width
// height -> image pixel height
// u can use the aspect ratio suggested in the analysis

//GeoTiffCreator.getInstance().mergeTiff(FILEPATH, width, height);