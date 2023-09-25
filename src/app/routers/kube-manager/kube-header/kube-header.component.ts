import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MenuService } from '../../../core/services/menu.service';
import { KubeManagerService } from '../kube-manager.service';

interface BreadcrumbItem {
  title: string;
  link?: string;
  icon?: string;
}

@Component({
  selector: 'app-kube-header',
  templateUrl: './kube-header.component.html',
  styleUrls: ['../../../layouts/page-content/page-header/page-header.component.scss', './kube-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubeHeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() titleIcon = '';
  @Input() description = '';
  breadcrumbList: BreadcrumbItem[] = [];
  currentNamespace = '';
  namespaceBehaviorSubject$?: Subscription;

  get namespaces() {
    return this.kubeManagerService.namespaces;
  }

  get kubeSetting() {
    return this.kubeManagerService.kubeSetting;
  }

  constructor(private cdr: ChangeDetectorRef, private router: Router, private menuService: MenuService, private kubeManagerService: KubeManagerService) {}

  ngOnInit(): void {
    this.namespaceBehaviorSubject$ = this.kubeManagerService.namespaceBehaviorSubject$.subscribe(namespaces => {
      this.currentNamespace = '';
      for (const ns of namespaces) {
        if (ns.current) {
          this.currentNamespace = ns.name;
        }
      }
      this.buildBreadcrumb();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.namespaceBehaviorSubject$?.unsubscribe();
  }

  buildBreadcrumb() {
    this.breadcrumbList = [];
    this.menuService.buildBreadcrumb(this.breadcrumbList, this.router.url);
    this.breadcrumbList.unshift({ title: '', link: '/', icon: 'icon-homepage' });
    if (this.breadcrumbList.length > 1) {
      if (this.titleIcon.length === 0) {
        this.titleIcon = this.breadcrumbList[this.breadcrumbList.length - 1].icon || '';
      }
      if (this.title.length === 0) {
        this.title = this.breadcrumbList[this.breadcrumbList.length - 1].title || '';
      }
    }
  }

  namespaceChange() {
    this.currentNamespace = this.currentNamespace.trim();
    this.kubeManagerService.changeNamespace(this.currentNamespace);
  }
}
