import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'ng-devui';
import { BehaviorSubject, catchError, filter, mergeMap, Observable, Observer, of, switchMap, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UniversalResponse } from '../../../types/global';
import { LoginResponse } from '../../../types/passport';
import { TokenService } from '../services/token.service';

const CODE_MESSAGE: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  // 重新刷新token设置
  private refreshTokenEnabled = environment.api.refreshTokenEnabled;
  private refreshTokenType: 're-request' | 'auth-refresh' = environment.api.refreshTokenType;
  // 是否正在刷新token中的标志位
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<null | LoginResponse> = new BehaviorSubject<null | LoginResponse>(null);

  constructor(private router: Router, private http: HttpClient, private toastService: ToastService, private tokenService: TokenService) {}

  /* token刷新机制
   * 1. re-request: 请求时检查token是否过期，过期则刷新token，然后重新请求
   * 2. auth-refresh: 定时刷新token
   */

  // 跳转到登录页
  private toLogin(url = '', haveToken = false): void {
    this.tokenService.referrer.url = url.length > 0 ? url : this.router.url;
    const message = haveToken ? '登录已过期，请重新登录。' : '未登录，请进行登录。';
    this.toastService.open({ value: [{ severity: 'error', summary: message }], life: 2000 });
    setTimeout(() => this.tokenService.gotoLogin());
  }

  //  刷新 Token 请求
  private refreshTokenRequest() {
    const token = this.tokenService.token.enable ? this.tokenService.token.refreshToken || '' : '';
    // 这里将token直接写在请求头中，后端可以根据请求头中的token判断是否需要刷新token，其他系统可能不一样
    return this.http.post<LoginResponse>(this.tokenService.options.refreshUrl, {}, { headers: { Authorization: `Bearer ${token}` } });
  }

  // #region 刷新Token方式一：使用 401 重新刷新 Token
  private tryRefreshToken(event: HttpResponseBase, request: HttpRequest<any>, next: HttpHandler) {
    // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
    if ([this.tokenService.options.refreshUrl].some(url => request.url.includes(url))) {
      this.toLogin();
      throw event;
    }
    // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
    if (this.refreshToking) {
      const token = this.tokenService.token.enable ? this.tokenService.token.refreshToken || '' : '';
      return this.refreshToken$.pipe(
        filter(v => !!v),
        take(1),
        switchMap(() => next.handle(this.setRequest(request, token, true)))
      );
    }
    // 3、尝试调用刷新 Token
    this.refreshToking = true;
    this.refreshToken$.next(null);
    const token = this.tokenService.token.enable ? this.tokenService.token.refreshToken || '' : '';

    return this.refreshTokenRequest().pipe(
      switchMap(res => {
        // 通知后续请求继续执行
        this.refreshToking = false;
        this.refreshToken$.next(res);
        // 重新保存新 token
        this.tokenService.setToken(res.access_token, res.refresh_token);
        // 重新发起请求
        return next.handle(this.setRequest(request, token, true));
      }),
      catchError(err => {
        this.refreshToking = false;
        this.toLogin();
        throw new Error(err);
      })
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = request.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      const { baseUrl } = environment.api;
      url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
    }

    // 添加头信息
    const setHeaders: { [name: string]: string } = {};
    // TODO i18n模块完成后再加入
    // const lang = this.injector.get(I18N_TOKEN).currentLang;
    const lang = 'zh-CN';
    if (!request.headers?.has('Accept-Language') && lang) {
      setHeaders['Accept-Language'] = lang;
    }

    let newRequest = request.clone({ url, setHeaders });

    let ignored = false;

    // 判断白名单
    if (Array.isArray(this.tokenService.options.ignores)) {
      for (const item of this.tokenService.options.ignores) {
        if (item.test(newRequest.url)) {
          ignored = true;
          break;
        }
      }
    }

    if (!ignored) {
      // 判断是否需要添加token
      const ignoreKey = this.tokenService.options.allowAnonymousKey;
      let params = newRequest.params;
      if (newRequest.params.has(ignoreKey)) {
        params = newRequest.params.delete(ignoreKey);
        ignored = true;
      }
      const urlArr = newRequest.url.split('?');
      if (urlArr.length > 1) {
        const queryStringParams = new HttpParams({ fromString: urlArr[1] });
        if (queryStringParams.has(ignoreKey)) {
          const queryString = queryStringParams.delete(ignoreKey).toString();
          url = queryString.length > 0 ? `${urlArr[0]}?${queryString}` : urlArr[0];
          ignored = true;
        }
      }

      if (ignored) {
        newRequest = newRequest.clone({ params, url });
      }
    }

    const token = this.tokenService.token.enable ? this.tokenService.token.token || '' : '';

    // 判断是否需要刷新token
    // 1. 没有token，但是可以忽略则直接发送请求
    // 2. 没有token，但是不可以忽略则跳转登录页
    // 3. 有token，添加token发送请求
    if (token.length == 0) {
      if (ignored) {
        return this.nextHandler(newRequest, next);
      } else {
        this.toLogin('', false);
        return new Observable((observer: Observer<HttpEvent<any>>) => {
          const res = new HttpErrorResponse({
            url: newRequest.url,
            headers: newRequest.headers,
            status: 401,
            statusText: `来自 auth 的拦截，所请求URL未授权，若是登录API可加入 [url?_allow_anonymous=true] 来表示忽略校验，更多方法请参考： https://ng-alain.com/auth/getting-started#AlainAuthConfig\nThe interception from auth, the requested URL is not authorized. If the login API can add [url?_allow_anonymous=true] to ignore the check, please refer to: https://ng-alain.com/auth/getting-started#AlainAuthConfig`
          });
          observer.error(res);
        });
      }
    }

    newRequest = this.setRequest(newRequest, token);
    return this.nextHandler(newRequest, next);
  }

  private nextHandler(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      mergeMap(event => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleData(event, request, next);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse | Error) => {
        if (err instanceof HttpErrorResponse) {
          return this.handleData(err, request, next);
        } else {
          throw err;
        }
      })
    );
  }

  setRequest(request: HttpRequest<any>, token: string, force = false): HttpRequest<any> {
    const options = this.tokenService.options;
    const tokenSendString = options.tokenSendTemplate.replace(/\${(\w+)}/g, token);

    switch (options.tokenSendPlace) {
      case 'header': {
        const currentToken = request.headers.get(options.tokenSendKey) || '';
        if (currentToken.length === 0 || force) {
          const setHeaders: { [key: string]: string } = {};
          setHeaders[options.tokenSendKey] = tokenSendString;
          request = request.clone({ setHeaders });
        }
        break;
      }
      case 'body': {
        const body = request.body || {};
        const currentToken = body[options.tokenSendKey] || '';
        if (currentToken.length === 0 || force) {
          body[options.tokenSendKey] = token;
          request = request.clone({ body });
        }
        break;
      }
      case 'url': {
        const currentToken = request.params.get(options.tokenSendKey) || '';
        if (currentToken.length === 0 || force) {
          request = request.clone({ params: request.params.append(options.tokenSendKey, token) });
        }
        break;
      }
    }
    return request;
  }

  // 对比返回状态码，进行对应的处理
  private checkStatus(event: HttpResponseBase): void {
    const status = event.status || 500;

    if (status < 200 || (status >= 300 && status !== 401)) {
      const errorText = CODE_MESSAGE[event.status] || event.statusText;
      this.toastService.open({ value: [{ severity: 'error', summary: `请求错误 ${event.status}: ${event.url}`, content: errorText }] });
    }
  }

  // 处理返回数据
  private handleData(event: HttpResponseBase, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 业务处理：一些通用操作
    this.checkStatus(event);
    // 处理具体的业务错误
    switch (event.status) {
      case 200:
        // 注意：这里如果抛出异常会被 nextHandler 方法中的 catchError 捕获
        if (event instanceof HttpResponse) {
          const body: UniversalResponse<{}> = event.body;
          if (body && typeof body.success !== 'undefined' && !body.success) {
            this.toastService.open({ value: [{ severity: 'error', content: body.message, summary: '数据错误' }] });
          }
        }
        break;
      case 401:
        if (this.refreshTokenEnabled && this.refreshTokenType === 're-request') {
          return this.tryRefreshToken(event, request, next);
        }
        this.toLogin();
        break;
      case 403:
      case 404:
      case 500:
        //   TODO 跳转异常处理页面
        // this.goTo(`/exception/${ev.status}?url=${req.urlWithParams}`);
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn('未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起', event);
        }
        break;
    }

    if (event instanceof HttpErrorResponse) {
      throw event;
    } else {
      return of(event);
    }
  }
}
