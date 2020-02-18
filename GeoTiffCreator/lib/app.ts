// import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
var cors = require("cors");

class App {
  // public app: express.Application;

  public mongoUrl: string = "mongodb://127.0.0.1:27017/provaEngage";

  constructor() {
    // this.app = express();
    // this.config();
    this.mongoSetup();
  }

  private config(): void {
    // support application/json type post data
    // this.app.use(cors());
    // this.app.use(bodyParser.json());
    // this.app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //     next();
    //   });
    // //support application/x-www-form-urlencoded post data
    // this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    // mongoose.Promise = require('bluebird');
    mongoose.connect(
      this.mongoUrl,
      { useNewUrlParser: true }
    );
  }
}

export default new App();
