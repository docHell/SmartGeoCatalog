
export class EQuery {
    query: Bool;
   
    constructor() {
        this.query = new Bool();
    }
    
}
export class Bool {
    bool : Should;
    
    minimum_should_match : string
    constructor() {
        this.bool = new Should();
    }
          
}
export class Should {
    should : any [];
    filter : any;
    constructor() {
        this.should = [];
    }
}

export class Query_string {
    query_string : Query_string_elements

    constructor( query : string, fields : string []) {
        this.query_string = new Query_string_elements(query,fields);
    }
}

export class Query_string_elements {
    query : string;
    field : string [];

    constructor( query : string, fields : string []) {
        this.query = query;
        this.field = fields;
    }
}



    