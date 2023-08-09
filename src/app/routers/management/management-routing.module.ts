import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementComponent } from './management.component';
import { MenuManagerComponent } from './menu-manager/menu-manager.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'user', component: UserManagerComponent },
      { path: 'role', component: RoleManagerComponent },
      { path: 'menu', component: MenuManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
