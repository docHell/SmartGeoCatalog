import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ExportParsing } from '../models/ExportParsing';
import { ParserService } from '../../service/parser.service';
import { DataServiceService } from '../../service/data-service.service';
import { Risposta } from '../models/Risposta';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  filename: string;
}

@Component({
  selector: 'app-metadata-upload',
  templateUrl: './metadata-upload.component.html',
  styleUrls: ['./metadata-upload.component.css']
})


export class MetadataUploadComponent implements OnInit {
  file_list: File;
  filename: string;
  dir: string;
  export: ExportParsing;
  dialogRef : any;
  


  constructor(private _location: Location,
    public dialog: MatDialog,
    
    private parser: ParserService,
    private _router: Router,
    private dataServiceService: DataServiceService) { }

  ngOnInit() {
    this.file_list = null;
  }

  backHome() {
    console.log("-CI SONO ------------------- navigateTest ")
    this._location.back();
  }


  navigateTest() {

  }
  remove() {
    this.file_list = null;

    // this.file_list.splice(this.file_list.findIndex(x => x.name == name), 1);
  }

  fileInput($event) {

    this.file_list = $event.target.files[0];
    this.readThisMetadata($event.target)

  }

  upload() {

    this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {filename : "questo"}
    });


    this.parser.parse(this.export).then((ris: Risposta) => {
      // tslint:disable: quotemark
      console.log("---------------------------------------------");
      console.log("--RISPOSTA ARRIVATA--------------------------");
      console.log("->" + JSON.stringify(ris));


      console.log("-CI SONO ------------------- gotoView ")

      this.dataServiceService.dataFromParser = ris.valore;
      this.dialogRef.close();
      this._router.navigate(['/view'], { queryParams: { to_confirm: true } });


      console.log("---------------------------------------------");
    }).catch((err) => {
      console.log("---------------------------------------------");
      console.log("--RISPOSTA ERRORE----------------------------");
      console.log("->" + JSON.stringify(err));
      this.dialogRef.close();
      console.log("---------------------------------------------");
    })
  }

  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  readThisMetadata(inputValue: any): void {
    var file: File = inputValue.files[0];

    this.getBase64(file).then(result => {
      console.log(result.toString());
      this.export = new ExportParsing(result.toString());

      console.log('FILE  ->', JSON.stringify(this.export));
    });
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}