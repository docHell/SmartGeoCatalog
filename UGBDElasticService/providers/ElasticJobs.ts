
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
import { UUID } from "angular2-uuid";
import { Shape } from '../models/GeoUtilClass';
import { Risposta } from "../models/Risposta";
import { ElasticExport } from "../models/ElasticExport";
import { Query } from '../models/Query';
import { existsSync } from 'fs';
import { Subject, Observable } from "rxjs";
import basicAuth from "basic-auth";

export class ElasticJobs {
  private static _instance: ElasticJobs;
  // private static readonly ADDRESS: string = "http://10.0.1.95:9200/";
  private static readonly ADDRESS: string = "http://127.0.0.1:9200/";
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

  public ping() {

    ElasticJobs.client.ping(

      (error) => {
        if (error) {
          console.error("elasticsearch cluster is down!");

        } else {
          console.log("TUTTO OK");
        }
      }
    );

  }



  public async uploadDocument(e: ElasticExport): Promise<Risposta> {
    // console.log("********************************************")
    // console.log("UPLOAD DOCUMENT")
    let exit: Risposta;
    let uuid = e._id;
    let doc = e.rndt_json;

    const doc2: RequestParams.Index =
    {
      index: ElasticJobs.INDEX,
      type: "singoli",
      id: uuid,
      body: JSON.stringify(doc)
    };

    await ElasticJobs.client.index(doc2).then(() => {
      exit = new Risposta("Uploaded Document : " + e._id, true, null)
    }).catch((err) => {
      exit = new Risposta("ERROR Uploaded Document : " + e._id, false, err);
    })
    // console.log("********************************************")

    return exit;
  }


  public authorisation(req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Content-type", "application/json");
    console.log(req.headers);
    function unauthorized(res) {
      res.set("WWW-Authenticate", "Basic realm=Authorization Required");
      return res
        .status(401)
        .send({ status: 401, message: "Invalid username or password" });
    }

    var user = basicAuth(req);
    console.log("-user : ", user);

    if (!user || !user.name || !user.pass) {
      console.log("UNAUTHORIZED");
      return unauthorized(res);
    }

    //            console.log('authorisation', this);

    if (
      user.name == "rossetto" &&
      user.pass == "e29c7e15-cba8-fa6f-d7e3-65c9e7f9a945"
    ) {
      console.log("AUTHORIZED");
      return next();
    } else {
      console.log("Errore in login");
      return unauthorized(res);
    }
  }

  public static getInstance(): ElasticJobs {
    if (!this._instance) {
      this._instance = new ElasticJobs();
    }
    return this._instance;
  }


  public  checkIndex() : Observable<Risposta> {
    let exit: Subject<Risposta> = new Subject<Risposta>();
    ElasticJobs.client.cat.indices({ "format": "json" }, (err, res) => {
      console.log("->" + JSON.stringify(res));
      console.log("->" + err);
      if (err) {
        // console.log("->qui");
        exit.next(new Risposta("ERROR",false,err));
        // exit = new Risposta("ERROR",false,err);
      } else {
        // console.log("->quo");
        // exit = new Risposta("OK",true,res.body);
        exit.next(new Risposta("OK",true,res.body));
        // console.log(JSON.stringify(exit));
      }
      
    })
    return exit.asObservable();
  }

