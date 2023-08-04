import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarModule, ButtonModule, DataTableModule, LoadingModule, PaginationModule, TagsModule, TextInputModule } from 'ng-devui';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { RoleManagerService } from './role-manager/role-manager.service';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserManagerService } from './user-manager/user-manager.service';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [ManagementComponent, UserManagerComponent, RoleManagerComponent],
  imports: [CommonModule, ManagementRoutingModule, LoadingModule, DataTableModule, PaginationModule, ButtonModule, TagsModule, AvatarModule, TextInputModule, LayoutsModule],
  providers: [UserManagerService, RoleManagerService]
})
export class ManagementModule {}
