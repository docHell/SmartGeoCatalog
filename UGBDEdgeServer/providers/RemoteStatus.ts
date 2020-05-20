import { Risposta } from './../models/Risposta';
import CONFIG from '../config/config.json';
import { map } from 'bluebird';
export class RemoteStatus {



    
    private STATUS_MAP = new Map();
    private static _instance : RemoteStatus;

    private constructor() {
        RemoteStatus._instance = this;
    }

    public static getInstace() : RemoteStatus {
        if (!this._instance) {
            this._instance = new RemoteStatus();
        }
        return this._instance;
    }

    public updateStatus(risposta : Risposta) {

        console.log(risposta)
        if (CONFIG.services.indexOf(risposta.status) >=0 ) {
            this.STATUS_MAP.set(risposta.status, risposta);
        }
    }

    public getStatus() : Risposta[]{        
        let exit : Risposta [] =  [];
        let now : Date = new Date();
       
        CONFIG.services.forEach( (key : string) =>{

            if (this.STATUS_MAP.has(key)) {
                console.log("->" + key);
                let value : Risposta = this.STATUS_MAP.get(key);
                let difference  : number = now.getTime() - value.data.getTime();
                console.log("->" + difference);
                if (difference < CONFIG.frequency) {
                    exit.push(value);
                } else {
                    exit.push(new Risposta(key, false, this.STATUS_MAP.get(key).value));
                }
                console.log("--------------------------------------------------------");
            } else {
                exit.push(new Risposta(key, false, null));
            }
            
            
        })

        return exit;
    }



}