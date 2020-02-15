import * as mongoose from "mongoose";
import * as autoIncrement from "mongoose-auto-increment"
import * as Bluebird from "bluebird"; 
import { Product_schema, Product_Db, Product } from '../models/Product';
import { Risposta } from "../models/Risposta";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import * as basicAuth from "basic-auth";

export class DbJobs {
  private static _instance: DbJobs;
  private productInTheDb;
 
  private constructor() {
    DbJobs._instance = this;
    (<any>mongoose).Promise = Bluebird;
    // mongoose.connect('mongodb://127.0.0.1:27017/sodatest', {
    //     useMongoClient: true
    // });

    let connection = mongoose.createConnection("mongodb://127.0.0.1:27017/RNDTProva");
    mongoose.connect("mongodb://127.0.0.1:27017/RNDTProva");

    autoIncrement.initialize(connection);
    Product_schema.plugin(autoIncrement.plugin, "Schema")
    this.productInTheDb = mongoose.model("Metadatis", Product_schema);
  }

 

  public async findAll( ) : Promise<Risposta> {
    let exit:  Risposta;

    await this.productInTheDb.find({}, (err: String, productDB: Product_Db) => {
        if (err) {
          console.log("Errore -> ", err);
          exit = new Risposta("Errore server 1", false, null);
        } else {
          console.log("Trovato  -> ", JSON.stringify(productDB));
          exit =  new Risposta("Trovato", true, productDB) 
        }
      }
    );
    return exit;
  }
1
  

 
  

  public static getInstance(): DbJobs {
    if (!this._instance) {
      this._instance = new DbJobs();
    }
    return this._instance;
  }

  public authorisation(req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Content-type", "application/json");
    console.log(req.headers);
    function unauthorized(res) {
      res.set("WWW-Authenticate", "Basic realm=Authorization Required");
      return res
        .status(401)
        .send({ status: 401, message: "Invalid username or password" });
    }

    var user = basicAuth(req);
    console.log("-user : ", user);

    if (!user || !user.name || !user.pass) {
      console.log("UNAUTHORIZED");
      return unauthorized(res);
    }

    //            console.log('authorisation', this);

    if (
      user.name == "rossetto" &&
      user.pass == "e29c7e15-cba8-fa6f-d7e3-65c9e7f9a945"
    ) {
      console.log("AUTHORIZED");
      return next();
    } else {
      console.log("Errore in login");
      return unauthorized(res);
    }
  }
}
