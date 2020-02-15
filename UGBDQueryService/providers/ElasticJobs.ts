import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
import { UUID } from "angular2-uuid";
import { Shape } from '../models/GeoUtilClass';
import { Risposta } from "../models/Risposta";
import { Query } from '../models/Query';
import { existsSync } from 'fs';
import { EQuery } from '../models/ElasticQuery';
export class ElasticJobs {
  private static _instance: ElasticJobs;
  private static readonly ADDRESS: string = "http://10.0.1.95:9200/";
  // private static readonly ADDRESS: string = "http://127.0.0.1:9200/";
  public static readonly CHILDREN: string = "children";
  public static readonly GEOGRAPHICELEMENT: string = "geographicElement";
  private static client: Client;
  private static log = console.log.bind(console);
  private static readonly INDEX: string = "test_finale1";



  private constructor() {
    ElasticJobs._instance = this;


    ElasticJobs.client = new Client({
      node: [ElasticJobs.ADDRESS]
    });
  }

  private query_composer(query: Query) {

    let exit: EQuery = new EQuery();

    if (query.key) {
      let to_add = {
        "query_string": {
          "query": query.key,
          "fields": ["ugbd_full_search"]
        }
      };
      exit.query.bool.should.push(to_add)
    } else {
      let to_add = {
        "match_all": {}
      }
      exit.query.bool.should.push(to_add)
    }
    if (query.who) {
      let to_add = {
        "query_string": {
          "query": query.who,
          "fields": ["ugbd_people"]
        }
      };
      exit.query.bool.should.push(to_add)
    }

    if (query.accuracy) {
      let to_add;
      if (query.range) {

        let lte: number = +query.accuracy + +query.range;
        let gte: number = +query.accuracy - +query.range;
        to_add = {
          "range": {
            "ugbd_accuracy": {
              "gte": gte,
              "lte": lte,
              "boost": 1
            }
          }
        };
      } else {
        to_add = {
          "range": {
            "ugbd_accuracy": {
              "gte": +query.accuracy,
              "lte": +query.accuracy,
              "boost": 1
            }
          }
        };
      }

      exit.query.bool.should.push(to_add)
    }

    if (query.lineage) {
      let to_add = {
        "query_string": {
          "query": query.lineage,
          "fields": ["ugbd_lineage"]
        }
      };
      exit.query.bool.should.push(to_add)
    }



    if (query.shape != null) {
      exit.query.bool.filter = {
        "geo_shape": {
          "location": {
            "shape": {
              "coordinates": query.shape.coordinates,
              "type": query.shape.type
            },
            "relation": "intersects"
          }
        }
      }
    }
    console.log("----------------------------------------------------------")
    console.log("-QUERY : ")
    console.log("----------------------------------------------------------")
    console.log(JSON.stringify(exit))
    console.log("----------------------------------------------------------")


    return exit;


  }


  // this must be considered a test query 
  public async getAll_ID(): Promise<Risposta> {
    let exit: Risposta;
    try {
      const result = await ElasticJobs.client.search({
        index: ElasticJobs.INDEX,
        type: "singoli",
        body: {
          "query": {
            "match_all": {}
          }
        }
      })
      console.log("-------R-------------------------------------------");
      // console.log(JSON.stringify(result));
      console.log("-------/R-------------------------------------------");
      console.log("-------E-------------------------------------------");
      let list_of_meta: any[] = [];
      result["body"]["hits"]["hits"].forEach((value: any) => {
        console.log("Lunghezza : " + list_of_meta.length);
        list_of_meta.push(value);
      });
      console.log("-------/E-------------------------------------------");
      exit = new Risposta("ALL ID :", true, list_of_meta);
    } catch (err) {
      exit = new Risposta("ERROR : ALL ID :", false, err);
    }
    return exit;
  }

  public async getGeoProva(): Promise<Risposta> {
    let exit: Risposta;
    try {
      const result = await ElasticJobs.client.search({
        index: ElasticJobs.INDEX,
        type: "singoli",
        body: {
          "query": {
            "bool": {
              "must": {
                "match_all": {}
              },
              "filter": {
                "geo_shape": {
                  "location": {
                    "shape": {
                      "type": "envelope",
                      "coordinates": [[6.95434570312, 47.45455858479155], [2.8344726562, 45.410502277311544]]
                    },
                    "relation": "intersects"
                  }
                }
              }
            }
          }
        }
      })
      console.log(JSON.stringify(result));
      let list_of_meta: any[] = [];
      result["body"]["hits"]["hits"].forEach((value: any) => {

        list_of_meta.push(value);
      });
      exit = new Risposta("ALL ID :", true, list_of_meta);
    } catch (err) {
      exit = new Risposta("ERROR : ALL ID :", false, err);
    }
    return exit;
  }

  public async getQueryResult(query: Query): Promise<Risposta> {
    let exit: Risposta;
    console.log("--------getQueryResult-------------------------------------------");
    console.log("->" + JSON.stringify(this.query_composer(query)));
    console.log("-------/getQueryResult-------------------------------------------");
    try {
      const result = await ElasticJobs.client.search({
        index: ElasticJobs.INDEX,
        type: "singoli",
        body: this.query_composer(query)
      })
      console.log(JSON.stringify(result));
      let list_of_meta: any[] = [];
      result["body"]["hits"]["hits"].forEach((value: any) => {

        list_of_meta.push(value);
      });
      exit = new Risposta("Query :", true, list_of_meta);
    } catch (err) {
      exit = new Risposta("ERROR : QUERY :", false, err);
    }
    return exit;
  }


  public async getGeoQueryResult(query: Query): Promise<Risposta> {
    let exit: Risposta;
    console.log("->" + query.shape.type)
    try {
      const result = await ElasticJobs.client.search({
        index: ElasticJobs.INDEX,
        type: "singoli",
        body: {
          "query": {
            "bool": {
              "must": {
                "match_all": {}
              },
              "filter": {
                "geo_shape": {
                  "location": {
                    "shape": {
                      "type": query.shape.type,
                      "coordinates": query.shape.coordinates,
                    },
                    "relation": "intersects"
                  }
                }
              }
            }
          }
        }
      })
      console.log(JSON.stringify(result));
      let list_of_meta: any[] = [];
      result["body"]["hits"]["hits"].forEach((value: any) => {

        list_of_meta.push(value);
      });
      exit = new Risposta("Query :", true, list_of_meta);
    } catch (err) {
      exit = new Risposta("ERROR : QUERY :", false, err);
    }
    return exit;
  }


  public static getInstance(): ElasticJobs {
    if (!this._instance) {
      this._instance = new ElasticJobs();
    }
    return this._instance;
  }
}
