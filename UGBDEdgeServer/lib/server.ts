import { EventRemote } from './../providers/EventRemote';
import { RemoteStatus } from './../providers/RemoteStatus';
import { QueryRemote } from './../providers/QueryRemote';
import app from "./app";
import { Risposta } from '../models/Risposta';
import { ParserRemote } from '../providers/ParserRemote';
import { ElasticRemote } from '../providers/ElasticRemote';
import { MongoRemote } from '../providers/MongoRemote';

import CONFIG from '../config/config.json';


const TOPIC = "update_csw";
const ELASTIC_TOPIC = "store_elastic";
const CONTACTS_TOPIC = "update_contacts";
const ANSWER_TOPIC = "answer_topic"

console.log(RemoteStatus.getInstace().updateStatus(new Risposta("QueryService", false, null)));
console.log(RemoteStatus.getInstace().getStatus());


// const client = connect(CONFIG.mqtt, { clean: false, clientId: CONFIG.name, keepalive: 5 });
// client.subscribe(CONFIG.STATUS_TOPIC)
EventRemote.getInstance().client.subscribe(CONFIG.STATUS_TOPIC)


app.post(
  "/toParse/", (req, res, next) => {
    ParserRemote.getInstance().toparse(req.body).then((ris: Risposta) => {
      console.log("Parsing method has been called")
      res.json(ris);
    }).catch((err) => {
      let response = new Risposta("Error /toParse/", false, err);
      // console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);
    });
  });

app.post(
  "/upload/", (req, res, next) => {
    ParserRemote.getInstance().toparse(req.body).then((ris: Risposta) => {
      console.log("Upload method has been called")
      if (ris.esito) {

        ElasticRemote.getInstance().addNewMetadata(ris.valore.elasticExport).then((ris2: Risposta) => {

          if (ris2.esito) {
            EventRemote.getInstance().client.publish(TOPIC, JSON.stringify(ris.valore.mongoExport));
            EventRemote.getInstance().client.publish(CONTACTS_TOPIC, JSON.stringify(ris.valore.contacts));
          } else {
            let response = new Risposta("Error /upload/ -> ElastiRemote", false, [ris, ris2]);
            EventRemote.getInstance().sendWarning(response, response.esito);
            console.log("->" + JSON.stringify(ris2));
          }
          res.json(ris2);
        }).catch((err) => {
          let response = new Risposta("Error /upload/ -> ElastiRemote", false, err);
          // console.log(JSON.stringify(response));
          EventRemote.getInstance().sendError(response);
          res.json(response);
          console.log("-----------------------------------------------------------------");
        });

      } else {
        let response = new Risposta("Error /upload/ -> ParserRemote fail", false, ris);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      }

    }).catch((err) => {
      let response = new Risposta("Error /upload/ -> ParserRemote catch", false, err);
      // console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);
    });
  });



app.post(
  "/saveMetadata/", (req, res, next) => {


    ElasticRemote.getInstance().addNewMetadata(req.body.elasticExport).then((ris: Risposta) => {

      if (ris.esito) {
        // console.log("-> OK");
        EventRemote.getInstance().client.publish(TOPIC, JSON.stringify(req.body.mongoExport));
        EventRemote.getInstance().client.publish(CONTACTS_TOPIC, JSON.stringify(req.body.contacts));
        let response = new Risposta("Ok saveMetadata/", true, null);
      } else {
        let response = new Risposta("Error saveMetadata/", false, ris);
        console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      }

    }).catch((err) => {
      let response = new Risposta("Error saveMetadata/ catch", false, err);
      // console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);
      console.log("-----------------------------------------------------------------");
    });
  });

app.get("/getAllContacts", (req, res) => {
  MongoRemote.getInstance()
    .getAllContacts()
    .then((risposta: Risposta) => {
      console.log("--------------------------------------");
      console.log(JSON.stringify(risposta));
      console.log("--------------------------------------");
      res.json(risposta);
    }).catch((err) => {
      let response = new Risposta("Error getAllContacts", false, err);
      // console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);
    })

});

app.get("/countAll", async (req, res) => {
  await MongoRemote.getInstance()
    .countAll()
    .then((risposta: Risposta) => {
      console.log("--------------------------------------");
      console.log(JSON.stringify(risposta));
      console.log("--------------------------------------");
      res.json(risposta);
    }).catch((err) => {
      let response = new Risposta("Error countAll", false, err);
      // console.log(JSON.stringify(response));
      EventRemote.getInstance().sendError(response);
      res.json(response);
    });

});

app.get("/test", async (req, res) => {

  res.json(RemoteStatus.getInstace().getStatus());

});


//---------------------------QUERY 

app.get(
  "/getAll_E", (req, res, next) => {
    console.log("--- GET ALL UGBD METADATA REQUEST USING ELASTIC---");
    QueryRemote.getInstance()
      .getAll()
      .then((risposta: Risposta) => {
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error getAll_E", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      });
  }
);


app.post(
  "/getQuery_Response", (req, res, next) => {
    console.log("--- GET ALL UGBD METADATA REQUEST USING ELASTIC GEO CAPABILITIES---");
    console.log("-------------------------------------------------------------------")
    console.log(req.body);
    console.log("-------------------------------------------------------------------")
    QueryRemote.getInstance()
      .getQueryResponse(req.body)
      .then((risposta: Risposta) => {
        console.log("--------------------------------------");
        console.log(risposta);
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error getQuery_Response", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      })
  }
);

app.get(
  "/getByID/:metadataId", (req, res, next) => {
    console.log("getProductByID----------------------------");
    console.log("req.params.metadataId ->", req.params.metadataId);
    MongoRemote.getInstance()
      .findMetadataByID(req.params.metadataId)
      .then((risposta: Risposta) => {
        res.json(risposta);
      }).catch((err) => {
        let response = new Risposta("Error /getByID/" + req.params.metadataId, false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      });
  }
);

app.get(
  "/DownloadMetadata/:metadataId", (req, res, next) => {
    console.log("getProductByID----------------------------");
    console.log("req.params.metadataId ->", req.params.metadataId);
    MongoRemote.getInstance()
      .findMetadataByID(req.params.metadataId)
      .then((risposta: Risposta) => {
        res.set({ "Content-Disposition": "attachment; filename=metadata.xml " });
        res.send(risposta.valore.rndt_xml);
      }).catch((err) => {
        let response = new Risposta("Error /DownloadMetadata/" + req.params.metadataId, false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      });
  }
);

EventRemote.getInstance().client.on("message", (topic, payload) => {
  try {
    let risposta: Risposta = Risposta.of(JSON.parse(payload.toString()));
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(JSON.stringify(risposta));
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
    RemoteStatus.getInstace().updateStatus(risposta);
  } catch (err) {
    let response = new Risposta("Mqtt error", false, err);
    // console.log(JSON.stringify(response));
    EventRemote.getInstance().sendError(response);
  }
})

app.listen(CONFIG.port, () => {
  // EventRemote.getInstance().sendLog("Express server listening on port p1d " + CONFIG.port);
  console.log("Express server listening on port p1d " + CONFIG.port);
  EventRemote.getInstance().sendLog("EdgeServer listening on port :" + CONFIG.port);
});


