import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui';

import { FormConfig, FormData } from '../../../../types/layout';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styles: [
    `
      .form-operation.devui-form-operation {
        margin-left: 115px !important;
      }

      @media only screen and (max-width: 1023px) {
        .form-operation.devui-form-operation {
          margin-left: 0 !important;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageFormComponent implements OnInit {
  @Input() formValue: FormData = {};
  @Input() formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: []
  };
  @Input() formData: FormData = {};
  @Input() loading = false;
  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  get formConfigLayout() {
    return this.formConfig.layout || FormLayout.Horizontal;
  }

  get formConfigLabelSize() {
    return this.formConfig.labelSize || '';
  }

  ngOnInit() {
    if (Object.keys(this.formValue).length === 0) {
      // 深拷贝
      this.formValue = JSON.parse(JSON.stringify(this.formData));
    } else {
      Object.assign(this.formValue, this.formData);
    }
  }

  submitPlanForm({ valid }: { valid: boolean }) {
    if (valid) {
      this.submitted.emit(this.formValue);
    }
  }

  cancel() {
    this.canceled.emit();
  }
}
