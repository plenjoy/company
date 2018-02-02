import { forIn, merge } from 'lodash';
import qs from 'qs';

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

  const params = [];
  if (qs) {
    forIn(qs, (v, k) => {
      params.push(`${k}=${v}`);
    });
  }

  return api
    ? `${base}/${api}?${params.join('&')}`
    : `${base}?${params.join('&')}`;
}

export function getQueryStingObj() {
  const o = {
    // 从my projects过来时, 会传递这些参数.
    initGuid: -1,
    webClientId: 1,

    // 新建book时, 会使用这些参数.
    product: '',
    cover: '',
    leatherColor: '',
    size: '',
    paper: '',
    paperThickness: '',
    title: ''
  };

  const obj = qs.parse(window.location.search.substr(1));

  // 获取project id.
  if (typeof obj.mainProjectUid === 'string' && !isNaN(obj.mainProjectUid)) {
    obj.initGuid = parseInt(obj.mainProjectUid);
  }

  return merge({}, o, obj);
}
