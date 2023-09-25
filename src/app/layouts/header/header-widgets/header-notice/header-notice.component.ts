import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-header-notice',
  templateUrl: './header-notice.component.html',
  styles: [
    `
      d-badge {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .operations-notice {
        margin: auto 12px;
        display: flex;
        align-items: center;
        padding-left: 8px;
        height: 60px;
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNoticeComponent {
  noticeCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  handleNoticeCount(event: number) {
    this.noticeCount = event;
    this.cdr.detectChanges();
  }
}
