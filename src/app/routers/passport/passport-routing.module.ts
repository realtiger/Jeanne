import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PassportComponent } from './passport.component';

const routes: Routes = [{ path: '', component: PassportComponent, children: [{ path: 'login', component: LoginComponent }] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassportRoutingModule {}
