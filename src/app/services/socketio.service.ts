import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any

  disconnected: boolean = false;

  constructor() { }

  setupSocketConnection() {
    const token = localStorage.getItem("token");
    this.socket = io(localStorage.getItem('socket-url') ?? environment.api_url, {
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      query: {
        token
      }
    });
  }

  connectEndpoint(endpoint: string) {
    this.socket.emit("subscribe", {
      endpoint,
    });
  }
}
