import { EventRemote } from './../providers/EventRemote';

import fs = require("fs");

import util = require("util");
import app from "./app";
import { Risposta } from '../models/Risposta';
import { ExportParsing } from '../models/ExportParsing';
import { ParserJob } from "../providers/ParserJob"
import CONFIG from '../config/config.json';
 

const PORT = 3725; 
EventRemote.getInstance().client.subscribe(CONFIG.STATUS_TOPIC);
 
const PATH = "/tmp/"
const tmp = require('tmp');


app.post(
  "/toParse/", (req, res, next) => {
    console.log("-------------------------------------------------------------------")
    console.log("---/toParse/---");
    console.log("-------------------------------------------------------------------")
    // console.log(req.body);
    console.log("-------------------------------------------------------------------")
    let metadata: ExportParsing = ExportParsing.of(req.body);
    const { base64decode } = require('nodejs-base64');

    let rndt: string = base64decode(metadata.base64_rndt);

    const writeFile = util.promisify(fs.writeFile);

    let tem: Date = new Date();
    let num: Number = tem.getTime();
    let temp_filename = tmp.tmpNameSync();
    console.log("--------------------------------------------------------------------")
    console.log("->" +temp_filename);
    console.log("--------------------------------------------------------------------")

    writeFile(temp_filename + ".xml", rndt)
      .then(() => {
        let sub = ParserJob.getInstance().xmlParser(temp_filename + ".xml", rndt).subscribe((risposta: Risposta) => {
            console.log("Esito :" + risposta.esito );
            res.json(risposta);
            sub.unsubscribe();
          });
      }).catch((err) => {
        console.log("--------------------------------------+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        let response = new Risposta("Error /toParse", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
        console.log("--------------------------------------+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      });
  });


function status() {
  let payload = JSON.stringify(new Risposta(CONFIG.name, true, CONFIG.version));
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(payload);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
  EventRemote.getInstance().client.publish(CONFIG.STATUS_TOPIC, payload);
}

setInterval(status, CONFIG.frequency);

app.get("/test", (req, res) => {
  res.json(new Risposta(CONFIG.name, true, new Date()));
});

app.listen(PORT, () => {
  EventRemote.getInstance().sendLog("ParserServer listening on port :" + CONFIG.port);
  console.log("Parser server listening on port : " + PORT);
  status();
});
 