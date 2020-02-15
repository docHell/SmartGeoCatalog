import { Query } from './../models/Query';

import axios, { AxiosStatic } from 'axios';
import { Risposta } from '../models/Risposta';
export class QueryRemote {
  private static _instance: QueryRemote;


  private static URL: string = 'http://localhost:3700/'; 
  // private static URL: string = 'http://10.0.5.17:3700/'; 
  private static TEST = QueryRemote.URL + 'test/';
  private GET_ALL = QueryRemote.URL + 'getAll/';
  private GET_ALL_E = QueryRemote.URL + 'getAll_E/';
  
  private GET_QUERY_RESPONSE = QueryRemote.URL + 'getQuery_Response/';

  private constructor() {
    QueryRemote._instance = this;
  }

  public async getVersion() {
    axios.defaults.timeout = 5000
    let exit: Risposta;
    await axios.get(QueryRemote.TEST).then(value => {

      if (value.data) {
        exit = value.data 

      } else {
        exit = new Risposta("QueryService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("QueryService is down", false, err);
    })
    return exit;
  }


  async getAll(): Promise<Risposta> {

    let exit: Risposta;
    await axios.get(this.GET_ALL_E).then(value => {

      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("QueryService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("QueryService is down", false, err);
    })
    return exit;
 
  }

 

  async getQueryResponse(tosearch : Query): Promise<Risposta> {

    let exit: Risposta;

    console.log("-----tosearch----------- ----------------------");
    console.log(tosearch);
    console.log(this.GET_QUERY_RESPONSE);
    console.log("-----/tosearch----------- ----------------------");

    await axios.post(this.GET_QUERY_RESPONSE, tosearch).then(value => {
      console.log("----- ----------- ----------------------");
      console.log(value);
      console.log("------value---------------------------");
      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("QueryService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("QueryService is down", false, err);
    })
    return exit;
    
  }
 


  public static getInstance(): QueryRemote {
    if (!this._instance) {
      this._instance = new QueryRemote();
    }
    return this._instance;
  }


}
