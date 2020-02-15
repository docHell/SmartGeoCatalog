export class Transaltor {

    language : string;
    translations : any;
    readonly default : string = "en";
    
    
    constructor(langunage: string, translation : any){
        if (langunage.indexOf("-")) {
            this.language = langunage.split("-")[0];
            
        } else {
            this.language = langunage;
        }
        this.translations = translation;

 

    }

    translate(key : string) : string  {
        // console.log("--------------------------------")
        // console.log("key: " + key)
        if (this.translations[key]) {
            // console.log("1: " + JSON.stringify(this.translations[key]));
            if(this.translations[key][this.language]){
                // console.log("2");
                return this.translations[key][this.language];
            } else {
                
                if(this.translations[key][this.default]){
                    // console.log("3");
                    return this.translations[key][this.default];
                } else {
                    // console.log("4");
                    return key;
                }
            }
        } else {
            // console.log("5");
            return key;
        }
        

    }



}