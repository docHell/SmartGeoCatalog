import { DbJobs } from "./../providers/DbJobs";

import app from "./app";
import { Risposta } from '../models/Risposta'; 
import { MetadataExport } from '../models/Metadatas';

const PORT = 3705;
  
app.post(
  "/addMetadata", (req, res, next) => {
    console.log("--- POST METADATA ---");
    console.log("-------------------------------------------------------------------")
    // console.log(req.body);
    console.log("-------------------------------------------------------------------")
    let metadata : MetadataExport = MetadataExport.of(req.body);
    DbJobs.getInstance()
      .addMetadata(metadata)
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      });
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
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err) => {

      });
  }
);
app.get("/getAllContacts", (req, res) => {
  DbJobs.getInstance()
      .findAllContact()
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err) => {
        res.json(new Risposta("Errore 2 ", false, err) );
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
    res.json(new Risposta("Errore 3 ", false, err) );
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
      }).catch (()=> {
        res.json(new Risposta("Error2 getAll", false, null));
      });
  }
);


app.get("/test", (req, res) => {
  res.json(new Risposta("MongoDbService - v0.09a - 13-02-2020", true, new Date()));
});

app.listen(PORT, () => {
  console.log("Express server listening on port p1d " + PORT);
});
