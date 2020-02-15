import * as mongoose from "mongoose";

export var Contact_schema = new mongoose.Schema({
  _id: String,
  mail: String,
  organization: String,
  articles: [String]

});

export interface Contact_Db extends mongoose.Document {
  _id: String,
  mail: String,
  organization: String
  articles: [String]

}

export class Contact {
  _id: string;
  mail: string;
  organization: string;

  constructor() {
  }
}
export class Contacts {

  document_id: string;
  contacts: Contact[];

  constructor(document_id: string, contacts: Contact[]) {
    this.document_id = document_id;
    this.contacts = contacts;
  }
}