
import fs = require("fs");

import util = require("util");
import app from "./app";
import { Risposta } from '../models/Risposta';
import { ExportParsing } from '../models/ExportParsing';
import { ParserJob } from "../providers/ParserJob"

const PORT = 3725;
const PATH = "/home/goserver/ugbdRndtTemp/"



app.post(
  "/toParse/", (req, res, next) => {
    console.log("-------------------------------------------------------------------")
    console.log("---/toParse/---");
    console.log("-------------------------------------------------------------------")
    // console.log(req.body);
    console.log("-------------------------------------------------------------------")
    let metadata: ExportParsing = ExportParsing.of(req.body);
    const {base64decode}  = require('nodejs-base64');
    
    let rndt: string = base64decode(metadata.base64_rndt);
    
    const writeFile = util.promisify(fs.writeFile);

    let tem : Date = new Date();
    let num : Number = tem.getTime();

  
    writeFile(PATH+num+".xml", rndt)
      .then(() => {
        let sub  = ParserJob.getInstance()
          .xmlParser(PATH+num+".xml", rndt)
          .subscribe((risposta: Risposta) => {
            console.log("--------------------------------------");
            console.log(JSON.stringify(risposta));
            console.log("--------------------------------------");
            res.json(risposta);
            sub.unsubscribe();
          });
      }).catch(error => {
        console.log("--------------------------------------");
        console.log("--ERROR");
        console.log("--------------------------------------");
      });
    });
  
 

app.get("/test", (req, res) => {
  res.json(new Risposta("ParserService - v0.05a - 28-01-2020", true, new Date()));
});

app.listen(PORT, () => {
  console.log("Parser server listening on port : " + PORT);
});



// let txt = "100";
// let numb = parseFloat(txt);
// console.log("->" + numb);​