import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { EmptyListItems, ListItems, ListParams, UniversalResponse } from '../../../../types/global';
import { CreateUserData, UpdateUserData, User } from '../../../../types/management/user-manager';
import { CommonToastService } from '../../../core/services/common-toast.service';
import { genHttpParams } from '../../../shared/utils';

@Injectable()
export class UserManagerService {
  constructor(private http: HttpClient, private commonToastService: CommonToastService) {}

  getUserList(listParams: ListParams) {
    const url = `/api/admin/user`;
    const params = genHttpParams(listParams);
    return this.http.get<UniversalResponse<ListItems<User>>>(url, { params }).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          console.warn(`获取用户列表失败: ${res.message}`);
          return EmptyListItems;
        }
      })
    );
  }

  createUser(user: CreateUserData) {
    const url = `/api/admin/user`;
    const body = {
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      detail: user.detail,
      password: user.password,
      re_password: user.rePassword
    };
    return this.http.post<UniversalResponse<User>>(url, body).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('创建用户失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  updateUser(userId: number, user: UpdateUserData) {
    const url = `/api/admin/user/${userId}`;
    return this.http.put<UniversalResponse<User>>(url, user).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('更新用户失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  deleteUser(userId: number) {
    const url = `/api/admin/user/${userId}`;
    return this.http.delete<UniversalResponse<User>>(url).pipe(
      map(res => {
        if (res.success) {
          return res.data;
        } else {
          this.commonToastService.error('删除用户失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  updateUserRoles(userId: number, roleIds: number[]) {
    const url = `/api/admin/user/${userId}/roles`;
    return this.http.put<UniversalResponse<User>>(url, { roles: roleIds }).pipe(
      map(res => {
        if (res.success) {
          this.commonToastService.success('更新用户角色成功', '更新用户角色成功');
          return res.data;
        } else {
          this.commonToastService.error('更新用户角色失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }

  resetPassword(userId: number, password: string, rePassword: string) {
    const url = `/api/admin/user/${userId}/reset_password`;
    return this.http.put<UniversalResponse<User>>(url, { password, re_password: rePassword }).pipe(
      map(res => {
        if (res.success) {
          this.commonToastService.success('重置密码成功', '重置密码成功');
          return res.data;
        } else {
          this.commonToastService.error('重置密码失败', `${res.code}: ${res.message}`);
          throw new Error(res.message);
        }
      })
    );
  }
}
