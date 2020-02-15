import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, circle, polygon, latLng } from 'leaflet';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { Query } from '../models/Query';
import { DataServiceService } from 'src/service/data-service.service';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../models/Contact';
import { ParserService } from 'src/service/parser.service';
import { Risposta } from '../models/Risposta';
import { FormControl } from '@angular/forms';
import { ToNominatimService } from '../../service/to-nominatim.service';


@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  // tslint:disable: variable-name



  query: Query = new Query();
  contacts: Contact[];
  city_name: string;
  //
  map_view = true;
  map_data_present = false;
  quality_data_present = false;

  who_view = true;
  quality_view = true;

  map: any;

  mini_map: any;
  myControl: any;
  rect: any;
  rect_nominatim: any;

  // DATA FOR QUERY
  map_data: any;

  editableLayers: any;
  mini_editableLayers: any;
  bbox_temp: any;

  constructor(private ngZone: NgZone, private _router: Router, private parser: ParserService, private nominatim: ToNominatimService, private _snackBar: MatSnackBar) {


    this.myControl = new FormControl();
  }
  ngOnInit() {
    this.parser.getAllContacts().then((risposta: Risposta) => {
      if (risposta.esito) {
        this.contacts = risposta.valore;
      } else {
        // adesso vediamo che fare.
      }
    });
    



  }

  ngAfterViewInit() {

    // this.parser.countAll().then((risposta: Risposta) => {
    //   console.log(JSON.stringify(risposta));
    //   if (risposta.esito) {

    //     this.ngZone.run(() => {
    //       this.c_authors = risposta.valore.people;
    //       this.c_metadata = risposta.valore.metadata;
    //     });
      
       
    //   }  
    // });
    // Create the map

    this.mini_map = L.map('leaflet_mini');

    this.map = L.map('leaflet');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mini_map);

    this.map.setView([45.424581, 9.232333], 6);
    this.mini_map.setView([45.424581, 9.232333], 6);

    this.editableLayers = new L.FeatureGroup();
    this.map.addLayer(this.editableLayers);
    // this.mini_map.addLayer(this.mini_editableLayers);

    const drawOptions = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        circle: false,
        polygon: false
      },
      edit: {
        featureGroup: this.editableLayers, // REQUIRED!!
        remove: false
      }
    });
    this.map.addControl(drawOptions);

    this.map.on('draw:created', (e: any) => {

      const type = e.layerType,
        layer = e.layer;


      this.query.fromLeafletBBoxToGeoJson(Query.POLYGON, layer._bounds);
      console.log('-----QUERY GEO-------------------------------------');
      console.log(JSON.stringify(layer._bounds));
      console.log('---------------------');
      console.log(JSON.stringify(this.query));
      console.log('----/QUERY GEO-------------------------------------');
      this.map_data = layer;
      this.editableLayers.clearLayers();

      // Draw a rectangle
      if (this.rect) {
        this.mini_map.removeLayer(this.rect);
      }
      console.log('-ori-> ' + JSON.stringify(layer._bounds));
      this.rect = L.rectangle(layer._bounds, { color: 'red', weight: 1 }).on('click', (e) => {
        console.info(e);
      }).addTo(this.mini_map);

      this.map.fitBounds(layer._bounds);



      // this.mini_editableLayers.clearLayers();
      this.editableLayers.addLayer(layer);
      // this.mini_editableLayers.addLayer(layer);
    });
  }

  save_bound() {
    this.ngZone.run(() => {
      this.map_data_present = true;
      this.map_view = true;
      this.quality_view = true;
      this.who_view = true;
      setTimeout(() => {


        this.mini_map.invalidateSize();
        this.mini_map.fitBounds(this.bbox_temp);
      }, 200);
    });

    
  }

  save_quality() {
    this.ngZone.run(() => {
      // this.map_data_present = false;
      const errors: string[] = this.query.validateQuality();
      if (errors.length > 0) {
        let message = '';
        errors.forEach((e: string) => {
          message = message + e;
        });
        this._snackBar.open(message, 'ok', {
          duration: 5000,
        });
      } else {
        this.map_view = true;
        this.quality_view = true;
        this.who_view = true;
        this.quality_data_present = this.query.isDetailedQuality();
      }

    });
  }

  remove_bound() {
    this.ngZone.run(() => {

      this.map_data_present = false;
      this.map_view = true;
      this.quality_view = true;
      this.who_view = true;
      this.editableLayers.clearLayers();
      this.map.removeLayer(this.rect_nominatim);
      this.mini_map.removeLayer(this.rect);


    });
    this.map_data = null;

    // this.mini_editableLayers.clearLayers();
  }

  remove_quality() {
    this.ngZone.run(() => {

      this.quality_data_present = false;
      this.map_view = true;
      this.quality_view = true;
      this.who_view = true;
      this.query.cleanQuality();

    });


    // this.mini_editableLayers.clearLayers();
  }

  // view stuff

  adv_map() {
    this.ngZone.run(() => {
      this.map_view = !this.map_view;
      this.quality_view = true;
      this.who_view = true;
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    });

    // console.log("this.map_view -> " + this.map_view)
  }

  adv_who() {
    this.ngZone.run(() => {
      this.who_view = !this.who_view;
      this.quality_view = true;
      this.map_view = true;
    });

    // console.log("this.map_view -> " + this.map_view)
  }

  adv_quality() {
    this.ngZone.run(() => {
      this.quality_view = !this.quality_view;
      this.who_view = true;
      this.map_view = true;

    });

    // console.log("this.map_view -> " + this.map_view)
  }


  navigateTest() {
    console.log('-CI SONO ------------------- navigateTest ');
    this._router.navigate(['/list'], { queryParams: { query: JSON.stringify(this.query) } });
  }

  searchBBOX() {

    this.map_view = !this.map_view;
    this.quality_view = true;
    this.who_view = true;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
    this.nominatim.getBoundingbox(this.city_name).then((risposta: any) => {
      console.log('--------RISPOSTA risposta[0].boundingbox -------------------------');
      // "boundingbox": ["52.5237693", "52.5401484", "13.3658603", "13.4012965"],

      console.log(JSON.stringify(risposta[0].boundingbox));
      console.log('---------------------------------');
      this.query.fromNominatimGeoJson(Query.POLYGON, risposta[0].boundingbox);

      // tslint:disable-next-line:no-unused-expression
      const bbox = L.latLngBounds([
        [+risposta[0].boundingbox[0], +risposta[0].boundingbox[2]],
        [+risposta[0].boundingbox[1], +risposta[0].boundingbox[3]]
      ]
      );
      console.log('->' + JSON.stringify(bbox));

      if (this.rect) {
        this.mini_map.removeLayer(this.rect);
        this.map.removeLayer(this.rect);
      }

      // setTimeout(() => {
      this.map.invalidateSize();
      this.mini_map.invalidateSize();

      this.rect_nominatim = L.rectangle(bbox, { color: 'red', weight: 1 }).on('click', (e) => {
        console.log(e);
      }).addTo(this.map);
      this.map.fitBounds(bbox);
      this.bbox_temp = bbox;
      this.rect = L.rectangle(bbox, { color: 'red', weight: 1 }).on('click', (e) => {
        console.log(e);
      }).addTo(this.mini_map);

     



      // }, 1000);

    }).catch((err) => {
      console.log(JSON.stringify(err));
    });

  }


}
