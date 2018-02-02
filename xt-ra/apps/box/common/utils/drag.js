// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

/**
 * 拖拽时, 设置拖拽时的数据.
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const setTransferData = (event, data, key = 'text') => {
  if (!data) {
    return;
  }

  const str = JSON.stringify(data);
  if (event && event.dataTransfer) {
    event.dataTransfer.setData(key, str);
  } else {
    // ie11 dataTransfer不支持，使用节点传值
    document.querySelector('body').setAttribute('data-drag', str);
  }
};

/**
 * 设置拖拽时显示的缩略图.
 * @param  {[type]} event [description]
 * @param  {[type]} node  [description]
 * @return {[type]}       [description]
 */
export const setTransferDragNode = (event, node) => {
  // 如果节点为空, 或节点不是元素节点. 就直接返回.
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  // 如果支持setDragImage.
  if (event.dataTransfer && event.dataTransfer.setDragImage) {
    event.dataTransfer.setDragImage(node, 0, 0);
  } else {
    // 在IE下不支持.
    // TODO.
  }
};

/**
 * 获取拖拽时的数据.
 * @param  {[type]} event [description]
 * @param  {String} key   [description]
 * @return {[type]}       [description]
 */
export const getTransferData = (event, key = 'text') => {
  let data;
  if (event && event.dataTransfer) {
    const str = event.dataTransfer.getData(key);
    data = str ? JSON.parse(str) : {};
  } else {
    //  ie11 dataTransfer不支持，使用节点传值
    const str = document.querySelector('body').getAttribute('data-drag');
    data = str ? JSON.parse(str) : {};
    document.querySelector('body').removeAttribute('data-drag');
  }

  return data;
};

export const cloneDragNode = (originalNode, cloneNodeId) => {
  // 如果节点为空, 或节点不是元素节点. 就直接返回.
  if (!originalNode || originalNode.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const newNode = originalNode.cloneNode(true);

  newNode.setAttribute('id', cloneNodeId);

  // 确保它在视口上看不到.
  newNode.style.position = 'absolute';
  newNode.style.top = '-100000px';

  document.body.appendChild(newNode);

  return newNode;
};
