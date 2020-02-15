import { Injectable } from '@angular/core';
import * as  Nominatim from 'nominatim-geocoder';
import { Risposta } from 'src/app/models/Risposta';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ToNominatimService {

  private altetnativeGeocoding = "https://nominatim.openstreetmap.org/search/";
  private altetnativeGeocoding2 = "?format=json&addressdetails=1&limit=1&polygon_svg=1";
  // public geocoder = new Nominatim();

  constructor(public http: HttpClient) { }

  // public async getBoundingbox(address: string): Promise<Risposta> {
  //   let exit: Risposta;
  //   await this.geocoder.search({ q: address })
  //     .then((response) => {
  //       console.log(response)
  //       exit = new Risposta("OK", true, response);
  //     })
  //     .catch((error) => {
  //       exit = new Risposta("ERROR", false, error);
  //       console.log(error)
  //     })
  //   return exit;

  // }
  public async getBoundingbox(address: string): Promise<any> {
    const response = await this.http.get(this.altetnativeGeocoding + address + this.altetnativeGeocoding2).toPromise();

    return response;
    
  }

  

}
