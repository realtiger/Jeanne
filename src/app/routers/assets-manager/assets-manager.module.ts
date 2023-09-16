import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, CheckBoxModule, DataTableModule, LayoutModule, PaginationModule, TabsModule } from 'ng-devui';

import { AssetsManagerRoutingModule } from './assets-manager-routing.module';
import { AssetsManagerComponent } from './assets-manager.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { ServerManagerService } from './server-manager/server-manager.service';
import { TagManagerComponent } from './tag-manager/tag-manager.component';
import { TagManagerService } from './tag-manager/tag-manager.service';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [AssetsManagerComponent, ServerManagerComponent, TagManagerComponent],
  imports: [CommonModule, AssetsManagerRoutingModule, LayoutsModule, ButtonModule, FormsModule, TabsModule, CheckBoxModule, DataTableModule, LayoutModule, PaginationModule],
  providers: [ServerManagerService, TagManagerService]
})
export class AssetsManagerModule {}
