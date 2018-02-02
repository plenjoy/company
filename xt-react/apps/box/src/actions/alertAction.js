import { SHOW_ALERT, CLOSED_ALERT } from '../contants/actionTypes';

/**
 * action创建函数, 用于定义创建一个关闭modal的action
 * @param {title} alert弹框的标题
 * @param {content} alert弹框的正文
 * @param {alertType} alert弹框的类型: 成功, 警告, 失败.
 */
export function showAlert(title, content, alertType) {
  return {
    type: SHOW_ALERT,
    title,
    content,
    alertType
  };
}

/**
 * action创建函数, 用于定义创建一个关闭modal的action
 * @param {Number} index待关闭的modal的索引.
 */
export function closeAlert(index) {
  return {
    type: CLOSED_ALERT,
    index
  };
}
