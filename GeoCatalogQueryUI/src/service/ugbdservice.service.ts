import { Injectable, Query } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Risposta } from 'src/app/models/Risposta';


@Injectable({
  providedIn: 'root'
})


export class UGBDServiceService {
   public static URL: string = 'https://www.fhffcapp.it/edge/';
  
  // public static URL: string = 'http://localhost:3700/';
  // public static URL: string = 'https://www.fhffcapp.it/query/';
  // public static URL: string = 'https://www.lucafrigerio.com/query/';
  private GET_ALL = UGBDServiceService.URL + 'getAll/';
  private GET_ALL_E = UGBDServiceService.URL + 'getAll_E/';
  
  private GET_QUERY_RESPONSE = UGBDServiceService.URL + 'getQuery_Response/';

  constructor(public http: HttpClient) { 

  }


  async getAll(): Promise<Risposta> {
    const response = await this.http.get<Risposta>(this.GET_ALL).toPromise();
    return response;
  }

  async getAllE(): Promise<Risposta> {
    const response = await this.http.get<Risposta>(this.GET_ALL_E).toPromise();
    return response;
  }

  async getQueryResponse(tosearch : Query): Promise<Risposta> {

    // let headers = new HttpHeaders();

    // let params = new HttpParams();
    
    // params = params.set('query', JSON.stringify(tosearch));
       
    console.log(this.GET_QUERY_RESPONSE);
    console.log(this.GET_ALL);
    const response = await this.http.post<Risposta>(this.GET_QUERY_RESPONSE, tosearch ).toPromise();
    return response;
  }




}
