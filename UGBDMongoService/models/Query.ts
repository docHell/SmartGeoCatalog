import { Shape } from './GeoUtilClass';

export class Query {

    public static readonly ENVELOPE: string = "envelope";

    public shape: Shape;

    public key: string;

    constructor() {

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

    
 

}