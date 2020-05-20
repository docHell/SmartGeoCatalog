import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
var cors = require('cors');

class App {

    public app: express.Application;

  
    constructor() {
        this.app = express();
        this.config();        
     
    }

    private config(): void{
       
        this.app.use(cors());
      
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
          }); 
        this.app.use(bodyParser.urlencoded({ extended: false }));
        
    }

   

}

export default new App().app;