import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SystemLogService } from './system-log.service';
import { LoadDataParams } from '../../../../types/global';
import { TableColumns } from '../../../../types/layout';

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLogComponent {
  systemLogColumns: TableColumns[] = [
    {
      field: 'username',
      header: '操作用户',
      fieldType: 'text'
    },
    {
      field: 'name',
      header: '用户名称',
      fieldType: 'text'
    },
    {
      field: 'method',
      header: '请求方法',
      fieldType: 'tag'
    },
    {
      field: 'uri',
      header: '请求路径',
      fieldType: 'text'
    },
    {
      field: 'data',
      header: '请求数据',
      fieldType: 'text'
    },
    {
      field: 'login_ip',
      header: '登录IP',
      fieldType: 'text'
    },
    {
      field: 'create_time',
      header: '操作时间',
      fieldType: 'date'
    }
  ];

  constructor(private systemLogService: SystemLogService) {}

  loadData(params: LoadDataParams) {
    this.systemLogService.getSystemLogList(params.params).subscribe({
      next: res => {
        params.callback(true, res);
      },
      error: () => {
        params.callback(false);
      }
    });
  }
}
