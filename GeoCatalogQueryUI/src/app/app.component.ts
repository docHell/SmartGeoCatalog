import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ogcVisualizer';



  goToLink( ){
    
    window.open("http://www.urbangeobigdata.it/", "_blank");
}
}
