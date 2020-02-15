import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { ExportParsing } from 'src/app/models/ExportParsing';
import { Risposta } from 'src/app/models/Risposta';
// import * as fs from "fs";

@Injectable({
  providedIn: 'root'
})
export class ParserService {


  public static URL: string = 'https://www.fhffcapp.it/edge/';
  // public static URL: string = 'https://www.lucafrigerio.com/edge/';
  // public static URL: string = 'http://localhost:3800/';
  private PARSER_TO = ParserService.URL + 'toParse/';
  private SAVE_METADATA_TO = ParserService.URL + 'saveMetadata/';
  private COUNT_ALL = ParserService.URL + 'countAll/';
  private GET_ALL_CONTACTS = ParserService.URL + 'getAllContacts/';
  private GET_STATUS = ParserService.URL + 'test/';
  private GET_METADATA_BY_ID = ParserService.URL + 'getByID/';
  public static DOWNLOAD_METADATA = ParserService.URL + 'DownloadMetadata/';

  

  constructor(public http: HttpClient) { }

  public async parse( ex : ExportParsing): Promise<Risposta> {
    const response = await this.http.post<Risposta>(this.PARSER_TO , ex ).toPromise();

    return response;
    
  }

  public async save( ex : any): Promise<Risposta> {
    const response = await this.http.post<Risposta>(this.SAVE_METADATA_TO , ex ).toPromise();

    return response;
    
  }

  public async getAllContacts(): Promise<Risposta> {
    const response = await this.http.get<Risposta>(this.GET_ALL_CONTACTS).toPromise();

    return response;
    
  }

  public async countAll(): Promise<Risposta> {
    const response = await this.http.get<Risposta>(this.COUNT_ALL).toPromise();

    return response;
    
  }

  public async getStatus(): Promise<Risposta[]> {
    const response = await this.http.get<Risposta[]>(this.GET_STATUS).toPromise();

    return response;
    
  }


  public async getMetadataById(metadataId: string): Promise<Risposta> {
    const response = await this.http.get<Risposta>(this.GET_METADATA_BY_ID+metadataId).toPromise();

    return response;
    
  }


}
