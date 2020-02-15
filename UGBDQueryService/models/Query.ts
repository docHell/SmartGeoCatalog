import { Shape } from './GeoUtilClass';

export class Query {

    public static readonly ENVELOPE: string = "envelope";

    public shape: Shape;

    public key: string;
    
    public accuracy: number;

    public who : string;

    public range: number;

    public lineage: string;
    
    public static of (a : any) {
        return new Query(a.shape, a.key, a.accuracy, a.range, a.lineage, a.who);
    }


    constructor(shape: Shape, key: string, accuracy: number, range: number,lineage: string, who : string ) {
        this.shape = shape;
        this.key = key;
        this.accuracy = accuracy;
        this.range = range;
        this.lineage = lineage;
        this.who = who;
    }


    public fromLeafletBBoxToGeoJson(type: string, bbox: any) {

        // This in example
        // {"_southWest":{"lat":42.852812868190014,"lng":4.592285156250001},"_northEast":{"lat":47.153303174225975,"lng":11.843261718750002}}
        // out ?
        // "coordinates" : [[ 6.95434570312, 47.45455858479155], [2.8344726562, 45.410502277311544]]

        this.shape = new Shape(type, [[bbox._northEast.lng, bbox._southWest.lat], [bbox._southWest.lng, bbox._northEast.lat]]);


    }

    public isGeo(): boolean {
        return !(this.shape.type == null)
    }

    public isQuality(): boolean {
        return ( (this.lineage != null) ||  (this.accuracy != null) ||  (this.range != null) );
    }

    public isWho():boolean {
        return this.who == null;
    }
    
 

}