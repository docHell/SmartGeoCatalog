import { ElasticExport } from './ElasticExport';
import { MongoExport } from './MongoExport';
import { Contacts } from './Contacts';

export class ExportParsing {
    parsing_date: Date;
    base64_rndt: string;
    
    constructor() {
    }
    public static of (e : any) {
        let exit : ExportParsing = new ExportParsing();
        exit.base64_rndt = e.base64_rndt;
        exit.parsing_date = e.parsing_date;
        return exit;
    }
  }

export class ExportParsed {
    
    start_date: Date;
    end_date: Date;
    elasticExport : ElasticExport;
    mongoExport : MongoExport;
    contacts : Contacts;
    
    constructor() {
        this.start_date = new Date();
    }
    
    
}