import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ConnectComponent } from 'src/app/pages/connect/connect.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const token = localStorage.getItem("token");

const socket_config: SocketIoConfig = {
  url: "http://localhost:3000", options: {
    reconnectionDelay: 5000,
    reconnectionDelayMax: 10000,
    query: "token=" + token
  }
};

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    ConnectComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    RouterModule,
    MatInputModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTooltipModule,
    MatDialogModule
    // SocketIoModule.forRoot(socket_config)
  ]
})
export class MainModule { }
