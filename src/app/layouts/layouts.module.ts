import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccordionModule, AvatarModule, BadgeModule, ButtonModule, DropDownModule, LayoutModule, SearchModule, TabsModule, TagsModule } from 'ng-devui';

import { FooterComponent } from './footer/footer.component';
import { HeaderLogoComponent } from './header/header-logo/header-logo.component';
import { HeaderNavbarComponent } from './header/header-navbar/header-navbar.component';
import { HeaderOperationNoticeComponent } from './header/header-operation/header-operation-notice/header-operation-notice.component';
import { HeaderOperationComponent } from './header/header-operation/header-operation.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutsService } from './layouts.service';
import { OverallLayoutComponent } from './overall-layout/overall-layout.component';
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
    HeaderOperationNoticeComponent
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
    TagsModule
  ],
  providers: [LayoutsService],
  exports: [FooterComponent, OverallLayoutComponent]
})
export class LayoutsModule {}
