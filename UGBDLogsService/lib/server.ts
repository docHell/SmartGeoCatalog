import { DbJobs } from "./../providers/DbJobs";

import app from "./app";
import { Risposta } from '../models/Risposta'; 
import { connect } from 'mqtt';
import CONFIG from '../config/config.json'; 
import { Log } from "../models/Log";

 
const TOPIC = "update_csw";
const CONTACTS_TOPIC = "update_contacts";
const ANSWER_TOPIC  = "answer_topic"


const client = connect(CONFIG.mqtt, { clean: false, clientId: CONFIG.name, keepalive : 50 });
 
client.subscribe(CONFIG.LOG_TOPIC)
 
 

 

function status() {
  let payload = JSON.stringify(new Risposta(CONFIG.name,true,CONFIG.version));
  client.publish(CONFIG.STATUS_TOPIC, payload); 
}


app.get("/test", (req, res) => {
  res.json(new Risposta(CONFIG.name, true, new Date()));
});

 
 

client.on("message", (topic, payload) => {
  
  if (topic === CONFIG.LOG_TOPIC) {
    console.log("-------------------------------------------------------------");
    console.log("topic : " +  CONFIG.LOG_TOPIC);
    console.log("-------------------------------------------------------------");

    let log: Log = Log.of(JSON.parse(payload.toString()));
    // console.log("metadata : " + JSON.stringify(metadata));
    DbJobs.getInstance()
      .addLog(log)
      .then((answer: boolean) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(answer));
        console.log("--------------------------------------");
      }).catch((err) => {
        console.log("-E-------------------------------------");
        console.log(JSON.stringify(err));
        console.log("--------------------------------------");
      })
  } 
  
    
 
  
})


setInterval(status, 100000);




app.listen(CONFIG.port, () => {
  console.log("-------------------------------------------------------------");
  console.log("LOG server listening on port p1d " + CONFIG.port);
  console.log("-------------------------------------------------------------");
  status();
});


