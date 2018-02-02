/**
 * 获取cookie里指定key的值.
 * @param key 键的名称
 */
export const getCookieDate = (key) => {
  let value = null;
  const aCookie = document.cookie.split(';');
  if (aCookie) {
    for (let i = 0; i < aCookie.length; i++) {
      const aCrumb = aCookie[i].split('=');
      if (aCrumb.length > 1 && key == aCrumb[0]) {
        value = unescape(aCrumb[1]);
        break;
      }
    }
  }

  return value;
};

/**
 * 通过XMLHttpRequest对象, 发送ajax请求.
 * @param url request的请求地址
 * @param data 要发送的对象
 * @param completed 发送成功后的回调
 * @param failed 发送失败时的回调.
 */
export const get = (url, completed, failed) => {
  const request = new XMLHttpRequest();

  // 请求完成时的回调.
  request.onload = function (ev) {
    if (completed && typeof (completed) === 'function') {
      completed(ev || window.event);
    }
  };

  // 请求失败时的回调.
  request.onerror = function (ev) {
    if (failed && typeof (failed) === 'function') {
      failed(ev || window.event);
    }
  };

  request.open('GET', url);
  request.send();
};


/**
 * 上传日志到日志服务器.
 * @param data
 * @param session
 * @param uid
 */
export const goTracker = (data, session, uid, completed, failed) => {
  const hostName = `${window.location.hostname}`;

  var session = session || getCookieDate(' JSESSIONID') || getCookieDate('JSESSIONID');
  const asUid = uid || getCookieDate(' AS_UID') || getCookieDate('AS_UID');
  data = `${session},${asUid},${new Date().getTime()},${data}`;

  let logUrl = `${'https://venus.zno.com/b.htm' + '?'}${data}`;
  if (hostName != 'www.zno.com') {
    logUrl = `${'https://log.zno.com.t/b.htm' + '?'}${data}`;
  }
  // 调用ajax, 上传日志信息.
  get(logUrl, completed, failed);
};