  public async createIndex(): Promise<Risposta> {
    let exit: Risposta;
    await ElasticJobs.client.indices.create(
      {
        index: ElasticJobs.INDEX,
        body: {

          mappings: {

            singoli: {

              properties: {
                ugbd_full_search: {
                  type: "text"
                },
                ugbd_people: {
                  type: "text"
                },
                ugbd_accuracy: {
                  type: "float"
                },
                ugbd_lineage: {
                  type: "text"
                },
                ugbd_date: {
                  type: "date"
                },
                fileIdentifier: {
                  type: "text",
                  copy_to: "ugbd_full_search"
                },
                language: {
                  type: "text"
                },
                characterSet: {
                  type: "text"
                },
                hierarchyLevel: {
                  type: "text",
                  copy_to: "ugbd_full_search"

                },
                metadataStandardName: {
                  type: "text",
                  copy_to: "ugbd_full_search"
                },
                metadataStandardVersion: {
                  type: "text",
                  copy_to: "ugbd_full_search"
                },
                contact: {
                  type: "nested",

                  properties: {
                    organisationName: {
                      type: "text",
                      copy_to: ["ugbd_full_search", "ugbd_people"]
                    },
                    role: {
                      type: "text",
                      copy_to: "ugbd_full_search"
                    },
                    contactInfo: {
                      type: "nested",

                      properties: {
                        address: {
                          type: "nested",

                          properties: {
                            electronicMailAddress: {
                              type: "text",
                              copy_to: ["ugbd_full_search", "ugbd_people"]
                            }
                          }
                        },

                        onlineResource: {
                          type: "nested",

                          properties: {
                            linkage: {
                              type: "text",
                              copy_to: "ugbd_full_search"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                dateStamp: {
                  type: "date",
                  copy_to: "full_date"
                },

                identificationInfo: {
                  type: "nested",

                  properties: {
                    abstract: {
                      type: "text",
                      copy_to: "ugbd_full_search"
                    },
                    spatialRepresentationType: {
                      type: "text",
                      copy_to: "ugbd_full_search"
                    },
                    language: {
                      type: "text",
                      copy_to: "ugbd_full_search"
                    },
                    characterSet: {
                      type: "text"
                    },
                    topicCategory: {
                      type: "text",
                      copy_to: "ugbd_full_search"
                    },
                    citation: {
                      type: "nested",

                      properties: {
                        title: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        date: {
                          type: "nested",

                          properties: {
                            date: {
                              type: "date",
                              copy_to: "full_date"
                            },
                            dateType: {
                              type: "text"
                            }
                          }
                        },
                        identifier: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        }
                      }
                    },

                    pointOfContact: {
                      type: "nested",

                      properties: {
                        organisationName: {
                          type: "text",
                          copy_to: ["ugbd_full_search", "ugbd_people"]
                        },
                        role: {
                          type: "text"
                        },
                        contactInfo: {
                          type: "nested",

                          properties: {
                            address: {
                              type: "nested",

                              properties: {
                                electronicMailAddress: {
                                  type: "text",
                                  copy_to: ["ugbd_full_search", "ugbd_people"]
                                }
                              }
                            },

                            onlineResource: {
                              type: "nested",

                              properties: {
                                linkage: {
                                  type: "text",
                                  copy_to: "ugbd_full_search"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    resourceMaintenance: {
                      type: "nested",

                      properties: {
                        maintenanceAndUpdateFrequency: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        }
                      }
                    },
                    graphicOverview: {
                      type: "nested",

                      properties: {
                        fileName: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        fileType: {
                          type: "text"
                        }
                      }
                    },
                    descriptiveKeywords: {
                      type: "nested",

                      properties: {
                        keyword: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        thesaurusName: {
                          type: "nested",

                          properties: {
                            title: {
                              type: "text",
                              copy_to: "ugbd_full_search"
                            },

                            date: {
                              type: "nested",

                              properties: {
                                date: {
                                  type: "date"
                                },
                                dateType: {
                                  type: "text"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    resourceConstraints: {
                      type: "nested",

                      properties: {
                        accessConstraints: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        useConstraints: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        otherConstraints: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        }
                      }
                    },

                    spatialResolution: {
                      type: "nested",

                      properties: {
                        equivalentScale: {
                          type: "nested",

                          properties: {
                            denominator: {
                              type: "integer"
                            }
                          }
                        }
                      }
                    },

                    extent: {
                      type: "nested",

                      properties: {
                        geographicElement: {
                          type: "nested",

                          properties: {
                            westBoundLongitude: {
                              type: "float"
                            },
                            eastBoundLongitude: {
                              type: "float"
                            },
                            southBoundLatitude: {
                              type: "float"
                            },
                            northBoundLatitude: {
                              type: "float"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                distributionInfo: {
                  type: "nested",

                  properties: {
                    distributionFormat: {
                      type: "nested",
                      properties: {
                        name: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        },
                        version: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        }
                      }
                    },
                    transferOptions: {
                      type: "nested",
                      properties: {
                        onLine: {
                          type: "nested",
                          properties: {
                            linkage: {
                              type: "text",
                              copy_to: "ugbd_full_search"
                            },
                            protocol: {
                              type: "text",
                              copy_to: "ugbd_full_search"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                dataQualityInfo: {
                  type: "nested",

                  properties: {
                    scope: {
                      type: "nested",

                      properties: {
                        level: {
                          type: "text",
                          copy_to: "ugbd_full_search"
                        }
                      }
                    },
                    lineage: {
                      type: "nested",

                      properties: {
                        statement: {
                          type: "text",
                          copy_to: ["ugbd_full_search", "ugbd_lineage"]
                        }
                      }
                    },
                    report: {
                      type: "nested",
                      properties: {
                        result: {
                          type: "nested",
                          properties: {
                            value: {
                              type: "nested",
                              properties: {
                                Real: {
                                  type: "float",
                                  copy_to: "ugbd_accuracy"
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                location: {
                  type: "geo_shape"
                }
              }
            }
          }
          //   }
        }
      }).then((res) => {
        exit = new Risposta("Index Created ", true, res)
      }).catch((err) => {
        exit = new Risposta("Error Creating Index ", false, err)
      })
    console.log("-----------")
    console.log(exit)
    console.log("-----------")
    return exit;
  }
}
