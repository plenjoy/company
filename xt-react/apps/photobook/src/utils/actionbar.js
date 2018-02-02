import { max } from 'lodash';
// jq 的find方法
const findNodes = (node, nodeName) => {
  const arr = [];
  function done(node) {
    if (node.children.length != 0) {
       const childrenNodes = node.children;
       for (let index = 0; index < childrenNodes.length; index++) {
        if (childrenNodes[index].nodeName == nodeName) {
          arr.push(childrenNodes[index]);
        } else {
          done(childrenNodes[index]);
        }
      }
    }
  }
  done(node);
  return arr;
  };

export const getDropdownNode = (e) => {
  const thisNode = e.target;
  const obj = {};
  let dropdownNodeUlNode = '';
  // 确保能拿到li节点
  let dropdownNodechildNodes = thisNode.parentNode.childNodes;
  if (thisNode.nodeName == 'LI') {
    dropdownNodechildNodes = thisNode.childNodes;
  }
  // 计算图标的高度
  const iconHeight = thisNode.getBoundingClientRect().height;

  for (let i = 0; i < dropdownNodechildNodes.length; i++) {
    if (dropdownNodechildNodes[i].nodeName == 'UL') {
      dropdownNodeUlNode = dropdownNodechildNodes[i];
    }
  }

  const dropdownNodeLiArray = findNodes(dropdownNodeUlNode, 'LI');

   // 计算全部li的高度
  if (dropdownNodeUlNode) {
    obj.ulNode = dropdownNodeUlNode;
    obj.allDropdownHeight = dropdownNodeLiArray.length * iconHeight;
    return obj;
  }
};

export const showActionOnTop = (that) => {
  const windowHeight = window.innerHeight;
  const actionsBarRect = that.componentRef.getBoundingClientRect();
  const allActionBarUl = that.componentRef;
  const dropdownUlArray = [];
  // 递归找到ul下面一级全部的li
  const allActionBarItems = findNodes(allActionBarUl, 'LI');

  for (let i = 0; i < allActionBarItems.length; i++) {
    for (let j = 0; j < allActionBarItems[i].childNodes.length; j++) {
      if (allActionBarItems[i].childNodes[j].nodeName === 'UL') {
        // 找到每个li下面的ul 这个ul就是dropdownUl 由于存在多余的div这里 又使用递归查找
        const dropdownItems = findNodes(allActionBarItems[i].childNodes[j], 'LI');
        dropdownUlArray.push(dropdownItems.length);
      }
    }
  }
  const maxCounts = max(dropdownUlArray);
  // 距底部高度为 action高度陈最多的li个数
  const distance = maxCounts * actionsBarRect.height + 2;

  if ((windowHeight - (actionsBarRect.top + actionsBarRect.height)) < distance) {
    that.setState({
      showActionOnTop: true
    });
  } else {
    that.setState({
      showActionOnTop: false
    });
  }
};
