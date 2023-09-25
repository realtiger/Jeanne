import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageContentService implements OnDestroy {
  reloadBehaviorSubject$ = new BehaviorSubject(false);

  ngOnDestroy() {
    this.reloadBehaviorSubject$.unsubscribe();
  }
}
