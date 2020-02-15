import {  Component,  OnInit,  ViewChild,  ElementRef,  Inject} from "@angular/core";
import { Location } from '@angular/common';
import { Observable } from "rxjs";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { tileLayer, circle, polygon, latLng } from "leaflet";
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaltor } from '../models/Translator';
import { MyMatCard } from '../utils/MyMatCard';
import { DataServiceService } from 'src/service/data-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ParserService } from '../../service/parser.service';
import { Risposta } from '../models/Risposta';
import { DialogData } from '../metadata-upload/metadata-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ViewData {
  filename: string;
}


@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer.component.html",
  styleUrls: ["./visualizer.component.css"]
})
export class VisualizerComponent implements OnInit {


  private static readonly POSITIONALACCURACY: string = "positionalAccuracy";

  filename: string;
  obj: object;
  coordinate: any;
  counter: number = 0;
  sub: any;
  sub_t: any;
  translator: Transaltor;
  myMatCard: MyMatCard;
  to_confirm: boolean;
  to_export: any;
  dialogRef: any;
  metadata_id: string;
  xml: string;

  query: any;
  constructor(private http: Http, private _snackBar: MatSnackBar,

    public dialog: MatDialog,
    private parser: ParserService,
    private route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private dataServiceService: DataServiceService) {



  }
  @ViewChild("one") d1: ElementRef;

  ngOnInit() {

    let userLang = navigator.language;

    console.log("--------------------------------------------------------")
    console.log(userLang)
    console.log('--------------------------------------------------------')
    // Prev method from file.
    this.sub_t = this.getTansaltion().subscribe(
      (traduzione: any) => {
        this.translator = new Transaltor(userLang, traduzione);
        this.myMatCard = new MyMatCard(this.translator);
        this.sub = this.route
          .queryParams
          .subscribe((params) => {
            // Defaults to 0 if no query param provided.
            // console.log("------ VisualizerComponent---------------------------------")
            // console.log(JSON.parse(params['query']));
            if (params["to_confirm"]) {


              console.log("-----------------------------------------------------");
              console.log("---TO_CONFIRM IS TRUE");
              console.log("-----------------------------------------------------");

              this.obj = this.dataServiceService.dataFromParser.elasticExport.rndt_json;

              console.log(this.xml)
              this.to_confirm = true;
              this.query = params['query'];
            } else {
              this.to_confirm = false;
              this.obj = JSON.parse(params['metadata'])
              this.query = params['query'];
            }
            this.metadata_id = params['metadata_id'];
            this.parseJson();


            // console.log("-----/ VisualizerComponent---------------------------------")

          });

      },
      error => console.log(error)
    );
  }

  backList() {
    // console.log("-CI SONO ------------------- navigateTest ")
    // this._router.navigate(['/list'], { queryParams: {query : JSON.stringify(this.query)}});
    this._location.back();
  }

  download() {

    window.open(ParserService.DOWNLOAD_METADATA + this.metadata_id, "_blank");
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub_t.unsubscribe();
  }

  ngAfterViewInit() {




  }

  public getTansaltion(): Observable<any> {
    // Reads file from assets
    return this.http
      .get("assets/Transaltion.json")
      .pipe(map((res: any) => res.json())); // <-- if u want to user

  }

  upload() {
    console.log("---------------------------------------------------------------");
    console.log("-----RISPOSTA");
    console.log("---------------------------------------------------------------");

    this.dialogRef = this.dialog.open(ViewDialog, {
      width: '250px',
      data: { filename: "questo" }
    });

    this.parser.save(this.dataServiceService.dataFromParser).then((ris: Risposta) => {
      console.log(JSON.stringify(ris));
      this.dialogRef.close();
      this._router.navigate(['/up']);

      this._snackBar.open("Ok! Metadata successfully uploaded!", "", {
        duration: 2000,
      });
    }).catch((err) => {
      this.dialogRef.close();
      this._snackBar.open("ATTENTION ERROR UPLOADING METADATA!!! ", "", {
        duration: 2000,
      });
      console.log(JSON.stringify(err));
    });
  }


