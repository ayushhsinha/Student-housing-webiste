import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from './properties/property.model';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  Baseurl: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  post(url: string, data: any): Observable<any> {
    return this.http.post(this.Baseurl + url, data, { withCredentials: true });
  }

  get(url: string): Observable<any> {
    return this.http.get(`${this.Baseurl}${url}`, { withCredentials: true });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(`${this.Baseurl}${url}`, { withCredentials: true });
  }

  getQuery(url: string, params?: any): Observable<any> {
    let queryParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        queryParams = queryParams.append(key, params[key]);
      });
    }
    return this.http.get(`${this.Baseurl}${url}`, { params: queryParams });
  }
  getPartnerLocations() {
    return this.http.get('/partners/location');
  }

  getPartnerNames(): Observable<any> {
    return this.http.get<any>(`${this.Baseurl}/name`);
  }

  submitContactForm(formData: any) {
    return this.http.post(`${this.Baseurl}/submitContactForm`, formData);
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.Baseurl}/properties/${id}`);
  }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.Baseurl}/properties`);
  }

  createProperty(propertyData: Property): Observable<Property> {
    return this.http.post<Property>(`${this.Baseurl}/properties`, propertyData);
  }

  deleteProperty(id: string) {
    return this.http.delete(`${this.Baseurl}/properties/${id}`);
  }
  // getRoomDetails(id: string): Observable<any> {
  //   return this.http.get( `${this.Baseurl}/rooms/${id}`);
  // }
}
