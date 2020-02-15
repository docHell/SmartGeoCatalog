import { Risposta } from 'src/app/models/Risposta';
import { Component, OnInit, NgZone } from '@angular/core';
import { ParserService } from 'src/service/parser.service';

@Component({
  selector: 'app-statuspage',
  templateUrl: './statuspage.component.html',
  styleUrls: ['./statuspage.component.css']
})
export class StatuspageComponent implements OnInit {

  risposte : Risposta[] =[];
  c_authors: number = 0;
  c_metadata: number = 0;



  constructor(  private parser: ParserService,private ngZone: NgZone) { 

  
    this.parser.getStatus().then((rispostas: Risposta[]) => {
      console.log(rispostas);
      this.risposte = rispostas;
     
  });
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {

    this.parser.countAll().then((risposta: Risposta) => {
      console.log(JSON.stringify(risposta));
      if (risposta.esito) {

        this.ngZone.run(() => {
          this.c_authors = risposta.valore.people;
          this.c_metadata = risposta.valore.metadata;
        });
      
       
      }  
    });
  }

}
