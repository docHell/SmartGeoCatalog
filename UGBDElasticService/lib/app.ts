import express from "express";
import  bodyParser from "body-parser";

var cors = require('cors');

class App {

    public app: express.Application;

    

    constructor() {
        this.app = express();
        this.config();        
        
    }

    private config(): void{
        // support application/json type post data
        this.app.use(cors());
        // this.app.use(express.bodyParser({limit: '50mb'}));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
          });
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        
    }

    

}

export default new App().app;