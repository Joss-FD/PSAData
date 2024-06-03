import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, of, pipe } from 'rxjs';
import { environment } from 'src/environment/environment';
import { PSADetailsResponse, PSAImages } from './types/psa.type';

@Injectable({
  providedIn: 'root'
})
export class PsaRequestService {

  constructor(private http: HttpClient) {
    this.headers = this.headers.set('authorization', this.apiKey);
    this.headers = this.headers.set('Content-Type', 'application/json');
   }

  baseUrl: string = environment.apiBaseUrl || "";
  apiKey: string = environment.apiKey || "";

  headers = new HttpHeaders();

  getInfoAndImages(number: string) {
    return forkJoin({
      details: this.getInfoByCertNumber(number), 
      images: this.getImagesByCertNumber(number).pipe(catchError(e=> of([])))
    })
  }

  getInfoByCertNumber(number: string): Observable<PSADetailsResponse> {
    return this.http.get<PSADetailsResponse>(this.baseUrl + `/cert/GetByCertNumber/${number}`, { headers: this.headers});
  }
  
  getImagesByCertNumber(number: string): Observable<PSAImages[]> {
    return this.http.get<PSAImages[]>(this.baseUrl + `/cert/getImagesByCertNumber/${number}`, { headers: this.headers});
  }
}
