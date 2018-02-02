import request from './ajax';
import CancelablePromise from './cancelablePromise';
import { createImageFormData } from './uploadHelper';
import PromisePool from './promisePool';
import { isFunction, merge, get } from 'lodash';
import { guid } from './math';
import { uploadStatus } from './strings';
import { isAcceptFile } from './uploadFileCheck';
import x2jsInstance from './xml2js';
import { convertObjIn } from './typeConverter';

class UploadPool {
  constructor(chunks = 4) {
    // 请求的总数量
    this.count = 0;

    // 完成的数量
    this.countOfCompleted = 0;

    // 失败的数量
    this.countOfFailed = 0;

    // 正在进行数量
    this.countOfProgress = 0;

    // 等待上传数量
    this.countOfPending = 0;

    // 上传成功的文件列表.
    this.completedFiles = [];

    // 上传失败的文件列表.
    this.failedFiles = [];

    // 全部上传完成, 所花费的时间(s).
    this.cost = 0;

    // 私有变量.
    // 存放待上传的所有文件.
    this.pendingPools = [];

    // 存放上传失败的所有文件.
    this.failedPools = [];

    // 控制并发.
    // this.chunks = chunks;
    // this.executingPools = [];
    this.instance = new PromisePool(chunks);

    // 公共方法.
    this.push = this.push.bind(this);
    this.execute = this.execute.bind(this);
    this.remove = this.remove.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.abort = this.abort.bind(this);
    this.abortAll = this.abortAll.bind(this);
    this.retry = this.retry.bind(this);
    this.retryAll = this.retryAll.bind(this);
    this.reset = this.reset.bind(this);
    this.checkIsAllCompleted = this.checkIsAllCompleted.bind(this);

    // 通过id, 查找reducer
    this.find = this.find.bind(this);
  }

  updateCountStatus({
    count = 0,
    completed = 0,
    failed = 0,
    progress = 0,
    pending = 0
  }, isAssigned = false) {
    // 请求的总数量
    this.count += count;

    // 完成的数量
    this.countOfCompleted += completed;

    // 失败的数量
    this.countOfFailed += failed;

    // 正在进行数量
    this.countOfProgress += progress;

    // 等待上传数量
    this.countOfPending += pending;

    // 强制赋值.
    if(isAssigned){
      this.count = count;
      this.countOfCompleted = completed;
      this.countOfFailed = failed;
      this.countOfProgress = progress;
      this.countOfPending = pending;
    }
  }

  checkIsAllCompleted(){
    // 如果正在上传的数量为0, 那么表示全部都上传完成.
    return !this.countOfProgress;
  }

