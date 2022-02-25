import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class IsgRevenueService {
  webBaseUrl = 'https://api.isg-dev.one/api';
  token = '/security/token';
  partners = '/revenues/partners';
  catalogByProvider = '/revenues/revenue_catalogs';
  catalog = '/revenues/catalog/';
  classTypes = '/revenues/class_types';
  features = '/revenues/features';
  feature = '/revenues/class_types/@@id@@/features';
  behaviors = '/revenues/behaviors';
  token_header_key = 'Authorization';


  // https://api.isg-dev.one/api/revenues/revenue_catalogs?page=1&itemsPerPage=30&pagination=true&partner.id=1&name=cesar
  // PATCH Expires  revenues catalog record  { id } / expire
  expires = '/revenues/catalog/';

  // PATCH Updates revenue value { id } / revenue
  revenue = '/revenues/catalog/ ';

  constructor(private http: HttpClient) {}

  updateRevenue(body:object,id:any){
    return this.http.patch(this.webBaseUrl + this.revenue + `${id}/revenue`,body, httpOptions);
  }

  updateExpiration(body:object,id:any){
    return this.http.patch(this.webBaseUrl + this.expires + `${id}/expire`,body, httpOptions);
  }

  getPartners() {
    return this.http.get(this.webBaseUrl + this.partners, httpOptions);
  }

  getCatalog() {
    return this.http.get(this.webBaseUrl + this.catalogByProvider, httpOptions);
  }

  getCatalogByProvider(id: number) {
    return this.http.get(
      this.webBaseUrl + this.catalogByProvider + '/' + id,
      httpOptions
    );
  }

  getCatalogByPage(
    itemsPerPage: number,
    page: number,
    currentPartnerId: number
  ) {
    let url = '';
    if (currentPartnerId != -1) {
      url = `/revenues/revenue_catalogs?itemsPerPage=${itemsPerPage}&pagination=true&partner.id=${currentPartnerId}&page=${page}`;
    } else {
      url = `/revenues/revenue_catalogs?itemsPerPage=${itemsPerPage}&pagination=true&page=${page}`;
    }
    return this.http.get(this.webBaseUrl + url);
  }


  searchbyNameFilter(
    itemsPerPage: number,
    page: number,
    currentPartnerId: number,
    searchKeword: string
  ) {
    let url = '';
    if (currentPartnerId != -1) {
      url = `/revenues/revenue_catalogs?itemsPerPage=${itemsPerPage}&pagination=true&partner.id=${currentPartnerId}&page=${page}&name=${searchKeword}`;
    } else {
      url = `/revenues/revenue_catalogs?itemsPerPage=${itemsPerPage}&pagination=true&page=${page}&name=${searchKeword}`;
    }
    return this.http.get(this.webBaseUrl + url);
  }

 
  
}
