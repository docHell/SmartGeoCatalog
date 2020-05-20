import { EventRemote } from './../providers/EventRemote';
import { ElasticJobs } from './../providers/ElasticJobs';
 
import app from "./app";
import { Risposta } from '../models/Risposta';
import { EQuery } from '../models/ElasticQuery'; 
import CONFIG from '../config/config.json';
 
EventRemote.getInstance().client.subscribe(CONFIG.STATUS_TOPIC);

app.get(
  "/getAll_E", (req, res, next) => {
    console.log("--- GET ALL UGBD METADATA REQUEST USING ELASTIC---");
    ElasticJobs.getInstance()
      .getAll_ID()
      .then((risposta : Risposta)  => {
        // console.log("--------------------------------------");
        // console.log(JSON.stringify(risposta));
        // console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err) => {
        let response = new Risposta("Error /getAll_E", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      })
  }
);

app.get(
  "/getAll_E_GeoProva", (req, res, next) => {
    console.log("--- TEST GET ALL UGBD METADATA REQUEST USING ELASTIC GEO CAPABILITIES---");
    ElasticJobs.getInstance()
      .getGeoProva()
      .then((risposta : Risposta)  => {
        // console.log("--------------------------------------");
        // console.log(JSON.stringify(risposta));
        // console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err) => {
        let response = new Risposta("Error /getAll_E_GeoProva", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      })
  }
);
app.post(
  "/getQuery_Response", (req, res, next) => {
    console.log("--- GET ALL UGBD METADATA REQUEST USING ELASTIC GEO CAPABILITIES---");
    console.log("-------------------------------------------------------------------")
    console.log(req.body);
    console.log("-------------------------------------------------------------------")
    ElasticJobs.getInstance()
      .getQueryResult(req.body)
      .then((risposta : Risposta)  => {
        // console.log("--------------------------------------");
        // console.log(JSON.stringify(risposta));
        // console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err) => {
        let response = new Risposta("Error /getQuery_Response", false, err);
        // console.log(JSON.stringify(response));
        EventRemote.getInstance().sendError(response);
        res.json(response);
      })
  }
);


app.get("/test", (req, res) => {
  res.json(new Risposta("QueryService", true, new Date()));
  status();
});

app.listen(CONFIG.port, () => {
  EventRemote.getInstance().sendLog("QueryService listening on port :" + CONFIG.port);
  console.log("Express server listening on port p1d " + CONFIG.port);
  status();
});

function status() {
  let payload = JSON.stringify(new Risposta(CONFIG.name, true,  CONFIG.version));
  EventRemote.getInstance().client.publish(CONFIG.STATUS_TOPIC, payload);
}

setInterval(status, CONFIG.frequency);


//// PROVA 


let exit : EQuery = new EQuery();

let exit3 = {
  "query_string": {
    "query": "oppio",
    "fields": ["ugbd_full_search"]
  }
}
exit.query.bool.should.push(exit3);

console.log("+++++++++++++++++++++++++++++++++++++++++++++"); 
console.log(JSON.stringify(exit));

let exit2 = {
  "range": {
    "dataQualityInfo.report.result.value.Real": {
      "gte": 30,
      "boost": 5
    }
  }
};
exit.query.bool.should.push(exit2);
console.log("+++++++++++++++++++++++++++++++++++++++++++++");
console.log(JSON.stringify(exit));



exit.query.bool.filter = {
  "geo_shape": {
    "location": {
      "shape": {
        "coordinates": 2343124312,
        "type": "dddd"
      },
      "relation": "intersects"
    }
  }
}
console.log(JSON.stringify(exit));

console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

