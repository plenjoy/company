import jsonp from '../../../../jsonp';
import * as apiUrl from '../../apiUrl';
import loginHandler from './login';
import preLoginHandler from './preLogin';
import {getValidString, formatUser} from '../helper';

export async function initPreLogin() {
  // 如果没有预登录初始化
  if(!this.isInitialized) {
    // 设置初始化成功，防止下次继续初始化
    this.isInitialized = true;
    // 预登陆初始化，获取token
    this.accessToken = await preLoginHandler.bind(this)();
    // 触发预登陆回调函数，返回预登陆用户信息
    this.preLoginCallback(await getUser.bind(this)());
  }
}

export async function login() {
  const result = {};

    // 如果没有token，直接触发登录窗口
    if(!this.accessToken) {
      this.accessToken = await loginHandler.bind(this)();

      // 返回登录数据
      result.accessToken = this.accessToken;
      result.type = 'instagram';
    } else {
      // 有token，直接返回登录数据
      result.accessToken = this.accessToken;
      result.type = 'instagram';
    }

    return result;
}

export async function getUser() {
  const response = await this.request(apiUrl.GET_USER_URL(), { access_token: this.accessToken });
  const {data: user} = await response.json();

  return formatUser(user);
}
