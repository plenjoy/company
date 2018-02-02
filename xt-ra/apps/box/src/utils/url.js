import { forIn } from 'lodash';

/**
 * 根据base url, 接口地址和query string, 生成一个新的url地址.
 * @param {string} base 根路径
 * @param {string} api 接口地址
 * @param {object} qs query string
 * @returns {string} 生成一个新的url地址
 */
export function combine(base, api, qs) {
  if (!base) {
    return '';
  }

  let params = [];
  if (qs) {
    forIn(qs, (v, k) => {
      params.push(`${k}=${v}`);
    });
  }

  return api ? `${base}/${api}?${params.join('&')}`
             : `${base}?${params.join('&')}`;
}
