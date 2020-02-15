
import axios, { AxiosStatic } from 'axios';
import { Risposta } from '../models/Risposta';
export class ElasticRemote {
  private static _instance: ElasticRemote;

  // private static URL: string = 'http://10.0.5.17:3710/';
  private static URL: string = 'http://localhost:3710/';
  private static POST_METADATA = ElasticRemote.URL + 'addMetadata/';
  private static TEST = ElasticRemote.URL + 'test/';


  private constructor() {
    ElasticRemote._instance = this;
  }

  public async getVersion() {
    axios.defaults.timeout = 5000
    let exit: Risposta;
    await axios.get(ElasticRemote.TEST).then(value => {

      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("ElasticService is down", false, new Date());
      }
    }).catch((err) => {

      exit = new Risposta("ElasticService is down", false, err);
    })
    return exit;
  }

  public async  addNewMetadata(metadata: any): Promise<Risposta> {
    let exit: Risposta;
    await axios.post(ElasticRemote.POST_METADATA, metadata).then(value => {

      if (value.data) {
        exit = value.data

      } else {
        exit = new Risposta("Errore 1 Dal server Elastic", false, value);
      }
    }).catch((err) => {

      exit = new Risposta("Errore 2 Dal server Elastic", false, err);
    })
    return exit;

  }






  public static getInstance(): ElasticRemote {
    if (!this._instance) {
      this._instance = new ElasticRemote();
    }
    return this._instance;
  }


}
