import { ElasticJobs } from './../providers/ElasticJobs';
  

import app from "./app";
import { Risposta } from '../models/Risposta';
import { EQuery } from '../models/ElasticQuery';
import { Product_Db } from '../models/Product';

const PORT = 3700;


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
      });
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
      });
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
      });
  }
);


app.get("/test", (req, res) => {
  res.json(new Risposta("QueryService - v0.05a - 28-01-2020", true, new Date()));
});

app.listen(PORT, () => {
  console.log("Express server listening on port p1d " + PORT);
});



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

