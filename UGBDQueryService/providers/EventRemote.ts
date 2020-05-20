 
import CONFIG from '../config/config.json';
import { connect } from 'mqtt';
import { Log} from '../models/Log'

export class EventRemote {

    public client = connect(CONFIG.mqtt, { clean: false, clientId: CONFIG.name, keepalive: 5 });
   
    private static _instance : EventRemote;

    public  subscribeTopic(topic : string) {
         this.client.subscribe(topic);
    }

    public sendLog(description : any) {
        let log = Log.LOG(description);
         this.client.publish(CONFIG.LOG_TOPIC,JSON.stringify(log));
    }

    public sendError(description : any) {
        let log = Log.ERROR(description);
        this.client.publish(CONFIG.LOG_TOPIC,JSON.stringify(log));
    }

    public sendWarning(description : any, result : boolean) {
        let log = Log.WARNING(description,result);
        this.client.publish(CONFIG.LOG_TOPIC,JSON.stringify(log));
    }

    private constructor() {
        EventRemote._instance = this;
    }

    public static getInstance() : EventRemote {
        if (!this._instance) {
            this._instance = new EventRemote();
        }
        return this._instance;
    }

    
 


}