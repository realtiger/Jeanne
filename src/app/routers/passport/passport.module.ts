import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, TabsModule, TextInputModule, ToastModule, ToggleModule } from 'ng-devui';

import { LoginComponent } from './login/login.component';
import { PassportRoutingModule } from './passport-routing.module';
import { PassportComponent } from './passport.component';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [PassportComponent, LoginComponent],
  imports: [CommonModule, PassportRoutingModule, ToastModule, TabsModule, NgOptimizedImage, FormModule, TextInputModule, ToggleModule, ReactiveFormsModule, LayoutsModule]
})
export class PassportModule {}
