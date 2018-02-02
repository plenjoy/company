/**
 * 上传图片
 * @param  {object} obj
 * obj = {
 *   url: 上传接口地址,
 *   method: get/post,
 *   progress: progress处理函数,
 *   success: success处理函数
 *   error: error处理函数
 *   readyStateChange: state change处理函数
 *  }
 */


const request = (obj, xhrObject) => {
  const defaultSetting = { method: 'get', async: true };
  const param = Object.assign({}, defaultSetting, obj);
  const xhr = xhrObject || createXHR();

  // 上传进度
  xhr.upload.onprogress = function (event) {
    param.progress && param.progress(event);
  };

  // 接口请求成功
  xhr.onload = function () {
    param.success && param.success(this.responseText, {
      status: this.status,
      statusText: this.statusText
    });
  };

  // 接口请求错误
  xhr.onerror = function (err) {
    param.error && param.error(err,  {
      status: this.status,
      statusText: this.statusText
    });
  };

  // 请求状态改变
  xhr.onreadystatechange = function () {
    param.readyStateChange && param.readyStateChange(this.readyState, this.status);
  };


  // 请求接口
  xhr.open(param.method, param.url, param.async);
  if(param.setHead){
     xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  }


  // // 在IE上, timeout的设置不能放在open方法之前. 或者会有错误发生.
  // // 超时: 10分钟.
  // xhr.timeout = 1000 * 60 * 10;

  // // 防止响应超时
  // xhr.ontimeout = function (e) {
  //   xhr.abort();

  //   const ev = e || window.event;
  //   param.timeout && param.timeout(ev);
  // };

  // 发送数据
  if (param.method.toLowerCase() === 'post') {
    xhr.send(param.data);
  } else {
    xhr.send(null);
  }

  return xhr;
};

/**
 * 创建xhr对象
 */
const createXHR = () => {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    const versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
    for (let i = 0, len = versions.length; i < len; i++) {
      try {
        return new ActiveXObject(version[i]);
        break;
      } catch (e) {}
    }
  } else {
    throw new Error('xhr not support');
  }
};

export default request;
