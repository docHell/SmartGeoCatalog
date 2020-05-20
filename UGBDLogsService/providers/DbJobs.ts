import mongoose from "mongoose";
import Bluebird from "bluebird";

import basicAuth from "basic-auth";
import CONFIG from '../config/config.json';
import { Log_Db, Log_schema, Log } from '../models/Log';


export class DbJobs {
  private static _instance: DbJobs;
  private errorInTheDb;
  private logInTheDb;


  private constructor() {
    DbJobs._instance = this;
    (<any>mongoose).Promise = Bluebird;


    let connection = mongoose.createConnection(CONFIG.db);
    mongoose.connect(CONFIG.db);

    console.log(CONFIG.ERROR_WARNING_TABLE)
    console.log(CONFIG.LOG_TABLE)
    this.errorInTheDb = mongoose.model(CONFIG.ERROR_WARNING_TABLE, Log_schema);
    this.logInTheDb = mongoose.model(CONFIG.LOG_TABLE, Log_schema);

  }

  public async addLog(log: Log): Promise<boolean> {

    let exit: boolean;
    let loginTheDb;
    if( log.type> 0) {
      loginTheDb = this.errorInTheDb();
    } else {
      loginTheDb = this.logInTheDb();
    }
    // console.log(JSON.stringify(log))
    loginTheDb._id = log._id;
    loginTheDb.service = log.service;
    loginTheDb.serviceip = log.serviceip;
    loginTheDb.type = log.type;
    loginTheDb.result = log.result;
    loginTheDb.creation = log.creation;
    loginTheDb.description = log.description;
    await loginTheDb.save().then(() => {
      console.log("-> Metadata Saved");
      exit = true;
    }).catch((err) => {
      console.log(JSON.stringify(err))
      exit = false;
    });

    return exit;
  }

  public static getInstance(): DbJobs {
    if (!this._instance) {
      this._instance = new DbJobs();
    }
    return this._instance;
  }

}
