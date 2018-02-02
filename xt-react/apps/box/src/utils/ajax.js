

const request = (obj) => {
  const defaultSetting = {'method':'get','async':true};
  const param = Object.assign({}, defaultSetting ,obj);
  const xhr = createXHR();
  xhr.upload.onprogress = function(event){
    param.progress && param.progress(event);
  }
  xhr.onload = function(){
    // clearTimeout(timeout);
    param.success && param.success(this.responseText);
  }
  xhr.onerror = function(){
    param.error && param.error();
  }
  xhr.onerror = function(){
    param.error && param.error();
  }
  xhr.onreadystatechange = function() {
    param.readyStateChange && param.readyStateChange(this.readyState, this.status);
  }
  xhr.open(param.method,param.url,param.async);
  // 防止响应超时
  // var timeout = setTimeout(()=>{
  //   xhr.abort();
  // },60*1000);
  if (param.method.toLowerCase()==='post') {
    xhr.send(param.data);
  } else {
    xhr.send(null);
  }
  return xhr;
}

const createXHR = () => {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if(window.ActiveXObject) {
    var versions = ['MSXML2.XMLHttp','Microsoft.XMLHTTP'];
    for (var i=0,len=versions.length;i<len;i++) {
      try {
        return new ActiveXObject(version[i]);
        break;
      } catch (e){
      }
    }
  } else {
    throw new Error("xhr not support");
  }
}

export default request;
