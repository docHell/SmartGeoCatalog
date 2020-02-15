import * as mongoose from "mongoose";
import * as autoIncrement from "mongoose-auto-increment"
import * as Bluebird from "bluebird";
import { Risposta } from "../models/Risposta";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import * as basicAuth from "basic-auth";

import { Metadata_schema, Metadata, MetadataExport, Metadata_Db } from '../models/Metadatas';
import { Contacts, Contact_schema, Contact_Db } from '../models/Contacts';
import { runInThisContext } from "vm";
import { Contatore } from '../models/Contatore';

export class DbJobs {
  private static _instance: DbJobs;
  private metadataInTheDb;
  private contactInTheDb;

  private constructor() {
    DbJobs._instance = this;
    (<any>mongoose).Promise = Bluebird;


    let connection = mongoose.createConnection("mongodb://127.0.0.1:27017/RNDTProva");
    mongoose.connect("mongodb://127.0.0.1:27017/RNDTProva");


    this.metadataInTheDb = mongoose.model("Metadatas", Metadata_schema);
    this.contactInTheDb = mongoose.model("Contacts", Contact_schema);
  }

  public async addMetadata(metadata: MetadataExport): Promise<Risposta> {

    let exit: Risposta;
    let metadataDb = this.metadataInTheDb();

    await this.metadataInTheDb.find({ _id: metadata._id }).then(async (result: Metadata_Db[]) => {
      console.log("----List of Metadata with the same id---")
      console.log(result)
      console.log("----------------------------------------")
      if (result.length > 0) {
        console.log("-> There is a Metadata with the same id");
        exit = new Risposta("Error 1 Insert Document already present", false, null);

      } else {
        console.log("-> There is not a Metadata with the same id");

        metadataDb._id = metadata._id;
        metadataDb.rndt_json = metadata.rndt_json;
        metadataDb.rndt_xml = metadata.rndt_xml;
        metadataDb.creationdate = new Date();
        metadataDb.data_last_insert = new Date();


        await metadataDb.save().then(() => {
          console.log("-> Metadata Saved");
          exit = new Risposta("Ok", true, null);

        }).catch((err: String) => {
          console.log("-> ERROR Metadata NOT Saved");
          exit = new Risposta("Error 2 Insert Document", false, null);
        });

      }
    });

    console.log("-> : ", JSON.stringify(exit));
    return exit;
  }

  public async addContacts(contacts: Contacts): Promise<Risposta> {

    let exit: Risposta;
    let esito: string = ""
    for (const contact of contacts.contacts) {
      await this.contactInTheDb.find({ _id: contact._id }).then(async (result: Contact_Db[]) => {

        function findDoc(article_id: string) {
          return article_id === contacts.document_id;
        }

        console.log("->" + JSON.stringify(result))
        if (result.length > 0) {
          let contactInDb: Contact_Db = result[0];
          if (contactInDb.articles) {
            if (!contactInDb.articles.find(findDoc)) {
              contactInDb.articles.push(contacts.document_id);
              await contactInDb.save().then().catch((err) => {
                console.log("Error Contact 1 : ", err);
                esito = esito + contact._id + " "
              })
            }
          }
        } else {
          let contactInTheDb = this.contactInTheDb();
          contactInTheDb._id = contact._id;
          contactInTheDb.mail = contact.mail;
          contactInTheDb.organization = contact.organization;
          contactInTheDb.articles.push(contacts.document_id);
          await contactInTheDb.save().then().catch((err: string) => {
            if (err) {
              console.log("Error Contact 2 : ", err);
              esito = esito + contact._id + " "
            }
          })
        }


      }).catch((err) => {
        exit = new Risposta("Add Contact Error1", false, err);
      })
    }
    if (!exit) {
      if (esito === "") {
        exit = new Risposta("OK Add contact", true, null);
      } else {
        exit = new Risposta("Error addContacts : " + esito, false, null);
      }
    }


    return exit;
  }



  public async findAllContact(): Promise<Risposta> {
    let exit: Risposta;

    await this.contactInTheDb.find({}, (err: String, contacts: Contacts[]) => {
      if (err) {
        console.log("Errore -> ", err);
        exit = new Risposta("Errore server 1", false, null);
      } else {
        console.log("Trovato  -> ", JSON.stringify(contacts));
        exit = new Risposta("Trovato", true, contacts)
      }
    }
    );
    return exit;
  }


  public async findMetadataByID(id : string ): Promise<Risposta> {
    let exit: Risposta;

    await this.metadataInTheDb.findOne({_id : id }, (err: String, metadato: Metadata_Db) => {
      if (err) {
        console.log("Errore -> ", err);
        exit = new Risposta("Errore server 1", false, null);
      } else {
        console.log("Trovato  -> ", JSON.stringify(metadato));
        exit = new Risposta("Trovato", true, metadato)
      }
    }
    );
    return exit;
  }


  public async countAllmetadata(): Promise<Risposta> {
    let meta: number = 0;
    let people: number = 0;
    try {
      meta = await this.metadataInTheDb.countDocuments({});
    } catch {
      console.log("DbJobs Mongoservice -> countAllmetadata 1");
    }
    try {
      people = await this.contactInTheDb.countDocuments({});
    } catch {
      console.log("DbJobs Mongoservice -> contactInTheDb 1");
    }

    return new Risposta("OK", true, new Contatore(meta, people));


  }






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
