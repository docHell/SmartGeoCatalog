
 
import axios, { AxiosStatic } from 'axios'; 
import { Contacts } from '../models/Contacts';
import { Risposta } from '../models/Risposta';
export class MongoRemote {
  private static _instance: MongoRemote;
   

  // private static URL: string = 'http://10.0.5.17:3705/';
  private static URL: string = 'http://localhost:3705/';
  private static POST_METADATA = MongoRemote.URL + 'addMetadata/';
  private static ADD_CONTACT = MongoRemote.URL + 'addContact/'
  private static GET_ALL_CONTACTS = MongoRemote.URL + 'getAllContacts/'
  private static COUNT_ALL = MongoRemote.URL + 'countAll/'
  private static GET_BY_ID = MongoRemote.URL + 'getByID/'
  private static TEST = MongoRemote.URL + 'test/';

   
  private constructor() {
    MongoRemote._instance = this;
  }

  public async getVersion() {
    let exit: Risposta;
    axios.defaults.timeout = 5000
    await axios.get(MongoRemote.TEST).then(value => {
     
      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("MongoDbService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("MongoDbService is down", false, err);
    })
    return exit;
  }

  public  async  addNewMetadata(metadata : any)  : Promise<Risposta>{
   
    let exit : Risposta;
      await axios.post(MongoRemote.POST_METADATA,metadata).then( value =>{
      
          if (value.data) {
            exit = value.data 
          } else {
            exit = new Risposta("Errore 1 Dal server Mongo", false, value);
          }   
      }).catch( (err)=> {
        // console.error("---ERROR-------");
        // console.log(err);
        exit = new Risposta("Errore 2 Dal server Mongo", false, err);
      })
      return exit;
    
  }

  public async findMetadataByID(metadataId : string ): Promise<Risposta>{
    let exit: Risposta;
    
    await axios.get(MongoRemote.GET_BY_ID+ metadataId).then(value => {
     
      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("MongoDbService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("MongoDbService is down", false, err);
    })
    return exit;

  }

  public  async addContact(contacts : any) : Promise<Risposta>{
    let exit : Risposta;
    await axios.post(MongoRemote.ADD_CONTACT,contacts).then( value =>{
      // console.error("---OK----------");
      // console.log(value);
      // console.log(value.data);
          if (value.data) {
            exit = value.data 
          } else {
            exit = new Risposta("Errore Dal server Mongo Contact", false, value);
          }       
    }).catch( (err)=> {
      // console.error("---ERROR-------");
      // console.log(err);
      exit = new Risposta("Errore Dal server Mongo Contact", false, err);
    })
    return exit;
   
  
}

public async getAllContacts() : Promise<Risposta>{

  let exit : Risposta;
  await axios.get(MongoRemote.GET_ALL_CONTACTS).then( value =>{
    // console.error("---OK----------");
    // console.log(value);
    // console.log(value.data);
        if (value.data) {
          exit = value.data 
        } else {
          exit = new Risposta("Errore Dal server Mongo Contact", false, value);
        }       
  }).catch( (err)=> {
    // console.error("---ERROR-------");
    // console.log(err);
    exit = new Risposta("Errore Dal server Mongo Contact", false, err);
  })
  return exit;
}

public async countAll() : Promise<Risposta>{

  let exit : Risposta;
  await axios.get(MongoRemote.COUNT_ALL).then( (value) =>{
          console.log("---EDGE---countAll-------");
          console.log("value : \n" + value);
          console.log("---/EDGE---countAll------");
    // console.log(value.data);
        if (value.data) {
          exit = value.data 
        } else {
          exit = new Risposta("Errore Dal server Mongo CountALL", false, value);
        }       
  }).catch( (err)=> {
    // console.error("---ERROR-------");
    console.error(err);
    exit = new Risposta("Errore Dal server Mongo CountALL", false, err);
  })
  return exit;
}
  

  public static getInstance(): MongoRemote {
    if (!this._instance) {
      this._instance = new MongoRemote();
    }
    return this._instance;
  }

   
}
