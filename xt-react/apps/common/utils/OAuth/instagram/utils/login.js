import * as apiUrl from '../apiUrl';

let promiseResolve = null;

/**
 * instagram主动登录函数
 */
export default function login() {
  return new Promise((resolve, reject) => {
    // 设置登录回调函数
    setLoginCallback(resolve);
    // 设置登录事件函数
    setLoginHandler(resolve);
    // 打开授权认证页面
    window.open(apiUrl.GET_AUTH_URL(this.baseUrl), '_new','resizable=no,status=no,toolbar=no,menubar=no,width=389,height=320');
  });
}

/**
 * 设置登录回调函数
 * 
 * @param {*} resolve 
 */
function setLoginCallback(resolve) {
  window.insCallback = data => {
    try {
      // 解析子窗口回调传过来的json数据
      data = JSON.parse(data);
      
      // 如果有token，调用回调函数传出token
      if(data.accessToken) {
        resolve(data);
      }
    } catch(e) {}
  };
}

/**
 * 设置登录回调事件
 * @param {*} resolve 
 */
function setLoginHandler(resolve) {
  promiseResolve = resolve;
  window.addEventListener('message', loginHandler);
}

/**
 * 登录回调事件
 */
function loginHandler() {
  window.addEventListener('message', ({data}) => {
    try {
      // 解析子窗口回调传过来的json数据
      data = JSON.parse(data);
      // 如果有token，调用promise传出token
      if(data.accessToken) {
        promiseResolve(data.accessToken);
      }
    } catch(e) {}
  });
}
