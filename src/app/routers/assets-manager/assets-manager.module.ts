import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, TabsModule } from 'ng-devui';

import { AssetsManagerRoutingModule } from './assets-manager-routing.module';
import { AssetsManagerComponent } from './assets-manager.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { ServerManagerService } from './server-manager/server-manager.service';
import { LayoutsModule } from '../../layouts/layouts.module';

@NgModule({
  declarations: [AssetsManagerComponent, ServerManagerComponent],
  imports: [CommonModule, AssetsManagerRoutingModule, LayoutsModule, ButtonModule, FormsModule, TabsModule],
  providers: [ServerManagerService]
})
export class AssetsManagerModule {}
