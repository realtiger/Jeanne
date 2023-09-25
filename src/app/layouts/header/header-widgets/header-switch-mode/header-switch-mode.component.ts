import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-switch-mode',
  templateUrl: './header-switch-mode.component.html',
  styles: [
    `
      .operations-switch {
        margin: auto 12px;

        .devui-dropdown-menu {
          min-width: 120px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderSwitchModeComponent {}
