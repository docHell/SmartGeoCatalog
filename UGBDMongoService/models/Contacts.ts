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

  public static of( c : any) : Contact {
    let exit : Contact = new Contact();
    exit._id = c._id;
    exit.mail = c.mail;
    exit.organization = c.organization;
    return exit;
  }
}
export class Contacts {

  document_id: string;
  contacts: Contact[];

  constructor(document_id: string, contacts: Contact[]) {
    this.document_id = document_id;
    this.contacts = contacts;
  }

  public static of( c : any) : Contacts {
    let cs : Contact[] = [];
    let _cs : any[] = c.contacts as any[];
    _cs.forEach((element : any) => {
      cs.push(Contact.of(element));
    })

    return new Contacts(c.document_id,cs);
  }
}