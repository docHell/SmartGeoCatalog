import app from "./app";
import { Risposta } from '../models/Risposta';
import { Product_Db } from '../models/Product';
import { ElasticJobs } from '../providers/ElasticJobs';
import { ElasticExport } from '../models/ElasticExport';

const PORT = 3710;


 
app.post(
  "/addMetadata", (req, res, next) => {
    console.log("--- POST METADATA ---");
    console.log("-------------------------------------------------------------------")
    
    
    let e : ElasticExport = ElasticExport.of(req.body);
    console.log(JSON.stringify(e));
    console.log("-------------------------------------------------------------------")
    ElasticJobs.getInstance()
      .uploadDocument(e)
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      });
  }
);



app.get(
  "/checkindex", (req, res, next) => {
    console.log("-------------------------------------------------------------------")
    console.log("--- CHECK INDEX ---");
    console.log("-------------------------------------------------------------------")
    
   
    ElasticJobs.getInstance()
      .createIndex() 
      .then((risposta : Risposta)  => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(risposta));
        console.log("--------------------------------------");
        res.json(risposta);
      }).catch( (err ) => {
        console.log("--------------------------------------");
        console.log(JSON.stringify(err));
        console.log("--------------------------------------");
        res.json(new Risposta("ERROR CREATING INDEX", err, null));
      });
  }
);


app.get("/test", (req, res) => {
  res.json(new Risposta("ElasticService - v0.05a - 28-01-2020", true, new Date()));
});

app.listen(PORT, () => {
  console.log("Express server listening on port p1d " + PORT);
});
