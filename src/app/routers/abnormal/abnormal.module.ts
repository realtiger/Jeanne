import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AbnormalRoutingModule } from './abnormal-routing.module';
import { AbnormalComponent } from './abnormal.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [AbnormalComponent, NotFoundComponent],
  imports: [CommonModule, AbnormalRoutingModule]
})
export class AbnormalModule {}
