import fs = require("fs");
import { Subject, Observable } from "rxjs";
import { location } from "../models/Geometry";
import { Contact, Contacts } from "../models/Contacts";
import { ElasticExport } from "../models/ElasticExport";
import { MongoExport } from "../models/MongoExport";
import { Risposta } from "../models/Risposta";
import {Md5} from 'ts-md5/dist/md5'; 
import { ExportParsing, ExportParsed } from '../models/ExportParsing';

const Parser = require("inspire-parser-quality").Parser;

export class ParserJob {
  private static _instance: ParserJob;
  public static readonly CHILDREN: string = "children";
  public static readonly GEOGRAPHICELEMENT: string = "geographicElement";
  

  private constructor() {
    ParserJob._instance = this;
  
  }

  public static getInstance(): ParserJob {
    if (!this._instance) {
      this._instance = new ParserJob();
    }
    return this._instance;
  }

  public static childrenFilter(obj: object) {
    if (obj[this.CHILDREN]) {
      return obj["children"][0];
    } else {
      return obj;
    }
  }
  
  public static estractNumeric(doc : any) {
    try {
    // console.log("Prima : " + doc.dataQualityInfo.report.result.value.Real);
    doc.dataQualityInfo.report.result.value.Real = parseFloat(doc.dataQualityInfo.report.result.value.Real);
    // console.log("Dopo : " + doc.dataQualityInfo.report.result.value.Real);
    } catch (err) {
      console.log("Non c'è questo valore!");
    }
    return doc;
  }

  

  public static fromBoundingBoxToPolygon(obj: any): any {
    // {"westBoundLongitude":9.09069,"eastBoundLongitude":9.6169,"southBoundLatitude":45.30822,"northBoundLatitude":45.58249}

    let exit: any[][][] = [];
    exit[0] = [];
    exit[0].push([obj.westBoundLongitude, obj.southBoundLatitude]);
    exit[0].push([obj.eastBoundLongitude, obj.southBoundLatitude]);
    exit[0].push([obj.eastBoundLongitude, obj.northBoundLatitude]);
    exit[0].push([obj.westBoundLongitude, obj.northBoundLatitude]);
    exit[0].push([obj.westBoundLongitude, obj.southBoundLatitude]);
    return exit;
  }

