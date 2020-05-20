import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

import CONFIG from '../config/config.json';
export var Log_schema = new mongoose.Schema({
    _id: String,
    service: String,
    serviceip : String,
    type: Number,
    result: Boolean,
    creation : Date,
    description : Object
  
  });
  
 export interface Log_Db extends mongoose.Document {
    _id: String,
    service: String,
    serviceip : String,
    type: Number,
    result: Boolean,
    creation : Date,
    description : Object
  
}

export class Log {
    
    _id: string;
    service: string;
    serviceip : string;
    type: number;
    result: boolean;
    creation : Date;
    description : any;

    constructor(id: string, service :string, serviceip : string, type : number, result: boolean, description : string) {
        this._id = id;
        this.service = service;
        this.serviceip = serviceip;
        this.type = type;
        this.result = result;
        this.description = description;
        this.creation = new Date();
    }

    public static of(l : any ) {
        try {
            let log = new Log(l.id, l.service, l.serviceip, l.type, l.result, l.description);
            return log;
        }  catch (err) {
            return new Log(uuidv4(), CONFIG.name, CONFIG.port+"", 4, false, l);
        }
        
    }


}

 