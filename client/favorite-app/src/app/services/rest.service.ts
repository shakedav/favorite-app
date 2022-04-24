import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  get<T>(url: string, params?: any, options?: any): Observable<T> {
    return this.http.get<T>(url, { headers: this.headers });
  }

  post(url: string, body: any, options?: any) {
    return this.http.post(url, body, { headers: this.headers });
  }
}
