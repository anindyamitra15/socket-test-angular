import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  email: string = '';
  password: string = '';
  base_url: string = '';
  socket_url: string = '';

  sameSocketUrl = true;

  endpointSet: boolean = false;

  emailFormat: RegExp = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

  ngOnInit(): void {
    if (localStorage.getItem('api-url') !== null && localStorage.getItem('api-url') != '') {
      this.endpointSet = true;
      this.base_url = localStorage.getItem('api-url') ?? '';
    }
    if (localStorage.getItem('socket-url') !== null && localStorage.getItem('socket-url') != '') {
      // this.endpointSet = true;
      this.socket_url = localStorage.getItem('socket-url') ?? '';
      if (this.socket_url !== this.base_url)
        this.sameSocketUrl = false;
    }
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      this.auth.checkLogin(token).then((response: HttpResponse<any>) => {
        if (response.status === 200) {
          // localStorage.setItem("token", response.body.token);
          this.router.navigate(['connect']);
        } else {
          alert("Token expired, Please login again.");
          localStorage.removeItem("token");
        }
      }).catch((response: HttpResponse<any>) => {
        alert("Token expired, Please login again.");
        localStorage.removeItem("token");
      });
    }
  }

  login(): void {
    // console.log(this.email);
    this.auth.login(this.email, this.password, this.base_url).then((response: HttpResponse<any>) => {
      if (response.status === 200) {
        // console.log(response.body);
        localStorage.setItem("token", response.body.token);
        this.router.navigate(['connect']);
      } else {
        localStorage.removeItem("token");

        alert("Login Unsuccessful, Please try again.");
      }
    }).catch((err: HttpResponse<any>) => {
      // console.log(err);
      localStorage.removeItem("token");
      alert("Login Unsuccessful, Please try again.");
    });
  }

  reset(): void {
    this.email = '';
    this.password = '';
    localStorage.removeItem("token");
  }

  setEndpoint(): void {
    if (this.endpointSet) {
      localStorage.removeItem('socket-url');
      localStorage.removeItem('api-url');
      this.base_url = this.socket_url = '';
      this.endpointSet = false;
    } else {
      if (!this.base_url && this.sameSocketUrl) {
        alert("No Base URL entered");
        return;
      } else if (!this.sameSocketUrl && !this.socket_url) {
        alert("No Socket URL entered");
      }
      if (this.base_url.substring(this.base_url.length - 1, this.base_url.length) == '/' || this.base_url.substring(this.base_url.length - 1, this.base_url.length) == '\\')
        this.base_url = this.base_url.substring(0, this.base_url.length - 1);
      if (this.socket_url.substring(this.socket_url.length - 1, this.socket_url.length) == '/' || this.socket_url.substring(this.socket_url.length - 1, this.socket_url.length) == '\\')
        this.socket_url = this.socket_url.substring(0, this.socket_url.length - 1);
      localStorage.setItem('api-url', this.base_url);
      if (this.sameSocketUrl)
        localStorage.setItem('socket-url', this.base_url);
      else
        localStorage.setItem('socket-url', this.socket_url);
      this.endpointSet = true;

    }
  }

  epChanged(): void {
    this.endpointSet = false;
  }
}
