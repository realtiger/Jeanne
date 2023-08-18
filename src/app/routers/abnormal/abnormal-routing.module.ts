import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AbnormalComponent } from './abnormal.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

const routes: Routes = [
  {
    path: '',
    component: AbnormalComponent,
    children: [
      { path: 'abnormal404', component: NotFoundComponent },
      // { path: 'abnormal403', component: ForbiddenComponent },
      { path: 'abnormal500', component: ServerErrorComponent }
    ]
  },
  { path: '**', redirectTo: 'abnormal404' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbnormalRoutingModule {}
