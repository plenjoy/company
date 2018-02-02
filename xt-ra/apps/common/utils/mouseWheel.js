/**
 * 阻止事件冒泡的方法
 */
export const stopPropagation = (event) => {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};

/**
 * 处理mousewheel的返回值 -1 向上 1 向下
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
const parseWheelData = (event) => {
  return event.wheelDelta ? -event.wheelDelta / 120 : event.detail / 3;
};

/**
 * 添加鼠标滚轮事件
 * @param  {[type]} node    [description]
 * @param  {[type]} handler [description]
 * @return {[type]}         [description]
 */
export const addMouseWheelEvent = (node, handler, shouldStopPropagation = false) => {
  node.addEventListener('mousewheel', (event) => {
    if (shouldStopPropagation) {
      stopPropagation(event);
    }
    handler(parseWheelData(event));
  }, false);
  node.addEventListener('DOMMouseScroll', (event) => {
    if (shouldStopPropagation) {
      stopPropagation(event);
    }
    handler(parseWheelData(event));
  }, false);
};