  updateReducerOptions(id, options){
    const obj = {};

    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        obj[key] = options[key];
      }
    }

    let index = this.pendingPools.findIndex(r => r.id === id);
    if(index !== -1){
      merge(this.pendingPools[index], obj);
    }else {
      index = this.failedPools.findIndex(r => r.id === id);

      if(index!== -1){
        merge(this.failedPools[index], obj);
      }
    }
  }

  onSuccess(id, res, file) {
    this.updateCountStatus({
      completed: 1,
      progress: -1
    });

    if(file){
      this.completedFiles.push(file);
    }

    this.removePendingsById(id);
    this.checkIsAllCompleted();
  }

  onProgress(id, data) {}

  onError(id, err, file) {
    this.updateCountStatus({
      failed: 1,
      progress: -1
    });

    const reducer = this.removePendingsById(id);
    if (reducer) {
      reducer.executing = false;
      this.failedPools.push(reducer);
    }

    this.failedFiles.push(file);
    this.checkIsAllCompleted();
  }

  // 创建用于文件上传的request对象, 返回.
  createRequestPromise({ url, data, success, progress, error, authData, isFormData = false }) {
    const id = guid();
    const xhr = new XMLHttpRequest();

    const executor = () => {
      const promise = new CancelablePromise((resolve, reject) => {
        this.updateCountStatus({
          progress: 1,
          pending: -1
        });

        const formData = isFormData ? createImageFormData(data) : data;
        const startTime = Date.now();

        // 完成的百分比.
        let completedPercent = 0;

        request({
          url,
          method: 'post',
          data: formData,
          setHead: !isFormData,
          success: (res, options) => {
            const endTime = Date.now();
            const cost = endTime - startTime;

            // 更新总的上传时间.
            this.cost += cost;

            const resObj = x2jsInstance.xml2js(res);

            // 成功.
            if(options.status === 200){
              const opt = {
                percent: 100,
                status: uploadStatus.DONE,
                cost,
                errorText: ''
              };

              const newRes = convertObjIn(merge({}, resObj, opt));

              this.updateReducerOptions(id, opt);
              this.onSuccess(id, newRes, data.filename || authData);

              if (isFunction(success)) {
                success(newRes);
              }

              resolve(newRes);
            } else {
              // 失败的情况.
              const opt = {
                isAccept: false,
                percent: 0,
                status: uploadStatus.FAIL,
                cost,
                errorText: get(resObj, 'resultData.errorInfo') || 'An unexpected error occurred. Try again'
              };
              const newRes = convertObjIn(merge({}, resObj, opt));

              this.updateReducerOptions(id, opt);
              this.onError(id, newRes, data.filename);

              if (isFunction(error)) {
                error(newRes);
              }

              reject(newRes);
            }
          },
          progress: (res) => {
            const endTime = Date.now();
            const cost = endTime - startTime

            const percent = this.computedProgress(res, completedPercent);
            completedPercent = percent;

            const opt = {
              percent,
              status: uploadStatus.PROGRESS,
              cost,
              errorText: ''
            };
            const newRes = convertObjIn(merge({}, res, opt));

            this.updateReducerOptions(id, opt);
            this.onProgress(id, newRes);

            if (isFunction(progress)) {
              progress(newRes);
            }

            // 无需等待后端的切图, 直接开启下一个上传.
            if(percent === 100){
              resolve(newRes);
            }
          },
          error: (err, options) => {
            const endTime = Date.now();
            const cost = endTime - startTime;

            // 更新总的上传时间.
            this.cost += cost;

            const opt = {
              percent: 0,
              status: uploadStatus.FAIL,
              cost,
              errorText: options.statusText || 'An unexpected error occurred. Try again'
            };
            const newRes = convertObjIn(merge({}, err, opt));

            this.updateReducerOptions(id, opt);
            this.onError(id, newRes, data.filename);

            if (isFunction(error)) {
              error(newRes);
            }

            reject(newRes);
          }
        }, xhr);
      });

      return promise;
    };

    return {
      xhr,
      id,
      executor,
      file: data.filename,
      isAccept: true,
      retryCount: 0,
      status: uploadStatus.PENDING,
      cost: 0,
      errorText: ''
    };
  }

  /**
   * 把要上传的文件添加到上传池中
   * @param  {Object} dataObj : { url, data, success, progress, error }
   * @return {Object}         { promise, xhr, id }
   */
  push(dataObj) {
    const file = get(dataObj, 'data.filename');

    // 如果file有值, 表示上传的是本地文件. 对文件做基本检测
    if(file){
      // { isAccept, translateKey, errorText }
      const verified = isAcceptFile(file);

      if(!verified.isAccept){
        // 更新失败的数量
        this.updateCountStatus({
          failed: 1
        });

        return merge({}, verified, {
          percent: 0,
          status: uploadStatus.FAIL,
          cost: 0,
          retryCount: 0
        });
      }
    }

    // 如果代码执行到这里, 表示file是符合要求的.
    this.updateCountStatus({
      count: 1,
      pending: 1
    });

    const newReducer = this.createRequestPromise(dataObj);
    this.pendingPools.push(newReducer);

    // 执行上传操作.
    this.execute();

    return newReducer;
  }

  /**
   * 计算完成的百分比.
   * @param  {Object} data             progressEvent
   * @param  {Number} completedPercent 上次已经完成的百分比. 用于设置一个假的进度条.
   * @return {Number}
   */
  computedProgress(progressEvent, completedPercent = 0) {
    const { loaded, total, lengthComputable } = progressEvent;

    let percent = 0;

    if(lengthComputable){
      if(!isNaN(loaded) && !isNaN(loaded)){
        percent = Math.round(loaded / total * 100);
      }
    } else {
      // 设置一个假的进度条
      percent = completedPercent + Math.round(Math.random() * (100-completedPercent));
    }

    return percent;
  }

  removePendingsById(id) {
    let reducer;
    const index = this.pendingPools.findIndex(m => m.id === id);

    if (index !== -1) {
      reducer = this.pendingPools[index];
      this.pendingPools.splice(index, 1);
    }

    return reducer;
  }

  removeFailedById(id) {
    let reducer;
    const index = this.failedPools.findIndex(m => m.id === id);

    if (index !== -1) {
      reducer = this.failedPools[index];
      this.failedPools.splice(index, 1);
    }

    return reducer;
  }

  // 开始上传文件.
  async execute() {
    this.pendingPools.forEach((r, i) => {
      if(!r.executing){
        this.pendingPools[i].executing = true;

        this.instance.loadPromiseProducer(() => {
          return r.executor().catch(err => {
            log(err);
          })
        }, r.id);
      }
    });
  }

  // 删除指定的promise
  remove(reducer) {
    const { id } = reducer;

    const count = -1;
    let progress = 0;
    let failed = 0;
    let pending = 0;

  	// 从队列中移除未开始的项.
  	this.instance.remove(reducer);

    // remove时, 该请求可能在pending或failed中额任何一种状态.
    let r = this.removePendingsById(id);
    if(r){
      // 如果x.xhr存在, 表示当前的request正在上传.
      if (r.xhr) {
        progress = -1;
      } else {
        pending = -1;
      }
    } else {
      r = this.removeFailedById(id);
      if(r){
        failed = -1;
      }
    }

    if (r) {
      // 取消xhr的上传逻辑和promise的处理流程.
      if (r.xhr) {
        r.xhr.abort();
      }
    }

    this.updateCountStatus({ count, progress, failed, pending });
  }

  // 删除全部promise
  removeAll() {
    const pools = this.pendingPools.concat(this.failedPools);
    const ids = pools.map(r => r.id);

    // this.pendingPools, this.failedPools： 在remove的方法内部会做删除操作.
    // 为了保证remove的准确性. 使用一个新的ids变量来循环.
    ids.forEach(id => {
      const r = pools.find( r => r.id == id);
      r && this.remove(r);
    });

    // 从队列中移除所有的项
    this.instance.removeAll();

    this.updateCountStatus({
      count: 0,
      completed: 0,
      progress: 0,
      failed: 0,
      pending: 0
    }, true);
  }

  // 终止指定的promise
  abort(reducer) {
    const r = this.removePendingsById(reducer.id);

    if (r && r.xhr) {
      r.xhr.abort();
      r.promise.cancel();
    }

    this.updateCountStatus({
      progress: -1,
      failed: 1
    });
  }

  // 终止全部promise
  abortAll() {
    const progressPools = this.pendingPools.filter(r => !!r.xhr);
    progressPools.forEach(r => this.abort(r));
  }

  // 重试指定的promise
  retry(reducer) {
    const r = this.removeFailedById(reducer.id);

    if (r) {
      this.pendingPools.push(merge({}, r, {
        executing: false,
        retryCount: r.retryCount + 1
      }));

      this.updateCountStatus({
        failed: -1,
        pending: 1
      });

      this.execute();
    }
  }

  // 重试全部失败的promise
  retryAll() {
    this.failedPools.forEach(r => this.retry(r));
  }

  // 重置实例
  reset() {
    this.removeAll();

    this.cost = 0;
    this.completedFiles = [];
    this.failedFiles = [];
  }

  find(v){
    const toFind = (arr) => {
      return arr.find(r => {
        if(isFunction(v)){
          return v(r);
        }

        // 默认通过id查找.
        return r.id === v;
      });
    };

    let reducer = toFind(this.pendingPools);
    if(!reducer){
      reducer = toFind(this.failedPools);
    }

    return reducer;
  }
}

let instance = null;
window.initUploadPool = (chunks = 4) => {
  if (!instance) {
    instance = new UploadPool(chunks);
  }

  return instance;
};

export default UploadPool;
