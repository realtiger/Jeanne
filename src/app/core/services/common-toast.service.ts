import { Injectable } from '@angular/core';
import { ToastService } from 'ng-devui';
import { Message } from 'ng-devui/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class CommonToastService {
  constructor(private toastService: ToastService) {}

  openToast({ severity = 'success', summary = '', content = '', life = 5000 }) {
    // 修复 life 为 0 时的 bug
    if (life <= 0) {
      life = 5000;
    }

    // 整理参数
    const message: Message = {};
    if (summary.length > 0) {
      message['summary'] = summary;
    }
    if (content.length > 0) {
      message['content'] = content;
    }
    if (severity.length === 0) {
      severity = 'success';
    }
    message['severity'] = severity;

    this.toastService.open({ value: [message], life });
  }

  success(title: string, message = '', life = 5000) {
    this.openToast({ severity: 'success', summary: title, content: message, life });
  }

  info(title: string, message = '', life = 5000) {
    this.openToast({ severity: 'info', summary: title, content: message, life });
  }

  warning(title: string, message = '', life = 5000) {
    this.openToast({ severity: 'warning', summary: title, content: message, life });
  }

  error(title: string, message = '', life = 5000) {
    this.openToast({ severity: 'error', summary: title, content: message, life });
  }
}
