import { Geometry } from './Geometry';
import * as mongoose from 'mongoose';
import { UUID } from 'angular2-uuid';
 

export var  GeoGeson_schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  id_originale: String,
  vel: Number,
  data : Date,
  geometry : Object
})

export class BGeoJson {
  
    type: string =  "FeatureCollection";
    
           "features": [
                { "type": "Feature", "properties": { "DN": "#FFFFA5" }, "geometry": { "type": "Point", "coordinates": [  13.28, 52.66 ] } },
                { "type": "Feature", "properties": { "DN": "#FFFFAA" }, "geometry": {    "type": "Point", "coordinates": [  13.39, 52.64 ] } }
           ]
    }


export class Feature {
  type: string =  "Feature";
  properties : any =  { "DN": "#FFFFA5" };
  geometry : { "type": "Point", "coordinates": [  13.28, 52.66 ] }
}

export class MGeoJson {
  id : string;
  coordinates : Array<number>;
  type: String;    
  value : number;
  constructor(coordinates : Array<number>,    
    value : number,) {
    this.id = UUID.UUID();
    this.type = "Point";
    this.value  = value;
    this.coordinates = coordinates;


  }
}


// {
//   "type": "Feature",
//   "geometry": {
//     "type": "Point",
//     "coordinates": [102.0, 0.5]
//   },
//   "properties": {
//     "prop0": "value0"
//   }
// }
export class GeoToExport {
  
  type: string;
  properties: any;
  geometry : Object;

  constructor(valori : any[] ) {
    
    let geo : Geometry = new Geometry();
    
    geo.type = "Point";
    geo.coordinates = [+valori[3],+valori[2]];
    this.type = "Feature";
    this.geometry= geo;
    this.properties = {"prop" : valori[4]};

    
  }

  static of (valori : any[]) {
    return new GeoToExport(valori);
  }
}

export interface GeoJson extends mongoose.Document {

    _id: String;
    id_originale: String;
    vel: Number;
    data : Date;
    geometry : Geometry;
    
  }


  export interface Generic_EndPoint_Export  {
  
    _id: String;
    id_originale: String;
    vel: Number;
    data : Date;
    geometry : Geometry;
    
  }

  