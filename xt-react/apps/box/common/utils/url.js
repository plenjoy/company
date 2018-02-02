import { forIn, get } from 'lodash';

/**
 * 根据base url, 接口地址和query string, 生成一个新的url地址.
 * @param {string} base 根路径
 * @param {string} api 接口地址
 * @param {object} qs query string
 * @returns {string} 生成一个新的url地址
 */
export const combine = (base, api, qs) => {
  if (!base || !api) {
    return '';
  }
  let aBase = base;
  if (aBase.endsWith('/')) {
    aBase = aBase.slice(0, aBase.length - 1);
  }

  let params = [];
  if (qs) {
    forIn(qs, (v, k) => {
      params.push(`${k}=${v}`);
    });
  }

  return `${aBase}/${api}?${params.join('&')}`;
};

/**
 * 从object中获取指定key的value.
 * @param obj
 * @param path
 * @returns {*|string}
 */
export const getUrl = (obj, path) => {
  return get(obj, path) || '';
};

/**
 * 从url中获取参数值
 * @param  name
 * @return {string}
 */
export const getUrlParam = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
};
