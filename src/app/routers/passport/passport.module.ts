import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { PassportRoutingModule } from './passport-routing.module';
import { PassportComponent } from './passport.component';

@NgModule({
  declarations: [PassportComponent, LoginComponent],
  imports: [CommonModule, PassportRoutingModule]
})
export class PassportModule {}
