import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetsManagerComponent } from './assets-manager.component';
import { ServerAdminManagerComponent } from './server-admin-manager/server-admin-manager.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { TagManagerComponent } from './tag-manager/tag-manager.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsManagerComponent,
    children: [
      { path: 'tag-manager', component: TagManagerComponent },
      { path: 'server-manager', component: ServerManagerComponent },
      { path: 'server-admin-manager', component: ServerAdminManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsManagerRoutingModule {}
