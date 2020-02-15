import { Shape } from './GeoUtilClass';

export class Query {

    public static readonly ENVELOPE: string = "envelope";
    public static readonly POLYGON: string = "polygon";

    public shape: Shape;

    public key: string;

    public accuracy: number;
    public range: number;
    public lineage: string;

    public who: string;

    public quality: string;
    public untit: string;



    constructor() {

    }

    public isDetailedQuality(): boolean {
        let exit: boolean = false;
        if (this.lineage) {

            exit = true;
        }
        if (this.accuracy) {
            exit = true;
        }
        return exit;
    }


    public validateQuality(): string[] {
        const esito: string[] = [];

        if (this.accuracy) {
            if (!this.isNumber(this.accuracy)) {
                esito.push("Accuracy is not a number \n");
            }
        }
        if (this.range) {
            if (!this.isNumber(this.range)) {
                esito.push("Range  is not a number \n");
            }
        }
        return esito;
    }

    public cleanQuality() {
        this.lineage = null;
        this.accuracy = null;
    }


    public isNumber(value: string | number): boolean {

        return ((value != null) && !isNaN(Number(value.toString())));

    }


    public fromLeafletBBoxToGeoJson(type: string, bbox: any) {


        this.shape = new Shape(type,
            [[
                [bbox._southWest.lng, bbox._southWest.lat],
                [bbox._northEast.lng, bbox._southWest.lat],
                [bbox._northEast.lng, bbox._northEast.lat],
                [bbox._southWest.lng, bbox._northEast.lat],
                [bbox._southWest.lng, bbox._southWest.lat]
            ]]);


    }

    public fromNominatimGeoJson(type: string, bbox: any) {

        // "boundingbox": ["52.5237693", "52.5401484", "13.3658603", "13.4012965"],

        this.shape = new Shape(type,
            [[
                [+bbox[2], +bbox[0]],
                [+bbox[3], +bbox[0]],
                [+bbox[3], +bbox[1]],
                [+bbox[2], +bbox[1]],
                [+bbox[2], +bbox[0]]
            ]]);
        // console.log("*-------------------------------------------------------------------------------------------------------");
        // console.log(JSON.stringify(bbox));
        // console.log("**************************************************");
        // console.log(JSON.stringify(this.shape));
        // console.log("**************************************************");
        
        // console.log("!-------------------------------------------------------------------------------------------------------");

    }


}