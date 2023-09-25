import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styles: [
    `
      d-search {
        margin-right: 32px;

        /* TODO: 修正search组件视觉误差后删除 */
        margin-top: 0.1em;

        :host .devui-search .devui-search-icon > svg {
          width: 14px;
          height: 14px;
          margin-top: -0.1em;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderSearchComponent {
  // TODO 补齐search能力
  onSearch(event: string) {
    console.log(event);
  }
}
