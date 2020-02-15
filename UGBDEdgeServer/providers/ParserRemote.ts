 
import axios, { AxiosStatic } from 'axios';
import {Risposta} from "../models/Risposta"
import { Contacts } from '../models/Contacts';
export class ParserRemote {
  private static _instance: ParserRemote;
   

  // private static URL_PARSER: string = 'http://10.0.5.17:3725/';
  private static URL_PARSER: string = 'http://localhost:3725/';
  private static POST_METADATA = ParserRemote.URL_PARSER + 'addMetadata/';
  private static ADD_CONTACT = ParserRemote.URL_PARSER + 'addContact/'
  private static TO_PARSE = ParserRemote.URL_PARSER + 'toParse/'
  private static TEST = ParserRemote.URL_PARSER + 'test/';
  private constructor() {
    ParserRemote._instance = this;
  }
  public async getVersion() {
    axios.defaults.timeout = 5000
    let exit: Risposta;
    await axios.get(ParserRemote.TEST).then(value => {

      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("ParserService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("ParserService is down", false, err);
    })
    return exit;
  }
  public  async  toparse(ex : any) : Promise<Risposta>{
      let exit : Risposta;
      await axios.post(ParserRemote.TO_PARSE,ex).then( (value) =>{
     
          if (value.data) {
            exit = value.data 
          } else {
            exit = new Risposta("Errore Dal server Parsing", false, value);
          }   
      }).catch( (err)=> {
        
        exit = new Risposta("Errore Dal server Parsing", false, err);
      })
      return exit;    
  }

   

  public static getInstance(): ParserRemote {
    if (!this._instance) {
      this._instance = new ParserRemote();
    }
    return this._instance;
  }

   
}
