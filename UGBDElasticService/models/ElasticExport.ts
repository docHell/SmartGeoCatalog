export class ElasticExport {
    _id: string;   
    rndt_json: object;
     
    constructor(id: string) {
        this._id =id;
    }

    public static of (e : any) {
        let exit : ElasticExport = new ElasticExport(e._id);
        exit.rndt_json = e.rndt_json;
        return exit;
    }


  }
  