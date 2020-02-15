import * as mongoose from "mongoose";
import { throws } from "assert";
import { any } from "bluebird";
import {Md5} from 'ts-md5/dist/md5';
export var Contact_schema = new mongoose.Schema({
  _id: String,
  mail: String,
  organization: String

});

export interface Contact_Db extends mongoose.Document {
    _id: String,
    mail: String,
    organization: String
  
}

export class Contact {
    _id: string;
    mail: string;
    organization: string;
  
  constructor( mail: string,     organization: string) {
    this.mail = mail;
    this.organization = organization;
    this._id =  Md5.hashStr(this.mail.toLowerCase()+this.organization.toLowerCase()).toString();

  }
}
export class Contacts {
    
    document_id : string;
    contacts : Contact [];

    constructor(document_id : string, contacts : Contact []) {
        this.document_id = document_id;
        this.contacts = contacts;
    }
}
