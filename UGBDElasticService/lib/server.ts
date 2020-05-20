import { EventRemote } from './../providers/EventRemote';
import app from "./app";
import { Risposta } from '../models/Risposta';
import { ElasticJobs } from '../providers/ElasticJobs';
import { ElasticExport } from '../models/ElasticExport';


import CONFIG from '../config/config.json';


// const client = connect(CONFIG.mqtt, { clean: false, clientId: CONFIG.name });
const ELASTIC_TOPIC = "store_elastic";

EventRemote.getInstance().client.subscribe(ELASTIC_TOPIC)
// client.subscribe(ELASTIC_TOPIC);
let counter: number[] = [];


app.post(
  "/addMetadata", (req, res, next) => {
    console.log("-------------------------------------------------------------------")
    console.log("--- POST METADATA ---");



    let e: ElasticExport = ElasticExport.of(req.body);
    // console.log(JSON.stringify(e));
    console.log("-------------------------------------------------------------------")
    ElasticJobs.getInstance()
      .uploadDocument(e)
      .then((risposta: Risposta) => {
        // console.log("--------------------------------------");
        // console.log(JSON.stringify(risposta));
        // console.log("--------------------------------------");
        res.json(risposta);
      }).catch((err) => {
        EventRemote.getInstance().sendError("Error /addMetadata " + err)
        res.json(new Risposta("ErrorUpload : ", false, err));
      })
  }
);

EventRemote.getInstance().client.on("message", (topic, payload) => {

  if (topic === ELASTIC_TOPIC) {


    try {
      let e: ElasticExport = ElasticExport.of(JSON.parse(payload.toString()));

      ElasticJobs.getInstance()
        .uploadDocument(e)
        .then((risposta: Risposta) => {
          if (risposta.esito) {

            console.log("-->ok : " + counter.length);
          } else {
            EventRemote.getInstance().sendError(risposta)
            console.log("-ERROR 1------------------------------" + counter.length);
            console.log(JSON.stringify(risposta));
            console.log("--------------------------------------");
          }

        }).catch((err) => {
          EventRemote.getInstance().sendError("upload documenti 3: " + JSON.stringify(err))
          console.log("-ERROR 2------------------------------" + counter.length);
          console.log(err);
          console.log("--------------------------------------");
        })
    } catch (err) {
      console.log("-ERROR 3------------------------------" + counter.length);
      EventRemote.getInstance().sendError("upload documenti 3: " + JSON.stringify(err))
      console.log(err);
      console.log("--------------------------------------");
    }
  }
  counter.push(1)
})


app.get(
  "/createIndex", (req, res, next) => {
    console.log("-------------------------------------------------------------------")
    console.log("--- CREATE INDEX ---");
    console.log("-------------------------------------------------------------------")


    ElasticJobs.getInstance()
      .createIndex()
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch((err) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(err));
        console.log("--------------------------------------");
        EventRemote.getInstance().sendError("checkindex: " + JSON.stringify(err))
        res.json(new Risposta("ERROR CREATING INDEX", err, null));
      });
  }
);
app.get("/checkIndex", (req, res) => {
  console.log("-------------------------------------------------------------------")
  console.log("--- CHECK INDEX ---");
  console.log("-------------------------------------------------------------------")
  let sub = ElasticJobs.getInstance().checkIndex().subscribe((risposta : Risposta) => {
    res.json(risposta);
    sub.unsubscribe();
  })
  
  
});

function status() {
  let payload = JSON.stringify(new Risposta(CONFIG.name, true, CONFIG.version));
  EventRemote.getInstance().client.publish(CONFIG.STATUS_TOPIC, payload);
}

setInterval(status, CONFIG.frequency);

app.get("/test", (req, res) => {
  res.json(new Risposta("ElasticService", true, new Date()));
});


app.listen(CONFIG.port, () => {
  EventRemote.getInstance().sendLog("ElasticService listening on port :" + CONFIG.port);
  status();
  console.log("Express server listening on port p1d " + CONFIG.port);
});
