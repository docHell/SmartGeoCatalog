import * as mongoose from "mongoose";
import { throws } from "assert";
import { any } from "bluebird";

export var Product_schema = new mongoose.Schema({
  _id: String,
  title: String,
  rndt: Object,
  creationdate : Date
});

export interface Product_Db extends mongoose.Document {
  _id: String;
  title: String;
  rndt: Object;
  creationdate : Date;
}

export class Product {
  _id: String;
  title: String;
  rndt: Object;
  creationdate : Date;

  constructor() {}
}
