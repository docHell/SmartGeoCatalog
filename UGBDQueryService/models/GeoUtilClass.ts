 
export class Shape {

    public static readonly ENVELOPE : string = "envelope";

    public type: string;

    public coordinates: any;
     
    constructor(_type : string , _coordinates : any) {
        this.coordinates = _coordinates;
        this.type = _type;
    }

  }