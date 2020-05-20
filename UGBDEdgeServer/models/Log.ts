import { v4 as uuidv4 } from 'uuid';
import CONFIG from '../config/config.json';

export class Log {
    
    id: string;
    service: string;
    serviceip : string;
    type: number;
    result: boolean;
    creation : Date;
    description : any;

    constructor(id: string, service :string, serviceip : string, type : number, result: boolean, description : string) {
        this.id = id;
        this.service = service;
        this.serviceip = serviceip;
        this.type = type;
        this.result = result;
        this.description = description;
        this.creation = new Date();
    }

    public static WARNING(description : string, result : boolean) {
        return new Log(uuidv4(), CONFIG.name, CONFIG.port+"", 1,result ,description);
    }

    public static LOG(description : string) {
        return new Log(uuidv4(), CONFIG.name, CONFIG.port+"", 0,true ,description);
    }

    public static ERROR(description : string) {
        return new Log(uuidv4(), CONFIG.name, CONFIG.port+"", 2,false ,description);
    }


}

 