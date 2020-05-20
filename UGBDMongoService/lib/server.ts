import { EventRemote } from './../providers/EventRemote';
 
 
import { DbJobs } from "./../providers/DbJobs";

import app from "./app";
import { Risposta } from '../models/Risposta';
import { MetadataExport } from '../models/Metadatas';

import CONFIG from '../config/config.json';
import { Contacts } from "../models/Contacts";


const TOPIC = "update_csw";
const CONTACTS_TOPIC = "update_contacts";
const ANSWER_TOPIC = "answer_topic"

EventRemote.getInstance().client.subscribe(TOPIC)
EventRemote.getInstance().client.subscribe(CONTACTS_TOPIC)
EventRemote.getInstance().client.subscribe(CONFIG.STATUS_TOPIC)


app.post(
  "/addMetadata", (req, res, next) => {
    console.log("--- POST METADATA ---");
    console.log("-------------------------------------------------------------------")
    // console.log(req.body);
    console.log("-------------------------------------------------------------------")
    let metadata: MetadataExport = MetadataExport.of(req.body);
    DbJobs.getInstance()
      .addMetadata(metadata)
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error /addMetadata", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      } );
    }
  
);

app.post(
  "/addContact", (req, res, next) => {
    console.log("--- add Contact ---");
    console.log("-------------------------------------------------------------------")
    // console.log(req.body);
    console.log("-------------------------------------------------------------------")
    // let metadata : MetadataExport = MetadataExport.of(req.body);
    DbJobs.getInstance()
      .addContacts(req.body)
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error /addContect", false, err);
        console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      });
  }
);
app.get("/getAllContacts", (req, res) => {
  DbJobs.getInstance()
    .findAllContact()
    .then((risposta: Risposta) => {
      console.log("--------------------------------------");
      console.log(JSON.stringify(risposta));
      console.log("--------------------------------------");
      if (!risposta.esito) {
        EventRemote.getInstance().sendWarning(risposta, risposta.esito);
      }
      res.json(risposta);
    }).catch((err) => {
      let response = new Risposta("Error /getAllContacts", false, err);
      console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);

    })

});

app.get("/countAll", async (req, res) => {

  try {
    let risposta = await DbJobs.getInstance().countAllmetadata();
    console.log("--+++---/countAll---------------------------------");
    console.log(JSON.stringify(risposta));
    console.log("--+++---/countAll---------------------------------");
    res.json(risposta);
  } catch (err) {
    let response = new Risposta("Error /countAll", false, err);
    console.log(JSON.stringify(response));
    EventRemote.getInstance().sendError(response);
    res.json(response);
  }

});

app.get(
  "/getByID/:metadataId", (req, res, next) => {
    console.log("getProductByID----------------------------");
    console.log("req.params.metadataId ->", req.params.metadataId);
    DbJobs.getInstance()
      .findMetadataByID(req.params.metadataId)
      .then((risposta: Risposta) => {
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error /getByID/" + req.params.metadataId, false, err);
        console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      });
  }
);


function status() {
  let payload = JSON.stringify(new Risposta(CONFIG.name, true, CONFIG.version));
  EventRemote.getInstance().client.publish(CONFIG.STATUS_TOPIC, payload);
}


app.get("/test", (req, res) => {
  res.json(new Risposta(CONFIG.name, true, new Date()));
});




EventRemote.getInstance().client.on("message", (topic, payload) => {

  if (topic === TOPIC) {
    console.log("-------------------------------------------------------------");
    console.log("topic : " + TOPIC);
    console.log("-------------------------------------------------------------");
    let metadata: MetadataExport = MetadataExport.of(JSON.parse(payload.toString()));
    // console.log("metadata : " + JSON.stringify(metadata));
    DbJobs.getInstance()
      .addMetadata(metadata)
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");

        EventRemote.getInstance().client.publish(ANSWER_TOPIC, JSON.stringify(risposta));
      }).catch((err) => {
        let errore: Risposta = new Risposta("Error 2 Insert Document", false, err);
        EventRemote.getInstance().client.publish(ANSWER_TOPIC, JSON.stringify(errore));
      })
  }
  if (topic === CONTACTS_TOPIC) {

    console.log("-------------------------------------------------------------");
    console.log("topic : " + CONTACTS_TOPIC);
    console.log("-------------------------------------------------------------");
    let contacts: Contacts = Contacts.of(JSON.parse(payload.toString()));
    DbJobs.getInstance()
      .addContacts(contacts)
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        EventRemote.getInstance().client.publish(ANSWER_TOPIC, JSON.stringify(risposta));
      }).catch((err) => {
        let errore: Risposta = new Risposta("Error 3 Insert Document", false, err);
        EventRemote.getInstance().client.publish(ANSWER_TOPIC, JSON.stringify(errore));
      });
  }
  if ( CONFIG.test) {
    console.log("-------------------------------------------------------------");
    console.log("MQTT Messagge arrived");
    console.log("-------------------------------------------------------------");
    console.log("topic : " + topic);
    console.log("payload : " + payload);
    console.log("-------------------------------------------------------------");
  }



})


setInterval(status, 100000);


 

app.listen(CONFIG.port, () => {
  EventRemote.getInstance().sendLog("MongoServer listening on port :" + CONFIG.port);
  console.log("-------------------------------------------------------------");
  console.log("Express server listening on port p1d " + CONFIG.port);
  console.log("-------------------------------------------------------------");
  status();
});


