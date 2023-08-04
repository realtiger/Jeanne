import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout, ModalComponent, TableWidthConfig } from 'ng-devui';

import { UserManagerService } from './user-manager.service';
import { ListParams, ResponseStatus } from '../../../../types/global';
import { FormConfig, FormData, TableColumns } from '../../../../types/layout';
import { CreateUserData, UpdateUserData, User } from '../../../../types/management/user-manager';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagerComponent {
  @ViewChild('editorTemplate', { static: true }) editorTemplate: TemplateRef<any> | undefined;
  loading = false;
  userList: User[] = [];
  pager = {
    index: 1,
    limit: 10,
    offset: 0,
    total: 0
  };
  tableColumns: TableColumns[] = [
    {
      field: 'username',
      header: '用户名',
      fieldType: 'text'
    },
    {
      field: 'name',
      header: '姓名',
      fieldType: 'text'
    },
    {
      field: 'email',
      header: '邮箱',
      fieldType: 'text'
    },
    {
      field: 'status',
      header: '状态',
      fieldType: 'tag'
    },
    {
      field: 'superuser',
      header: '超级用户',
      fieldType: 'tag'
    },
    {
      field: 'last_login_ip',
      header: '上次登录IP',
      fieldType: 'text'
    },
    {
      field: 'last_login_time',
      header: '上次登录时间',
      fieldType: 'date'
    },
    {
      field: 'create_time',
      header: '创建时间',
      fieldType: 'date'
    }
  ];
  tableWidthConfig: TableWidthConfig[] = [
    // {
    //   field: 'id',
    //   width: '150px'
    // },
    // {
    //   field: 'title',
    //   width: '200px'
    // },
    // {
    //   field: 'priority',
    //   width: '100px'
    // },
    // {
    //   field: 'iteration',
    //   width: '100px'
    // },
    // {
    //   field: 'assabnormal500ignee',
    //   width: '100px'
    // },
    // {
    //   field: 'status',
    //   width: '100px'
    // },
    // {
    //   field: 'timeline',
    //   width: '100px'
    // },
    // {
    //   field: 'operator',
    //   width: '100px'
    // }
  ];

  selectUser: User | null = null;
  modelRef: { modalInstance: ModalComponent } | null = null;

  showCreateForm = false;
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: '用户名',
        prop: 'username',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '用户名不能为空' }]
        }
      },
      {
        label: '密码',
        prop: 'password',
        type: 'password',
        required: true,
        rule: {
          validators: [
            { required: true, message: '密码不能为空' },
            { minlength: 8, message: '密码长度不能小于8位' }
          ]
        }
      },
      {
        label: '确认密码',
        prop: 'rePassword',
        type: 'password',
        required: true,
        rule: {
          validators: [
            { required: true, message: '确认密码不能为空' },
            { minlength: 8, message: '确认密码长度不能小于8位' },
            { sameToPassword: this.sameToPassword.bind(this), message: '两次输入密码不一致' }
          ]
        }
      },
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '姓名不能为空' }]
        }
      },
      {
        label: '邮箱',
        prop: 'email',
        type: 'input',
        required: true,
        rule: {
          validators: [
            { required: true, message: '邮箱不能为空' },
            { email: true, message: '邮箱格式不正确' }
          ]
        }
      },
      {
        label: '头像',
        prop: 'avatar',
        type: 'input'
      },
      {
        label: '个人简介',
        prop: 'detail',
        type: 'textarea'
      }
    ],
    labelSize: ''
  };
  defaultRowData: FormData = {
    username: '',
    password: '',
    rePassword: '',
    name: '',
    email: '',
    avatar: '/assets/images/avatar/default.jpg',
    detail: ''
  };
  formRowData: FormData = { ...this.defaultRowData };
  formLoading = false;

  editFormConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: '用户名',
        prop: 'username',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '用户名不能为空' }]
        }
      },
      {
        label: '姓名',
        prop: 'name',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true, message: '姓名不能为空' }]
        }
      },
      {
        label: '邮箱',
        prop: 'email',
        type: 'input',
        required: true,
        rule: {
          validators: [
            { required: true, message: '邮箱不能为空' },
            { email: true, message: '邮箱格式不正确' }
          ]
        }
      },
      {
        label: '头像',
        prop: 'avatar',
        type: 'input'
      },
      {
        label: '超级用户',
        prop: 'superuser',
        type: 'select',
        options: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      },
      {
        label: '等级',
        prop: 'level',
        type: 'number',
        rule: {
          validators: [
            { required: true, message: '等级不能为空' },
            { min: 1, message: '等级不能小于1' }
          ]
        }
      },
      {
        label: '状态',
        prop: 'status',
        type: 'select',
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' }
        ]
      },
      {
        label: '个人简介',
        prop: 'detail',
        type: 'textarea'
      }
    ],
    labelSize: ''
  };
  editDefaultRowData: FormData = {
    username: '',
    name: '',
    email: '',
    avatar: '/assets/images/avatar/default.jpg',
    detail: '',
    superuser: '0',
    status: 'active',
    level: '1'
  };

  constructor(private cdr: ChangeDetectorRef, private dialogService: DialogService, private userManagerService: UserManagerService) {
    this.loadData();
  }

  tagTitleTranslate(field: string, value: string): string {
    if (field === 'status') {
      switch (value) {
        case 'active':
          return '启用';
        case 'inactive':
          return '禁用';
        default:
          return '未知';
      }
    } else if (field === 'superuser') {
      switch (value) {
        case '1':
          return '是';
        case '0':
          return '否';
        default:
          return '未知';
      }
    }
    return value;
  }

  loadData() {
    this.loading = true;
    const listParams: ListParams = {
      index: this.pager.index,
      limit: this.pager.limit
    };
    this.userManagerService.getUserList(listParams).subscribe(res => {
      this.loading = false;
      this.userList = res.items;
      this.pager = res.pagination;
      this.cdr.detectChanges();
    });
  }

  onPageChange(e: number) {
    this.pager.index = e;
    this.loadData();
  }

  onSizeChange(e: number) {
    this.pager.limit = e;
    this.loadData();
  }

  openCreateUserForm() {
    this.showCreateForm = true;
    this.formRowData = { ...this.defaultRowData };
  }

  closeCreateUserForm() {
    this.showCreateForm = false;
  }

  sameToPassword(value: string) {
    return value === this.formRowData['password'];
  }

  createUser(formData: FormData) {
    this.formLoading = true;
    const user: CreateUserData = {
      username: typeof formData['username'] === 'string' ? formData['username'] : '',
      password: typeof formData['password'] === 'string' ? formData['password'] : '',
      rePassword: typeof formData['rePassword'] === 'string' ? formData['rePassword'] : '',
      name: typeof formData['name'] === 'string' ? formData['name'] : '',
      email: typeof formData['email'] === 'string' ? formData['email'] : '',
      avatar: typeof formData['avatar'] === 'string' ? formData['avatar'] : '',
      detail: typeof formData['detail'] === 'string' ? formData['detail'] : ''
    };

    this.userManagerService.createUser(user).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.formLoading = false;
        this.loadData();
      },
      error: () => {
        this.formLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openEditUserForm(row: User) {
    this.selectUser = row;
    this.editDefaultRowData = {
      username: row.username,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      detail: row.detail,
      superuser: row.superuser.toString(),
      status: row.status,
      level: row.level.toString()
    };

    if (this.editorTemplate) {
      this.modelRef = this.dialogService.open({
        id: 'edit-dialog',
        width: '600px',
        maxHeight: '600px',
        title: '编辑用户信息',
        contentTemplate: this.editorTemplate,
        backdropCloseable: true,
        buttons: []
      });
    }
  }

  closeEditUserForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
    }
  }

  editUser(formData: FormData) {
    if (!this.selectUser) {
      return;
    }

    this.formLoading = true;
    const userId = this.selectUser.id;

    const body: UpdateUserData = {
      username: typeof formData['username'] === 'string' ? formData['username'] : '',
      name: typeof formData['name'] === 'string' ? formData['name'] : '',
      email: typeof formData['email'] === 'string' ? formData['email'] : '',
      avatar: typeof formData['avatar'] === 'string' ? formData['avatar'] : '',
      detail: typeof formData['detail'] === 'string' ? formData['detail'] : '',
      superuser: typeof formData['superuser'] === 'string' && formData['superuser'] === '1',
      level: typeof formData['level'] === 'string' ? parseInt(formData['level'], 10) : 1,
      status: ResponseStatus.ACTIVE
    };

    switch (formData['status']) {
      case 'inactive':
        body.status = ResponseStatus.INACTIVE;
        break;
      case 'frozen':
        body.status = ResponseStatus.FROZEN;
        break;
      case 'obsolete':
        body.status = ResponseStatus.OBSOLETE;
        break;
      default:
        body.status = ResponseStatus.ACTIVE;
    }

    this.userManagerService.updateUser(userId, body).subscribe({
      next: value => {
        this.selectUser = null;
        this.formLoading = false;
        for (const user of this.userList) {
          if (user.id === userId) {
            user.username = value.username;
            user.name = value.name;
            user.email = value.email;
            user.avatar = value.avatar;
            user.detail = value.detail;
            user.superuser = value.superuser;
            user.level = value.level;
            user.status = value.status;
            break;
          }
        }
        this.cdr.detectChanges();
        if (this.modelRef !== null) {
          this.modelRef.modalInstance.hide();
        }
      },
      error: () => {
        this.formLoading = false;
      }
    });
  }

  openDeleteUserForm(row: User) {
    this.selectUser = row;

    this.modelRef = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: '删除用户',
      showAnimate: false,
      content: `确定要删除用户 ${row.name}(${row.username}) 吗？`,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          handler: () => {
            this.deleteUser(row.id);
          }
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: this.closeDeleteUserForm.bind(this)
        }
      ]
    });
  }

  closeDeleteUserForm() {
    if (this.modelRef) {
      this.modelRef.modalInstance.hide();
    }
  }

  deleteUser(UerId: number) {
    this.closeDeleteUserForm();
    this.loading = true;
    this.cdr.detectChanges();
    this.userManagerService.deleteUser(UerId).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
