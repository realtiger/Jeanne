import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementComponent } from './management.component';
import { PermissionManagerComponent } from './permission-manager/permission-manager.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'user', component: UserManagerComponent },
      { path: 'role', component: RoleManagerComponent },
      // { path: 'menu', component: MenuManagerComponent },
      { path: 'permission', component: PermissionManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
