import config from '../config';
import { formatUser } from './helper';

/**
 * 载入google SDK
 */
export function loadSDK() {
  return new Promise((resolve, reject) => {
    // 查找第一个script节点
    const firstJs = document.getElementsByTagName('script')[0];
    
    // 如果已经有google SDK，则返回
    if(document.getElementById('gooogle-jssdk')) {
      resolve();
      return;
    }
  
    //没有则创建google SDK
    const googleSDK = document.createElement('script');
    googleSDK.id = 'gooogle-jssdk';
    googleSDK.src = 'https://apis.google.com/js/platform.js';
    firstJs.parentNode.insertBefore(googleSDK, firstJs);

    // 加载完成后返回
    googleSDK.onload = () => resolve();
  });
}

/**
 * 初始化google SDK api
 */
export async function init() {
  // 初始化SDK信息
  await gapi.client.init(config);
  
  // 获取登录用户access_token
  this.GoogleAuth = gapi.auth2.getAuthInstance();
  this.GoogleUser = this.GoogleAuth.currentUser.get();
  this.accessToken = this.GoogleUser.getAuthResponse().access_token;

  // 如果有access_token，则返回用户账号信息
  if(this.accessToken) {
    const profile = this.GoogleUser.getBasicProfile();

    this.preLoginCallback(formatUser(profile));
  }
}

/**
 * 用户授权登录
 */
export async function login() {
  if(!this.accessToken) {
    this.GoogleUser = await this.GoogleAuth.signIn();
  }
  this.accessToken = this.GoogleUser.getAuthResponse().access_token;

  return {
    accessToken: this.accessToken,
    type: 'google',
    userID: this.GoogleUser.getId()
  };
}

/**
 * 获取
 */
export async function getUser() {
  const profile = this.GoogleUser.getBasicProfile();
  
  return formatUser(profile);
}