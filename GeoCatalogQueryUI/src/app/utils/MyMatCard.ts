import { Transaltor } from '../models/Translator';
export class MyMatCard {

    private translator : Transaltor
    
    private template1 : string = "<mat-card class='mat-card mat-elevation-z4' style=' margin-left : ";
                                
    private template2 : string = "px; margin-top : 5px'><mat-card-subtitle class='mat-card-subtitle'>" 
    
    private template3 : string = "</mat-card-subtitle><mat-card-content class='mat-card-content distanza' >";
                                
    private template4 : string = "</mat-card-content></mat-card>";

    private template2_3_nosub : string = "px; margin-top : 5px'><mat-card-content class='mat-card-content distanza' >";


     constructor(translator : Transaltor) {
         this.translator = translator;
     }

     public getMatCart_nosub(_margin : number, _value : string): string {

        let margin : number = _margin;
        
        let value : string = _value;

        return this.template1 + margin + this.template2_3_nosub + value + this.template4;

     }

     public getMatCartURL_nosub(_margin : number , _value: string ): string {

        let margin : number = _margin;
       
        let value : string = "<a href='" + _value + "'>" + this.urlshort(_value) + "</a>"

        return this.template1 + margin + this.template2_3_nosub + value + this.template4;

     }


     public getMatCart(_margin : number, _key : string, _value : string): string {

        let margin : number = _margin;
        let key : string  =  this.translator.translate(_key);
        let value : string = _value;

        return this.template1 + margin + this.template2 + key + this.template3 + value + this.template4;

     }
     public getMatCartURL(_margin : number, _key : string, _value: string ): string {

        let margin : number = _margin;
        let key : string  =  this.translator.translate(_key);
        let value : string = "<a href='" + _value + "'>" + this.urlshort(_value) + "</a>"

        return this.template1 + margin + this.template2 + key + this.template3 + value + this.template4;

     }

     public getMatCartIMG(_margin : number, _key : string, _value: string ): string {

        let margin : number = _margin;
        let key : string  =  this.translator.translate(_key);
        let value : string = "<img style='width : 300px' src='" + _value +"' /></mat-card>"

        return this.template1 + margin + this.template2 + key + this.template3 + value + this.template4;

     }

     public getMatCardEmpty () {
         return "<mat-card class='mat-card distanza mat-elevation-z4'> "
         + "<div style='width: 100%; height: 300px;' leaflet id='leaflet' > "
         + "  </div>"
         + "</mat-card>"
     }

     urlshort(str: string) {
        if (str.length > 30) {
          return str.substring(0, 29) + "[..]";
        } else {
          return str;
        }
      }

}