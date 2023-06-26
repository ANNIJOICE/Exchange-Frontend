import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment';
import { getItemFromLocalStorage } from '@exchange/util';

const headers = new HttpHeaders({
  Accept: 'application/json',
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = <string>environment.apiBase;

  private defaultOptions = {
    headers,
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    if (getItemFromLocalStorage('accessToken') != null) {
      headers.set(
        'Authorization',
        `Bearer ${getItemFromLocalStorage('accessToken')}`
      );
    }
  }

  // Base http APIs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApi(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`, this.defaultOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postApi(url: string, data?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, data, this.defaultOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  putApi(url: string, data?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${url}`, data, this.defaultOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteApi(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}`, this.defaultOptions);
  }
}
