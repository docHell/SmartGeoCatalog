import { Component, OnInit, Query, NgZone } from '@angular/core';
import { UGBDServiceService } from '../../service/ugbdservice.service';
import { Risposta } from '../models/Risposta';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-meta-data-list',
  templateUrl: './meta-data-list.component.html',
  styleUrls: ['./meta-data-list.component.css']
})


export class MetaDataListComponent implements OnInit {

  risposta: Risposta;
  sub: any;
  query: any;
  size: number = 0;
  hideResult: boolean = false;

  constructor(private ugbd: UGBDServiceService, private route: ActivatedRoute, private ngZone: NgZone, private _router: Router, private _location: Location) { }


  getSize() {
    try {
      this.size = this.risposta.valore.length;
    } catch (err) {

    }
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        // Defaults to 0 if no query param provided.
        console.log("------MetaDataListComponent---------------------------------")
        console.log(JSON.parse(params['query']));
        this.query = params['query'];
        this.doQuery(JSON.parse(params['query']));
        console.log("-----/MetaDataListComponent---------------------------------")

      });
  }

  doQuery(query: Query) {
    console.log("-----doQuery---------------------------------")
    this.ugbd.getQueryResponse(query).then((ris: Risposta) => {

      console.log("*----*")
      console.log(JSON.stringify(ris))
      console.log("*----*")
      this.ngZone.run(() => {
        this.risposta = JSON.parse(JSON.stringify(ris));
        this.getSize();
        this.hideResult = true;
      })

      console.log(JSON.stringify(this.risposta));
      console.log("**********************************************************")
      this.risposta.valore.forEach((element) => {
        console.log(element._source.identificationInfo.citation.title)
      });
      console.log("**********************************************************")
    });
    console.log("-----/doQuery---------------------------------")
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoView(metadata: any) {
    console.log("-CI SONO ------------------- gotoView ")

    console.log("*********************************************")
    console.log( metadata._id );
    console.log("*********************************************")
    this._router.navigate(['/view'], { queryParams: { metadata: JSON.stringify(metadata._source), query: JSON.stringify(this.query),metadata_id : metadata._id } });

  }

  checkIfThereIsImage(metadato: any) {
    let exit: boolean = false;
    // console.log("-------------------------------------------------------------------------------------------------")
    // console.log(metadato.title);
    if (metadato._source.identificationInfo) {
      // console.log("-1")
      if (metadato._source.identificationInfo.graphicOverview) {
        // console.log("-2")
        if (metadato._source.identificationInfo.graphicOverview.length > 0) {
          // console.log("-3")
          if (metadato._source.identificationInfo.graphicOverview[0].fileName) {
            // console.log("-4")
            exit = true;
          }
        }
      }
    }
    return exit;

  }


  backHome() {
    console.log("-CI SONO ------------------- navigateTest ")
    this._location.back();
  }

}
