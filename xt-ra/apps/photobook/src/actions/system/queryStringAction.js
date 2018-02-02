import qs from 'qs';
import { PARSER_QUERYSTRING } from '../../contants/actionTypes';

/**
 * action创建函数, 用于定义创建一个关闭modal的action
 * @param {title} alert弹框的标题
 * @param {content} alert弹框的正文
 * @param {alertType} alert弹框的类型: 成功, 警告, 失败.
 */
export function parser() {
  const value = qs.parse(window.location.search.substr(1));

  return {
    type: PARSER_QUERYSTRING,
    value
  };
}
