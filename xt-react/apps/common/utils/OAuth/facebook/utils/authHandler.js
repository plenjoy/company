import config from '../config';
import * as apiUrl from '../apiUrl';
import {fbCookieClear, getValidString, formatUser, userFields} from './helper';

let isRetryLogin = false;

export function init() {
  window.fbAsyncInit = () => {
    // 初始化Facebook SDK配置
    FB.init(config);
    // 记录页面操作情况
    FB.AppEvents.logPageView();

    // 获取已经授权登录的用户
    FB.getLoginStatus(getLoginState.bind(this));
  };
}

export function login() {
  return new Promise((resolve, reject) => {
    if(!this.isLogin) {
      FB.login(({authResponse}) => {
        authResponse.type = 'facebook';
        resolve(authResponse);
      },
        {scope: 'user_photos,user_birthday,user_posts'}
      );
    } else {
      resolve(this.authResponse);
    }
  });
}

export async function getUser() {
  const user = await this.request(apiUrl.GET_USER_URL(), { fields: userFields });

  return formatUser(user);
}

export async function getLoginState(response) {
  // 如果用户授权并且已连接
  if (response.status === 'connected') {
    this.authResponse = response.authResponse;

    // 获取用户信息
    const user = await this.getUser();
    this.isLogin = true;

    // 回调预登录函数，把用户传回去
    this.preLoginCallback(user);

    // 如果用户未登录，或者facebook登录失败(bug from facebook)
  } else if(response.status === 'unknown') {
    // 清除facebook的cookie
    fbCookieClear();

    if(!isRetryLogin) {
      isRetryLogin = true;
      FB.getLoginStatus(getLoginState.bind(this));
    }
  }
}