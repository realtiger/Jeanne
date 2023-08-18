import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AbnormalRoutingModule } from './abnormal-routing.module';
import { AbnormalComponent } from './abnormal.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

@NgModule({
  declarations: [AbnormalComponent, NotFoundComponent, ServerErrorComponent],
  imports: [CommonModule, AbnormalRoutingModule]
})
export class AbnormalModule {}
