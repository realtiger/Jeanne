import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { AppComponent } from './app.component';
import { DefaultInterceptor } from './core/net/default.interceptor';
import { StartupService } from './core/services/startup.service';
import { RoutersModule } from './routers/routers.module';

// 初始化服务
export function StartupServiceFactory(startupService: StartupService): () => Observable<void> {
  return () => startupService.load();
}

// 初始化服务
const APP_INIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];

// 网络拦截器
const INTERCEPTOR_PROVIDES = [{ provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }];

@NgModule({
  declarations: [AppComponent],
  imports: [RoutersModule, RouterOutlet, HttpClientModule],
  providers: [...APP_INIT_PROVIDES, ...INTERCEPTOR_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule {}
