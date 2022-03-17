import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  baseUrl = localStorage.getItem('api-url') ?? environment.api_url;

  token = localStorage.getItem("token");

  httpOptions: any = ({
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    }),
    observe: 'response'
  });

  constructor(private http: HttpClient) { }

  // Add Necesssary API Services Here
}
