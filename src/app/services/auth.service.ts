import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = localStorage.getItem('api-url') ?? environment.api_url;

  username = '';
  pass = '';
  auth = `${this.username}:${this.pass}`;

  httpOptions: any = ({
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: `Basic ${btoa(this.auth)}`
    }),
    observe: 'response'
  });
  
  constructor(private http: HttpClient) { }

  public login(email: string, password: string, pass_endpoint: string = ''): Promise<any> {
    if(pass_endpoint)
      this.baseUrl = pass_endpoint;
    const url = `${this.baseUrl}/users/login`;
    // return this.http.post(url, { credentials }, this.httpOptions).toPromise();
    return this.http.post(url, { email, password }, this.httpOptions).toPromise();
  }

  public checkLogin(token: any): Promise<any> {
    let authHttpOptions: any = ({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }),
      observe: 'response'
    });
    const url = `${this.baseUrl}/check-login`;
    // return this.http.post(url, { credentials }, this.httpOptions).toPromise();
    return this.http.post(url, { }, authHttpOptions).toPromise();
  }
}
