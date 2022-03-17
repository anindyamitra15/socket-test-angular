import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

interface VarTypes {
  value: string;
  viewValue: string;
}

interface EndpointInterface {
  description: string,
  endpoint_secret: string,
  endpoint_public: string,
  device_id?: string,
  state?: boolean,
  key_id?: any,
}


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  build_number: String = "1.0.0";

  endpoints: EndpointInterface[] = []

  change_ep_type: string = '';
  connected_eps: string[] = [];
  connected_endpoints: any[] = [];

  deviceOnly: boolean = true;

  value_types: VarTypes[] = [
    { value: 'boolean', viewValue: 'Boolean' },
    { value: 'number', viewValue: 'Integer' },
    { value: 'string', viewValue: 'String' },
    { value: 'fixed_int', viewValue: 'Slider' }
  ];

  log_messages: any[] = [];

  my_ep_secret: string = '';
  user_id: any;

  socket: any;
  socket_status: boolean = false;

  ep_name: string = '';
  ep_description: string = '';
  ep_value: any = null;

  ep_message: string = '';
  showDeleteDialog: boolean = false;
  epTBD: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private rest: RestService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    const token = localStorage.getItem("token");
    this.user_id = localStorage.getItem("user_id");

    this.socket = io(localStorage.getItem('socket-url') ?? environment.socket_url, {
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      query: {
        token
      }
    });

    if (localStorage.getItem("token") === null) {
      this.router.navigate(['']);
    } else {
      this.auth.checkLogin(token).then((response: HttpResponse<any>) => {
        if (response.status === 200) {
          // console.log("ok")
          localStorage.setItem("user_id", response.body.user_id);
          this.user_id = response.body.user_id;
        } else {
          alert("Token expired, Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          this.router.navigate(['']);
        }
      }).catch((response: HttpResponse<any>) => {
        alert("Token expired, Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        this.router.navigate(['']);
      });
    }
  }


  ngOnInit(): void {

    this.socket.on('connect', () => {
      // console.log(socket.connected); // true
      this.socket_status = true;
    });
    this.socket.on('disconnect', () => {
      // console.log(socket.connected); // false
      this.socket_status = false;
    });

    this.socket.on('value', (key: any) => {
      // console.log(key.value);
      // Check if enpoint exists in object array
      const foundIndex = this.connected_endpoints.findIndex(el => el.endpoint === key.endpoint);
      if (foundIndex >= 0) {
        if (typeof (key.value) === this.connected_endpoints[foundIndex].type || (typeof (key.value) === 'number' && this.connected_endpoints[foundIndex].type === 'fixed_int'))
          this.connected_endpoints[foundIndex].value = key.value;
        else
          this.toastr.warning('Type Mismatched, hence not updated', 'Data Received', {
            positionClass: 'toast-bottom-right'
          });
      };
      let log = {
        endpoint: key.endpoint,
        value: key.value,
        message: "Data Received : ",
        dt: this.getDateTime()
      }
      this.log_messages.unshift(log);
    });

    this.socket.on('transaction', (data: any) => {

      let log = {
        device: `Chip ID - ${data.device_id} : Key - ${data.key}`,
        value: data.value,
        message: "Data Received : ",
        dt: this.getDateTime()
      }
      this.log_messages.unshift(log);
    })

    this.reloadEndpoints();
  }

  getDateTime(): string {
    var currentdate = new Date();
    var datetime = "| Last Sync: " + currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    return datetime;
  }

  is_connected(ep_secret: string): boolean {
    let endpoint = this.user_id + '-' + ep_secret;
    if (this.connected_eps.length > 0 && this.connected_eps.includes(endpoint)) {
      return true;
    }
    return false;
  }

  connect(ep_secret: string, ep_public: string): void {
    this.subscribe(ep_secret);
    let endpoint_type = 'string';
    let endpoint = this.endpoints.find((e: any) => e.endpoint_secret === ep_secret)
    if (endpoint) {
      let ep = {
        name: endpoint.description,
        type: endpoint_type,
        value: '',
        endpoint: ep_secret,
      };
      this.connected_endpoints.push(ep);
    } else {
      this.toastr.warning('Please Try Again', 'There was some error', {
        positionClass: 'toast-bottom-right'
      });
    }

    // console.log(this.connected_endpoints);
  }


  disconnect(ep_secret: string, ep_public: string): void {
    let endpoint = ep_secret;
    this.unsubscribe(endpoint);
    // console.log(this.connected_eps);
  }

  delete(endpoint_secret: string): void {
    this.epTBD = endpoint_secret;
    this.showDeleteDialog = true;
  }

  deleteEndpoint(): void {
    this.endpoints = this.endpoints.filter((obj: any) => obj.endpoint_secret !== this.epTBD);
    console.log(this.endpoints)
    localStorage.removeItem('endpoints');
    localStorage.setItem('endpoints', JSON.stringify(this.endpoints));

    this.toastr.info('Endpoint was deleted', 'Delete Success', {
      positionClass: 'toast-bottom-right'
    });
    this.reloadEndpoints();
    this.epTBD = '';
    this.showDeleteDialog = false;
  }

  closeDeleteDialog(): void {
    this.epTBD = '';
    this.showDeleteDialog = false;
  }

  add(): void {
    // console.log("click");
    this.endpoints.push({
      description: this.ep_name,
      endpoint_secret: this.ep_description,
      endpoint_public: this.ep_description.substring(this.ep_description.length - 10, this.ep_description.length),
    })
    localStorage.removeItem('endpoints');
    localStorage.setItem('endpoints', JSON.stringify(this.endpoints));

    this.ep_message = "Endpoint was Added Successfully to Local List";
    this.my_ep_secret = this.ep_description;
    this.ep_name = '';
    this.ep_description = '';
    this.ep_value = '';

    setTimeout(() => {
      this.ep_message = '';
      this.my_ep_secret = '';
    }, 10000);
  }

  reloadEndpoints(): void {
    // this.rest.listEndpoints().then((response: HttpResponse<any>) => {
    //   // console.log(response.body)
    //   this.endpoints = response.body;
    // }).catch((error: HttpResponse<any>) => {
    //   console.log(error.status)
    // });

    const endpointString = localStorage.getItem('endpoints') ?? "";
    const eps = JSON.parse(endpointString);
    if (eps)
      this.endpoints = eps;
  }

  subscribe(endpoint: string) {
    this.connected_eps.push(endpoint);
    this.socket.emit("subscribe", {
      endpoint,
    });
    this.toastr.success('', 'Endpoint Subscribed', {
      positionClass: 'toast-bottom-right'
    });
  }

  unsubscribe(endpoint: string) {
    this.toastr.warning('', 'Endpoint Unsubscribed', {
      positionClass: 'toast-bottom-right'
    });
    this.connected_endpoints = this.connected_endpoints.filter(function (ep) {
      return ep.endpoint !== endpoint;
    });
    this.connected_eps.splice(this.connected_eps.indexOf(endpoint), 1);
    this.socket.emit("unsubscribe", {
      endpoint,
    });
  }

  endpoint_change(endpoint: any) {
    // console.log(endpoint)
    let type = endpoint.type === 'fixed_int' ? 'number' : endpoint.type;
    this.toastr.info('Changed to ' + endpoint.type, 'Endpoint Updated', {
      positionClass: 'toast-bottom-right'
    });
    if (endpoint.type == 'boolean') {
      endpoint.value = false;
    } else if (endpoint.type == 'number') {
      if (typeof (endpoint.value) !== 'number')
        endpoint.value = 0;
    } else if (endpoint.type == 'fixed_int') {
      if (typeof (endpoint.value) === 'number') {
        if (endpoint.value <= 0) {
          endpoint.value = 0;
        } else if (endpoint.value >= 1) {
          endpoint.value = 1;
        }
      }
      else
        endpoint.value = 0;
    } else {
      endpoint.value = '';
    }
  }

  unlink(endpoint: string) {
    this.unsubscribe(endpoint);
  }

  emitValue(ep: any) {
    let endpoint = ep.endpoint; let value = ep.value;
    // if(ep.type === 'boolean')
    //   value = ep.value?1:0;
    // else
    //   value = ep.value;
    let updateBody: any = { endpoint, value };
    if(ep.device_id)
      updateBody.device_id = ep.device_id;
    if(ep.state)
      updateBody.state = ep.state;
    
    this.socket.emit('update', updateBody);
    this.toastr.info('Value emitted ' + ep.value, 'Endpoint Emitted', {
      positionClass: 'toast-bottom-right'
    });
  }

  // emitSlider(ep: any) {
  //   let endpoint = ep.endpoint; let value = ep.value;
  //   this.socket.emit('update', { endpoint, value });
  //   // this.toastr.info('Value emitted ' + ep.value, 'Endpoint Emitted', {
  //   //   positionClass: 'toast-bottom-right'
  //   // });
  // }
}