import * as apiUrl from '../../apiUrl';

let promiseResolve = null;
let insPreframe = null;

export default function preLogin() {
  return new Promise((resolve, reject) => {
    // 创建DOM虚拟iframe
    insPreframe = document.createElement('iframe');
    
    insPreframe.src = apiUrl.GET_AUTH_URL(this.baseUrl);
    insPreframe.style.display = 'none';

    document.body.appendChild(insPreframe);

    // 设置预登录回调函数
    setPreLoginCallback(resolve);

    // 设置预登录回调事件
    setPreLoginHandler(resolve);
  });
}

/**
 * instagram预登录回调函数
 * 
 * @param {*} resolve 
 */
function setPreLoginCallback(resolve) {
  window.preLoginCallback = data => {
    try {
      // 解析子iframe回调传过来的json数据
      data = JSON.parse(data);

      // 如果有token，调用回调函数传出token
      if(data.accessToken) {
        // 移除预登陆iframe
        document.body.removeChild(insPreframe);

        resolve(data.accessToken);
      }
    } catch(e) {}
  };
}

/**
 * 设置instagram预登录回调事件
 * 
 * @param {*} resolve 
 */
function setPreLoginHandler(resolve) {
  promiseResolve = resolve;
  window.addEventListener('message', preLoginHandler);
}

/**
 * 移除instagram预登录回调事件
 */
function removePreLoginHandler() {
  window.removeEventListener('message', preLoginHandler);
  // 移除预登陆iframe
  document.body.removeChild(insPreframe);
}

function preLoginHandler({data}) {
  try {
    // 解析子iframe回调传过来的json数据
    data = JSON.parse(data);
    // 如果有token，调用promise传出token
    if(data.accessToken) {
      promiseResolve(data.accessToken);
      removePreLoginHandler();

      // 如果有登录，则传递token给login函数
      window.postMessage(JSON.stringify(data), '*');
    }
  } catch(e) {}
}