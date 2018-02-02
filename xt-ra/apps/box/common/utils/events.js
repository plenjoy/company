/**
 * 定义一个空方法.
 */
const noop = () => {
};

/**
 * 给元素添加事件处理函数
 * @param ele 元素节点
 * @param type 事件类型, 默认为click
 * @param handler 事件处理函数.
 */
export const addEventListener = (ele, type = 'click', handler = noop) => {
  if (ele && ele.addEventListener) {
    ele.addEventListener(type, handler);
  }
};

/**
 * 给元素移除事件处理函数
 * @param ele 元素节点
 * @param type 事件类型, 默认为click
 * @param handler 事件处理函数.
 */
export const removeEventListener = (ele, type = 'click', handler = noop)=> {
  if (ele && ele.removeEventListener) {
    ele.removeEventListener(type, handler);
  }
};
