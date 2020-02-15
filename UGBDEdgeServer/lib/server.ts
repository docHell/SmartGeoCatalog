import { QueryRemote } from './../providers/QueryRemote';


import app from "./app";
import { Risposta } from '../models/Risposta';
import { ParserRemote } from '../providers/ParserRemote';
import { ElasticRemote } from '../providers/ElasticRemote';
import { MongoRemote } from '../providers/MongoRemote';

const PORT = 3800;


app.post(
  "/toParse/", (req, res, next) => {
    ParserRemote.getInstance().toparse(req.body).then((ris: Risposta) => {
      console.log("Correctly redirected to ParseServer")
      res.json(ris);
    }).catch((err) => {
      res.json(new Risposta("Errore query Edge", false, err));
    });
  });


app.post(
  "/saveMetadata/", (req, res, next) => {
    console.log("-----------------------------------------------------------------");
    console.log(JSON.stringify(req.body.elasticExport));
    console.log("-----------------------------------------------------------------");
    ElasticRemote.getInstance().addNewMetadata(req.body.elasticExport).then((ris: Risposta) => {
      console.log("-Correctly redirected to Elastic Server")
      console.log("->" + JSON.stringify(ris));
      if (ris.esito) {
        MongoRemote.getInstance().addNewMetadata(req.body.mongoExport).then((ris: Risposta) => {
          console.log("Correctly redirected to Mongo Server")
          MongoRemote.getInstance().addContact(req.body.contacts).then((ris: Risposta) => {
            console.log("Correctly redirected to Mongo Server Contact")
            res.json(ris);
          }).catch((err) => {
            res.json(new Risposta("Errore query Mongo Contact", false, err));
          });
        }).catch((err) => {
          res.json(new Risposta("Errore query Mongo", false, err));
        });
      } else {
        res.json(ris);
      }
    }).catch((err) => {
      res.json(new Risposta("Errore query Edge", false, err));
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
      res.json(new Risposta("Errore 2 ", false, err));
    })

});

app.get("/countAll",async (req, res) => {
  await MongoRemote.getInstance()
    .countAll()
    .then((risposta: Risposta) => {
      console.log("--------------------------------------");
      console.log(JSON.stringify(risposta));
      console.log("--------------------------------------");
      res.json(risposta);
    }).catch((err) => {
      res.json(new Risposta("Errore 2 ", false, err));
    })

});

app.get("/test",async (req, res) => {

  let risposte: Risposta[] = [];
  await MongoRemote.getInstance().getVersion().then((ris1: Risposta) => {
    risposte.push(ris1);
  }).catch((err) => {
    new Risposta("MongoDbService is down", false, new Date());
  })
  await ParserRemote.getInstance().getVersion().then((ris2: Risposta) => {
    risposte.push(ris2);
  }).catch((err) => {
    new Risposta("ParserService is down", false, new Date());
  })
  await QueryRemote.getInstance().getVersion().then((ris3: Risposta) => {
    risposte.push(ris3);
  }).catch((err) => {
    new Risposta("QueryService is down", false, new Date());
  })
  await ElasticRemote.getInstance().getVersion().then((ris4: Risposta) => {
    risposte.push(ris4);
  }).catch((err) => {
    new Risposta("QueryService is down", false, new Date());
  })
  risposte.push(new Risposta("EdgeServer - v0.09b - 14-02-2020", true, new Date()));
  res.json(risposte);
});


//---------------------------QUERY 

app.get(
  "/getAll_E", (req, res, next) => {
    console.log("--- GET ALL UGBD METADATA REQUEST USING ELASTIC---");
    QueryRemote.getInstance()
      .getAll()
      .then((risposta : Risposta)  => {
        res.json(risposta);
      }).catch((err) => {
        res.json(new Risposta("Errore 3 ", false, err));
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
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(risposta);
        console.log("--------------------------------------");
        res.json(risposta);
      });
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
      }).catch (()=> {
        res.json(new Risposta("Error2 getAll", false, null));
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
        res.set({"Content-Disposition":"attachment; filename=metadata.xml "});
        res.send(risposta.valore.rndt_xml);
        // res.setHeader('Content-disposition', 'attachment; filename=metadata.xml');
        // res.setHeader('Content-type', 'text/xml');
        // res.charset = 'UTF-8';
        // res.write(risposta.valore);
        // res.end();
      }).catch (()=> {
        res.json(new Risposta("Error2 getAll", false, null));
      });
  }
);



app.listen(PORT, () => {
  console.log("Express server listening on port p1d " + PORT);
});
