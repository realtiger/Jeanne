import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { UserManagerComponent } from './user-manager/user-manager.component';

@NgModule({
  declarations: [ManagementComponent, UserManagerComponent],
  imports: [CommonModule, ManagementRoutingModule]
})
export class ManagementModule {}
