export class ExportParsing {
    parsing_date: Date;
    base64_rndt: string;
    
    constructor(e64 : string) {
        this.parsing_date = new Date();
        this.base64_rndt = e64.replace("data:text/xml;base64,","");

    }
  }