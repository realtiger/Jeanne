import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppComponent } from './app.component';
import { RoutersModule } from './routers/routers.module';

@NgModule({
  declarations: [AppComponent],
  imports: [RoutersModule, RouterOutlet, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