  public static geoFilter(obj: object) {
    for (let key in obj) {
      // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

      let exit = this.findASpecificKey(obj[key], this.GEOGRAPHICELEMENT);
      // console.log("--> " + exit);

      if (exit) {
        obj["location"] = new location(
          "Polygon",
          this.fromBoundingBoxToPolygon(exit)
        );
        break;
      }
      // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    }
    return obj;
  }
  public static pushSet(contacts: Contact [], contact : Contact) : Contact [] {

    function findConcat (contact1 : Contact) {
      return contact1._id === contact._id;
    }
    if (!contacts.find(findConcat)) {
      contacts.push(contact);
    }


    return contacts;

  }
  public static findEmails(where_to_find: any, setEmail : Contact [] ): Contact [] {

    // console.log("---------------------------------")
    // console.log(JSON.stringify(setEmail))
    // console.log("---------------------------------")
    let a : string = "a";

    if (typeof where_to_find === "number") {
      // console.log("-NOT  ok-");
      // return null;
    } else {
      // console.log("-ok-");
      // if (typeof where_to_find === "string") {
      // console.log("- IS A STRING -");

      // console.log(JSON.stringify(where_to_find))
      // console.log("---------------------------------")

      if (where_to_find["organisationName"]) {

        // console.log(JSON.stringify(where_to_find["organisationName"]))
        try {
          // console.log(JSON.stringify(where_to_find["contactInfo"]["address"]))
          if (where_to_find["contactInfo"]["address"]["electronicMailAddress"]) {
            // where_to_find = where_to_find.replace("mailto:", "");
            let organization: string = where_to_find["organisationName"]
            let email = where_to_find["contactInfo"]["address"]["electronicMailAddress"].replace("mailto:", "");
            let contact: Contact = new Contact(email, organization);
            // console.log("---------------------------------")
            // console.log(JSON.stringify(contact))
            // console.log("---------------------------------")

            
            setEmail = ParserJob.pushSet(setEmail,contact);
            // console.log(JSON.stringify(setEmail))
            // console.log("************************************")
            // return setEmail;
          } else {
            // console.log("-------NON TROVO---------------")
          }
        } catch (err) {
          console.log("---------------------------------")
          console.log("----------HO FALLITO-------------")
          console.log("---------------------------------")
          console.log(err)
          // console.log("---------------------------------")
          // console.log(JSON.stringify(where_to_find))
          // console.log("---------------------------------")
        }

      } else {
        if (typeof where_to_find !== "string") {
          for (let key in where_to_find) {
            // console.log("key : " + key);
            let temp : Contact [] = ParserJob.findEmails(where_to_find[key], setEmail);
            if (temp)  {
              temp.forEach( (c :Contact) => {
                // setEmail.push(c);
                setEmail = ParserJob.pushSet(setEmail,c);
                // console.log("------>" + JSON.stringify(c))
              });
              a = "b"
            } else {
              // console.log("---------------------------------")
            }
          }
        } 
      }
    }
    // console.log("***"+ a+ "***>" + JSON.stringify(setEmail))
    return  setEmail;
  }
  public static validateEmail(email: string) {
    let re = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return re.test(String(email).toLowerCase());
  }

  
  public static findASpecificKey(
    where_to_find: any,
    key_tosearch: string
  ): any {
    // console.log("value : "+ JSON.stringify(value))
    if (
      typeof where_to_find === "string" ||
      typeof where_to_find === "number"
    ) {
      // console.log("-NOT  ok-");
      return null;
    } else {
      for (let key in where_to_find) {
        if (key == key_tosearch) {
          // console.log(
          //   "---------------------------------------------------------"
          // );
          // console.log("key : " + JSON.stringify(key));
          // console.log("value : " + JSON.stringify(where_to_find[key]));
          // console.log("---------------------------------------------------------");
          return where_to_find[key];
        } else {
          // console.log("key : " + JSON.stringify(key));
          // console.log("value : " + JSON.stringify(value[key]));

          let exit = this.findASpecificKey(where_to_find[key], key_tosearch);

          if (exit) return exit;
        }
      }
    }
  }

  public xmlParser(rndt_path : string, rndt: string): Observable<Risposta> {
    console.log("********************************************")
    console.log("xmlParser")
    console.log(rndt_path)
    console.log("********************************************")
    let esito : ExportParsed  = new ExportParsed ();
    
    let exit: Subject<Risposta> = new Subject<Risposta>();

    
    let parser = new Parser();
    // console.log("********************************************")
    try {
      console.log("-> Step 1 ")
      // console.log("********************************************")
      // console.log("Entro nel try")
      // console.log("********************************************")
      // let xmlStream = fs.createReadStream(rndt_path);
      
      fs.createReadStream(rndt_path).pipe(parser).once("error", (err) => {
        console.log("********************************************")
        console.log("Errore -> " + err)
        console.log("********************************************")
        exit.next(new Risposta("ERROR PARSING", false, err));
      }).once("result", (result ) => {
        // console.log("********************************************")
        // console.log("ENTRO FINE")
         
       
        // console.log(result)
        // console.log("********************************************")
        let doc: any = ParserJob.geoFilter(ParserJob.childrenFilter(result.body));
        doc = ParserJob.estractNumeric(doc);
        // console.log(doc)
        // console.log("***********************************************************************");
        let aaa = ParserJob.findEmails(doc,  []);
        let id: string = Md5.hashStr(JSON.stringify(doc)).toString();
        // let toMongoPerson = new Contacts(id,aaa);
        let exit_mongo : MongoExport = new MongoExport(id);
        let exit_elastic : ElasticExport = new ElasticExport(id);
        exit_mongo.rndt_json = doc;
        exit_mongo.rndt_xml = rndt; 
        exit_elastic.rndt_json = doc;   
        esito.contacts = new Contacts(id,aaa);
        esito.elasticExport =exit_elastic;
        esito.mongoExport = exit_mongo;

        esito.end_date = new Date(); 
        
        
        // console.log("Finish");
        // console.log("********************************************")
        exit.next(new Risposta("OK Parsed ", true, esito));
      }) 
    } catch (error) {
      console.log("-----------------------------------------------");
      console.log("----------HO FALLITO IL PARSING 2 ----------------");
      console.log("-----------------------------------------------");
      console.log(error);
      exit.next(new Risposta("ERROR PARSING", false, error));
      
      
      console.log("------------------------------------------");
    }
    return exit.asObservable();
  }

}