  public parseJson() {
    for (let key in this.obj) {
      this.counter = 1;
      this.appendKeyValue(this.obj[key], key);
    }
    // NOW I had map
    if (this.coordinate) {
      let map = L.map('leaflet');
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);


      let southWest = L.latLng(this.coordinate.southBoundLatitude, this.coordinate.westBoundLongitude),
        northEast = L.latLng(this.coordinate.northBoundLatitude, this.coordinate.eastBoundLongitude),
        bounds = L.latLngBounds(southWest, northEast);

      // Draw a rectangle
      let rect = L.rectangle(bounds, { color: 'blue', weight: 1 }).on('click', function (e) {
        console.info(e);
      }).addTo(map);
      let lat = this.coordinate.northBoundLatitude + this.coordinate.southBoundLatitude;
      let lng = this.coordinate.eastBoundLongitude + this.coordinate.westBoundLongitude;
      // map.setView([(lat/2), (lng/2)], 8);
      map.fitBounds(bounds);


    }
  }

  public appendKeyValue(value: any, key: string) {
    if (key !== "location") {
      if (key == "dataQualityInfo") {

        this.d1.nativeElement.insertAdjacentHTML(
          "beforeend",
          this.myMatCard.getMatCart(5 * this.counter, key, this.appendValueQuality(value))

        );


      } else {
        this.d1.nativeElement.insertAdjacentHTML(
          "beforeend",

          this.myMatCard.getMatCart(5 * this.counter, key, this.appendValue(value))

        );
      }
    }
  }

  public appendValue(value: any): string {


    if (typeof value === "string" || typeof value === "number") {
      // console.log("-NOT  ok-");

      return value + "";
    } else {
      this.counter = this.counter + 1;
      // console.log("-ok-");
      let exit = "";

      for (let key in value) {

        // console.log("-> " + key)
        if (key == "geographicElement") {


          this.coordinate = value[key];


          exit = exit + this.myMatCard.getMatCardEmpty();


        } else if (key == "graphicOverview") {

          exit = exit + this.myMatCard.getMatCartIMG(5 * this.counter, key, value[key][0].fileName);


        } else {


          if (!isNaN(+key)) {
            // IS AN ARRAY OF VALUES

            if (this.validURL(value[key])) {

              exit = exit + this.myMatCard.getMatCartURL_nosub(5 * this.counter, value[key]);

            } else {

              exit = exit + this.myMatCard.getMatCart_nosub(5 * this.counter, this.appendValue(value[key]));

            }

          } else {
            if (this.validURL(value[key])) {
              // IS NOT AN ARRAY OF VALUES
              exit = exit + this.myMatCard.getMatCartURL(5 * this.counter, key, value[key]);


            } else {

              exit = exit + this.myMatCard.getMatCart(5 * this.counter, key, this.appendValue(value[key]));

            }
          }
        }
      }
      this.counter = this.counter - 1;
      // console.log("EXIT->: ", exit)
      return exit;
    }
  }

  public appendValueQuality(value: any): string {

    let exit = "";
    if (typeof value === "string" || typeof value === "number") {

      // console.log("CI ENTRO : " + value)
      return value + "";

    } else {
      // this.counter = this.counter + 1;
      // tslint:disable-next-line: forin
      for (let key in value) {
        // tslint:disable-next-line:quotemark
        console.log("-> " + key)
        this.counter = this.counter + 1;
        if ((key == "value") || (key == "result") || (key == "report")) {
          this.counter = this.counter - 1;
          exit = exit + this.appendValueQuality(value[key]);
        } else {

          if (key !== "Real") {


            exit = exit + this.myMatCard.getMatCart(5 * this.counter, key, this.appendValueQuality(value[key]));

          } else {
            this.counter = this.counter - 2;


            exit = exit + this.myMatCard.getMatCart(5 * this.counter, VisualizerComponent.POSITIONALACCURACY, value[key]);

            this.counter = this.counter - 1;
          }

        }



      }

    }

    // console.log("EXIT->: ", exit)
    return exit;

  }


  validURL(str) {
    try {
      new URL(str);

      if (str.includes("mailto")) {
        return false;
      } else {
        return true;
      }

    } catch (_) {
      return false;
    }
  }

  urlshort(str: string) {
    if (str.length > 30) {
      return str.substring(0, 29) + "[..]";
    } else {
      return str;
    }
  }

}


@Component({
  selector: 'dialogVisualizer',
  templateUrl: 'dialogVisualizer.html',
})
export class ViewDialog {

  constructor(
    public dialogRef: MatDialogRef<ViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ViewData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}