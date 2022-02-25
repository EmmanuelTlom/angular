import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  webBaseUrl= 'https://api.isg-dev.one/api'
  token =  '/security/token'
  partners =  '/revenues/partners'
  catalogByProvider =  '/revenues/revenue_catalog_by_providers'
  catalog =  '/revenues/catalog/'
  classTypes =  '/revenues/class_types'
  features =  '/revenues/features'
  feature =  '/revenues/class_types/@@id@@/features'
  behaviors =  '/revenues/behaviors'
  token_header_key =  'Authorization'
  constructor(private http: HttpClient) { }

  doLogin(user: any){
    return this.http.post( this.webBaseUrl + this.token, user )
  }
}
