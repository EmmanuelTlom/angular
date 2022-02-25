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
export class NewProductService {
  webBaseUrl = 'https://api.isg-dev.one/api';
  token = '/security/token';
  partners = '/revenues/partners';
  catalogByProvider = '/revenues/revenue_catalogs';
  catalog = '/revenues/catalog/';
  classTypes = '/revenues/class_types';
  features = '/revenues/features/';
  feature = '/revenues/class_types/';
  behaviors = '/revenues/behaviors';
  token_header_key = 'Authorization';

  // POST
  revenue_catalogs ='/revenues/revenue_catalogs'


  // PRIMARY CLASSES API CALLS
  videoClassType = '/revenues/video_class_types/';
  voiceClassType = '/revenues/voice_class_types/';
  internetClassType = '/revenues/internet_class_types/';
  techClassType = '/revenues/tech_class_types/';
  securityClassType = '/revenues/security_class_types/';
  wirelessClassType = '/revenues/wireless_class_types/';

  // POST Creates a Product resource.
  saveProduct = '/api/revenues/product';

  constructor(private http: HttpClient) { }

  saveNewProduct(body: object) {
    return this.http.post(this.webBaseUrl + this.saveProduct, body, httpOptions);
  }

  getClassType() {
    return this.http.get(this.webBaseUrl + this.classTypes, httpOptions);
  }
  getBehavior() {
    return this.http.get(this.webBaseUrl + this.behaviors, httpOptions);
  }
  // NOT PRIMARY GOES TO FEATURES CALL
  getFeatures(classId: number) {
    return this.http.get(this.webBaseUrl + this.features, httpOptions);
  }

  getFeaturesByReferenceId(classId: number) {
    return this.http.get(
      this.webBaseUrl + this.features + classId,
      httpOptions
    );
  }
  // FEATURE FOR PRIMARY CLASSES
  getVideoClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.videoClassType, httpOptions);
  }

  getVoiceClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.voiceClassType, httpOptions);
  }

  getInternetClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.internetClassType, httpOptions);
  }

  getTechClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.techClassType, httpOptions);
  }

  getSecurityClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.securityClassType, httpOptions);
  }

  getWirelessClassType(classId?: number) {
    return this.http.get(this.webBaseUrl + this.wirelessClassType, httpOptions);
  }

  // FEATURE FOR PRIMARY BY REFERENCE ID
  getVideoClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.videoClassType + classId,
      httpOptions
    );
  }

  getVoiceClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.voiceClassType + classId,
      httpOptions
    );
  }

  getInternetClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.internetClassType + classId,
      httpOptions
    );
  }

  getTechClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.techClassType + classId,
      httpOptions
    );
  }

  getSecurityClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.securityClassType + classId,
      httpOptions
    );
  }

  getWirelessClassTypeByReferenceId(classId?: number) {
    return this.http.get(
      this.webBaseUrl + this.wirelessClassType + classId,
      httpOptions
    );
  }

  createProduct(body: object) {
    return this.http.post(this.webBaseUrl + this.revenue_catalogs , body, httpOptions);
  }
}
