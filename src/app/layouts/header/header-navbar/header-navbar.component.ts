import { ConnectedPosition } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppendToBodyDirection } from 'ng-devui/utils';

import { MenuData } from '../../../../types/global';

interface ElementState {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
}

@Component({
  selector: 'app-header-navbar',
  templateUrl: './header-navbar.component.html',
  styleUrls: ['./header-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavbarComponent implements OnInit, AfterViewInit {
  @Input() data: MenuData[] = [];

  @Input() set mode(mode: 'left' | 'top') {
    this._mode = mode;
    this.refreshDataAndView();
  }

  get mode() {
    return this._mode;
  }

  get showTitle() {
    return this.mode === 'top';
  }

  dropdownDirections: { [key: string]: Array<AppendToBodyDirection | ConnectedPosition> } = {
    left: [
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top'
      }
    ],
    top: ['rightDown']
  };

  subMenuDirections: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: -4
    }
  ];

  _mode: 'left' | 'top' = 'top';
  elementsState: ElementState[] = [];
  packData: MenuData[] = [];
  packItemsActive = false;
  currentUrl = this.router.url;

  constructor(private elementRef: ElementRef, private router: Router, private renderer: Renderer2) {}

  @HostListener('window:resize')
  onResize() {
    this.refreshDataAndView();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.packItemsActive = false;
        this.packData.forEach(item => {
          const menuLink = item.link || 'undefined';
          if (this.currentUrl.indexOf(menuLink) !== -1) {
            this.packItemsActive = true;
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // TODO: 解决时间周期问题
      this.refreshDataAndView();
    });
  }

  refreshDataAndView() {
    if (this.mode !== 'top') {
      return;
    }

    const parentWidth = this.elementRef.nativeElement.offsetWidth;

    const itemElements = this.elementRef.nativeElement.querySelectorAll('.nav-item');
    itemElements.forEach((element: HTMLElement, i: number) => {
      if (!this.elementsState[i] && element.offsetLeft > 0) {
        this.elementsState[i] = {
          width: element.offsetWidth,
          height: element.offsetHeight,
          offsetLeft: element.offsetLeft,
          offsetTop: element.offsetTop
        };
      }
    });

    this.packData = [];
    this.packItemsActive = false;
    itemElements.forEach((element: HTMLElement, i: number) => {
      if (this.elementsState[i] && this.elementsState[i].width + this.elementsState[i].offsetLeft > parentWidth - 40) {
        this.packData.push(this.data[i]);

        const menuLink = this.data[i].link || 'undefined';
        if (this.currentUrl.indexOf(menuLink) !== -1) {
          this.packItemsActive = true;
        }

        this.renderer.addClass(element, 'menu-hidden');
      } else {
        this.renderer.removeClass(element, 'menu-hidden');
      }
    });
  }
}
