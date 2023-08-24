import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SystemLogComponent } from './system-log/system-log.component';
import { SystemLogService } from './system-log/system-log.service';
import { SystemManagerRoutingModule } from './system-manager-routing.module';
import { SystemManagerComponent } from './system-manager.component';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [SystemManagerComponent, SystemLogComponent],
  imports: [CommonModule, SystemManagerRoutingModule, LayoutsModule],
  providers: [SystemLogService]
})
export class SystemManagerModule {}
