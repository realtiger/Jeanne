import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy } from '@angular/core';

import { LayoutsService } from '../layouts.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnDestroy {
  @HostBinding('class.layout') default = true;
  config = this.layoutsService.getLayoutConfig();
  private configSubject$ = this.layoutsService.layoutSubject$.subscribe(config => {
    this.config = config;
    this.cdr.markForCheck();
  });

  constructor(private cdr: ChangeDetectorRef, private layoutsService: LayoutsService) {}

  ngOnDestroy(): void {
    this.configSubject$.unsubscribe();
  }

  getSidebarWidth(): string {
    let width = 0;

    if (this.config.sidebar.hidden) {
      return `${width}px`;
    }

    if (!this.config.sidebar.firstSidebar.hidden) {
      width += this.config.sidebar.firstSidebar.width;
    }

    if (!this.config.sidebar.secondSidebar.hidden) {
      width += this.config.sidebar.secondSidebar.width;
    }

    return `${width}px`;
  }

  getHeaderHeight(): string {
    let height = 0;

    if (this.config.header.hidden) {
      return `${height}px`;
    }

    if (!this.config.header.firstHeader.hidden) {
      height += this.config.header.firstHeader.height;
    }

    if (!this.config.header.secondHeader.hidden) {
      height += this.config.header.secondHeader.height;
    }

    return `${height}px`;
  }
}
