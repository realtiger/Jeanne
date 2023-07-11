import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementComponent } from './management.component';
import { UserManagerComponent } from './user-manager/user-manager.component';

const routes: Routes = [{ path: '', component: ManagementComponent, children: [{ path: 'user', component: UserManagerComponent }] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
