import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DValidateRules, FormLayout } from 'ng-devui';
import { Message } from 'ng-devui/toast/toast.component';

import { environment } from '../../../../environments/environment';
import { LoginType } from '../../../../types/passport';
import { AuthService } from '../../../core/services/auth.service';
import { StartupService } from '../../../core/services/startup.service';
import { TokenService } from '../../../core/services/token.service';

interface LoginFieldInfo {
  title: string;
  placeholder?: string;
  validators?: DValidateRules;
}

interface LoginTabItem {
  id: string | number;
  title: string;
  username: LoginFieldInfo;
  password: LoginFieldInfo;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  // 样式相关变量
  horizontalLayout: FormLayout = FormLayout.Horizontal;
  // 全局变量(component 内部使用)
  siteInfo = environment.siteInfo;
  toastMessage: Message[] = [];
  loading = false;
  loginFormRules: { [key: string]: DValidateRules } = {
    usernameRules: {
      validators: [
        { required: true, message: '用户名必填。' },
        { minlength: 3, message: '用户名最少3个字符。' },
        { maxlength: 64, message: '用户名最多64个字符。' },
        {
          pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
          message: '用户名只能包含大写字母、小写字母和数字。'
        }
      ]
    },
    emailRules: {
      validators: [{ required: true }, { email: true }],
      message: '请输入正确的邮箱地址。'
    },
    passwordRules: {
      validators: [{ required: true }, { minlength: 6 }, { maxlength: 64 }, { pattern: /^[a-zA-Z0-9\d@$!%*?&.]+(\s+[a-zA-Z0-9]+)*$/ }],
      message: '请输入6到15位的数字和字母组合密码。'
    }
  };
  loginForm: FormGroup;

  // 登录方式切换
  tabItems: LoginTabItem[] = [
    {
      id: LoginType.Account,
      title: '账号密码登录',
      username: {
        title: '用户名',
        placeholder: '请填写用户名',
        validators: this.loginFormRules['usernameRules']
      },
      password: {
        title: '密码',
        placeholder: '请填写密码',
        validators: this.loginFormRules['passwordRules']
      }
    },
    {
      id: LoginType.Email,
      title: '邮箱登录',
      username: { title: '邮箱', placeholder: '请填写邮箱', validators: this.loginFormRules['emailRules'] },
      password: { title: '密码', placeholder: '请填写密码', validators: this.loginFormRules['passwordRules'] }
    }
  ];
  tabActiveId = this.tabItems[0].id;
  showPassword = false;

  get tabActiveItem(): LoginTabItem {
    return this.tabItems.find(item => item.id === this.tabActiveId) || this.tabItems[0];
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private tokenService: TokenService,
    private startupService: StartupService
  ) {
    // 如果已经登录，直接跳转到首页
    if (this.authService.isUserLoggedIn) {
      const referrerUrl = this.tokenService.referrer.url || '/';
      this.router.navigateByUrl(referrerUrl).then();
    }

    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
      remember: [false]
    });
  }

  formSubmit() {
    if (this.loginForm.invalid || this.loading) {
      return;
    }

    const { username, password, remember } = this.loginForm.value;
    this.loading = true;
    this.authService.login(username, password, remember, this.tabActiveId).subscribe({
      next: res => {
        this.loading = false;
        this.tokenService.setToken(res.access_token, res.refresh_token);
        this.startupService.load().subscribe({
          next: () => {
            const referrerUrl = this.tokenService.referrer.url || '/';
            this.router.navigateByUrl(referrerUrl).then();
          }
        });
      },
      error: err => {
        this.loading = false;
        this.toastMessage = [
          {
            severity: 'error',
            summary: '登录失败',
            content: err.message
          }
        ];
        this.cdr.markForCheck();
      }
    });
  }
}
