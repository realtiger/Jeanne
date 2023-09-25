import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  AccordionModule,
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CheckBoxModule,
  DataTableModule,
  DatepickerModule,
  DropDownModule,
  FormModule,
  IconModule,
  InputNumberModule,
  LayoutModule,
  LoadingModule,
  PaginationModule,
  SearchModule,
  SelectModule,
  StatusModule,
  TabsModule,
  TagsModule,
  TextareaModule,
  TextInputModule,
  ToggleModule
} from 'ng-devui';

import { FooterComponent } from './footer/footer.component';
import { HeaderLogoComponent } from './header/header-logo/header-logo.component';
import { HeaderNavbarComponent } from './header/header-navbar/header-navbar.component';
import { HeaderOperationNoticeComponent } from './header/header-operation/header-operation-notice/header-operation-notice.component';
import { HeaderOperationComponent } from './header/header-operation/header-operation.component';
import { HeaderHelpComponent } from './header/header-widgets/header-help/header-help.component';
import { HeaderNoticeComponent } from './header/header-widgets/header-notice/header-notice.component';
import { HeaderSearchComponent } from './header/header-widgets/header-search/header-search.component';
import { HeaderSwitchModeComponent } from './header/header-widgets/header-switch-mode/header-switch-mode.component';
import { HeaderUserComponent } from './header/header-widgets/header-user/header-user.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutsService } from './layouts.service';
import { OverallLayoutComponent } from './overall-layout/overall-layout.component';
import { PageContentComponent } from './page-content/page-content.component';
import { PageFormComponent } from './page-content/page-form/page-form.component';
import { PageHeaderComponent } from './page-content/page-header/page-header.component';
import { PageTableComponent } from './page-content/page-table/page-table.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [
    FooterComponent,
    OverallLayoutComponent,
    LayoutComponent,
    HeaderLogoComponent,
    SideMenuComponent,
    HeaderNavbarComponent,
    HeaderOperationComponent,
    HeaderOperationNoticeComponent,
    PageHeaderComponent,
    PageFormComponent,
    PageTableComponent,
    PageContentComponent,
    HeaderSearchComponent,
    HeaderHelpComponent,
    HeaderNoticeComponent,
    HeaderUserComponent,
    HeaderSwitchModeComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutModule,
    NgOptimizedImage,
    AccordionModule,
    DropDownModule,
    RouterLink,
    RouterLinkActive,
    SearchModule,
    BadgeModule,
    TabsModule,
    ButtonModule,
    AvatarModule,
    TagsModule,
    BreadcrumbModule,
    FormModule,
    TextInputModule,
    SelectModule,
    FormsModule,
    DatepickerModule,
    TextareaModule,
    InputNumberModule,
    LoadingModule,
    PaginationModule,
    DataTableModule,
    ToggleModule,
    CheckBoxModule,
    StatusModule,
    IconModule
  ],
  providers: [LayoutsService],
  exports: [FooterComponent, OverallLayoutComponent, PageHeaderComponent, PageFormComponent, PageContentComponent]
})
export class LayoutsModule {}
