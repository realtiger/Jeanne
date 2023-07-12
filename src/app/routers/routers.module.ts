import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevUIModule } from 'ng-devui';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutersRoutingModule } from './routers-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RoutersRoutingModule, DevUIModule]
})
export class RoutersModule {
  constructor(@Optional() @SkipSelf() parentModule: RoutersModule) {
    const moduleName = 'RoutersModule';
    if (parentModule) {
      throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
