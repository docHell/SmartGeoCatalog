import * as mongoose from "mongoose";
 

export var Metadata_schema = new mongoose.Schema({
  _id: String,
  title: String,
  rndt_json: Object,
  rndt_xml : Object,
  data_last_insert : Date,
  creationdate : Date,
  history : [{data_insert : Date,
    rndt_json : Object,
    rndt_xml : String}]
});


export interface Metadata_Db extends mongoose.Document {
  _id: String,

  rndt_json: Object,
  rndt_xml : Object,
  data_last_insert : Date,
  creationdate : Date,
  history :  [{data_insert : Date,
    rndt_json : Object,
    rndt_xml : String}]
}

export interface Metadata_History_if extends mongoose.Document {
  data_insert : Date,
  rndt_json : Object,
  rndt_xml : String
}


export class Metadata {
  _id: string;

  rndt_json: object;
  rndt_xml : object;
  data_last_insert : Date;
  creationdate : Date;
  history : [Metadata_History_if_ex]

  constructor() {}
}

export interface Metadata_History_if_ex {
  data_insert : Date;
  rndt_json : object;
  rndt_xml : string
}


export class MetadataExport {
  _id: string;   
  rndt_json: object;
  rndt_xml : object;
  constructor() {}

  static of (blob : any) {
    let exit : MetadataExport = new MetadataExport()
    exit._id = blob._id;
    exit.rndt_json = blob.rndt_json;
    exit.rndt_xml = blob.rndt_xml;
    return exit;
  }


}
