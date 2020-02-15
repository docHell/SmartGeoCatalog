import { Shape } from '../models/GeoUtilClass';

export class GeoStuff {

    public static fromLeafletBBoxToGeoJson(bbox : any ) : Shape{
        
        // This in example
        // {"_southWest":{"lat":42.852812868190014,"lng":4.592285156250001},"_northEast":{"lat":47.153303174225975,"lng":11.843261718750002}}
        // out ?
        // "coordinates" : [[ 6.95434570312, 47.45455858479155], [2.8344726562, 45.410502277311544]]

        let exit : Shape = new Shape("envelope",[[bbox._northEast.lng,bbox._southWest.lat][bbox._southWest.lng,bbox._northEast.lat]]);
        
        return exit;

    }
    
    _ 
  }