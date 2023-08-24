import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SystemLogComponent } from './system-log/system-log.component';
import { SystemManagerComponent } from './system-manager.component';

const routes: Routes = [{ path: '', component: SystemManagerComponent, children: [{ path: 'system-log', component: SystemLogComponent }] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagerRoutingModule {}
