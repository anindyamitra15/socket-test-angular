import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [{
  path: '',
  component: MainComponent,
  children: [{
    path: '',
    component: LoginComponent
  }, {
    path: 'connect',
    component: ConnectComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
