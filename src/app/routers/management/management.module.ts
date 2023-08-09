import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule, ButtonModule, CheckBoxModule, DataTableModule, FormModule, LayoutModule, LoadingModule, PaginationModule, TagsModule, TextInputModule } from 'ng-devui';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { MenuManagerComponent } from './menu-manager/menu-manager.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { RoleManagerService } from './role-manager/role-manager.service';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { UserManagerService } from './user-manager/user-manager.service';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [ManagementComponent, UserManagerComponent, RoleManagerComponent, MenuManagerComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    LoadingModule,
    DataTableModule,
    PaginationModule,
    ButtonModule,
    TagsModule,
    AvatarModule,
    TextInputModule,
    LayoutsModule,
    CheckBoxModule,
    FormsModule,
    LayoutModule,
    FormModule
  ],
  providers: [UserManagerService, RoleManagerService]
})
export class ManagementModule {}
