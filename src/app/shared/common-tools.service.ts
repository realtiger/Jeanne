import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommonToolsService {
  get host() {
    return this.document.location.hostname;
  }

  get port() {
    return this.document.location.port;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}
}
