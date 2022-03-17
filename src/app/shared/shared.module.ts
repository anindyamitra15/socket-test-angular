import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { FooterComponent } from './footer/footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { ControllerComponent } from './controller/controller.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ControllerComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatListModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ControllerComponent
  ]
})
export class SharedModule { }
