import Immutable from 'immutable';
import ReactDOM from 'react-dom';
import { querySelectorAll } from 'dom-helpers/query';
import {
  elementTypes,
  pageTypes,
  dragPageSelector
} from '../../../contants/strings';
import Element from '../../../utils/entries/element';
import {
  setTransferDragNode,
  setTransferData,
  getTransferData,
  cloneDragNode
} from '../../../../../common/utils/drag';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { bookShapeTypes } from '../../../contants/strings';

export const getRefName = (sheetIndex, pageIndex) => {
  return `BookPageThumbnail-${sheetIndex}-${pageIndex}`;
};

/**
 * 计算渲染内页page容器(包括两个容器: 一个是不加出血的, 另一个加上出血,)的宽高和坐标.
 * - 不加出血的容器, 是为了隐藏出血部分的渲染, 因为在我们的效果图中, 看到的样子就是客户最终拿到手的产品的样子.
 * - 加上出血的容器, 是为了给page的元素做定位.
 */
export const computedInnerSheet = (
  workspaceRatio,
  size,
  pages,
  pageIndex,
  bookShape = bookShapeTypes.square
) => {
  let renderInnerSheetSize = {
    width: size.renderInnerSheetSize.width,
    height: size.renderInnerSheetSize.height,
    top: 0,
    left: 0
  };

  // 修复颜色线.
  const offset = { width: 0, height: 0, top: 0, left: 0 };

  if (bookShape === bookShapeTypes.portrait) {
    offset.height = 1;
  }

  if (size.renderInnerSheetSizeWithoutBleed.height > 300) {
    offset.width = 3;
  } else if (size.renderInnerSheetSizeWithoutBleed.height > 80) {
    offset.width = 2;
  }

  let renderInnerSheetSizeWithoutBleed = {
    width: size.renderInnerSheetSizeWithoutBleed.width + offset.width,
    height: size.renderInnerSheetSizeWithoutBleed.height + offset.height,
    top: offset.top,
    left: offset.left
  };

  // 获取当前的page.
  const page = pages.get(pageIndex);

  // 判断当前的page是不是page,
  if (page.get('type') === pageTypes.page) {
    // 当前, 一个sheet之多有两个page
    if (pages.size > 1) {
      // 如果是第一个page
      if (pageIndex === 0) {
        // 包含出血,
        // 第一个page, 还要把page的右出血加上因为在selector上计算renderInnerSheetSize时, 把右出血给去除了.
        renderInnerSheetSize = {
          width:
            size.renderInnerSheetSize.width / 2 +
            page.getIn(['bleed', 'right']) * workspaceRatio,
          height: size.renderInnerSheetSize.height,
          top: 0,
          left: 0
        };

        // 不含出血
        renderInnerSheetSizeWithoutBleed = {
          width: size.renderInnerSheetSizeWithoutBleed.width / 2,
          height: size.renderInnerSheetSizeWithoutBleed.height,
          top: 0,
          left: 0
        };
      } else if (pageIndex === 1) {
        // 包含出血,
        // 第二个page, 还要把page的右出血加上因为在selector上计算renderInnerSheetSize时, 把左出血给去除了.
        renderInnerSheetSize = {
          width:
            size.renderInnerSheetSize.width / 2 +
            page.getIn(['bleed', 'left']) * workspaceRatio,
          height: size.renderInnerSheetSize.height,
          top: 0,
          left: 0 // -page.getIn(['bleed', 'left']) * workspaceRatio
        };

        // 不含出血
        renderInnerSheetSizeWithoutBleed = {
          width: size.renderInnerSheetSizeWithoutBleed.width / 2 + offset.width,
          height: size.renderInnerSheetSizeWithoutBleed.height + offset.height,
          top: offset.top,
          left: size.renderInnerSheetSizeWithoutBleed.width / 2 + offset.left
        };
      }
    }
  }

  return {
    renderInnerSheetSize,
    renderInnerSheetSizeWithoutBleed
  };
};

export const stopEvent = event => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

/**
 * 拖拽元素开始拖动前触发.
 * @param  {[type]} that [description]
 * @param  {[type]} page [description]
 */
export const onDragPageStarted = (that, page, ref, event) => {
  const ev = event || window.event;

  // 获取用于拖拽时的缩略图的节点. 默认的缩略图会截取指定节点所在区域的所有内容.
  // 其中有写不在其节点下的内容也会被截取下来, 这是不合要求, 我们的做法是先clone一个新的
  // 节点, 然后把新节点的位置移到视口外, 并把该节点设为缩略图.
  // const nodes = querySelectorAll(ev.target, dragPageSelector.targetPage);
  const node = ReactDOM.findDOMNode(that.refs[ref]);
  const dragNode = cloneDragNode(node, dragPageSelector.clonedPage);

  setTransferDragNode(ev, dragNode);
  setTransferData(ev, {
    pageId: page.get('id')
  });

  that.setState({ dragPageId: page.get('id') });

  // 是否是拖动page是一个全局的
  window.__isDragPage = true;

  that.props.actions.setMouseHoverDomNode(null);
  that.props.actions.startDragPage();
};

/**
 * 拖拽结束后, 移除临时创建的节点.
 */
export const onDragPageEnd = that => {
  window.__isDragPage = false;

  const dragNode = document.getElementById(dragPageSelector.clonedPage);

  if (dragNode) {
    dragNode.parentNode.removeChild(dragNode);
  }

  delete window.__isDragPage;

  that.setState({
    dropPageId: null,
    dragPageId: null
  });

  that.props.actions.stopDragPage();
};

/**
 * 拖拽到目标元素上, 释放鼠标时触发.
 * @param  {[type]} that       [description]
 * @param  {[type]} targetPage [description]
 * @param  {[type]} event      [description]
 */
export const onDropPage = (that, targetPage, event) => {
  const ev = event || window.event;

  that.setState({
    dropPageId: null,
    dragPageId: null
  });

  // 调用 preventDefault() 来避免浏览器对数据的默认处理
  // （drop 事件的默认行为是以链接形式打开）
  ev.preventDefault();

  const dragData = getTransferData(ev);

  // 拖动的是图片元素
  if (dragData.elementId) return;

  const dragPageId = (dragData && dragData.pageId) || '';
  const dropPageId = targetPage.get('id');

  // 如果拖拽的页面id为空或者拖拽的页面和目标页面的id相同.
  // 就不要做任何事.
  if (!dragPageId || dragPageId === dropPageId) {
    return;
  }

  // 更新store上的page顺序
  const { actions, data } = that.props;
  const {
    boundProjectActions,
    boundPaginationActions,
    boundTrackerActions,
    setMouseHoverDomNode
  } = actions;
  boundProjectActions.movePageBefore(dragPageId, dropPageId);
  boundTrackerActions.addTracker(
    `ArrangePageMoveSheet,${dragPageId},${dropPageId}`
  );

  // ASH-3484: 【H5 Book】Arrange Pages中切换Page，再切换到Edit Page，切换模版无法反应
  const { pagination } = data;
  if (dropPageId === pagination.pageId) {
    boundPaginationActions.switchPage(pagination.pageIndex, dragPageId);
  }

  if (dragPageId === pagination.pageId) {
    boundPaginationActions.switchPage(pagination.pageIndex, dropPageId);
  }

  setMouseHoverDomNode(null);
  that.props.actions.stopDragPage();
};

/**
 * 拖拽元素的鼠标进入目标元素时触发
 * @param  {[type]} that       [description]
 * @param  {[type]} targetPage [description]
 * @param  {[type]} event      [description]
 */
export const onDragOvered = (that, targetPage, event) => {
  if (!window.__isDragPage) return;

  const ev = event || window.event;
  const dropPageId = targetPage.get('id');
  // DragOver事件里, event对象里面没有dataTransfer对象. 这里使用state来传值.
  const dragPageId = that.state.dragPageId;

  if (that.state.dropPageId === dropPageId || dragPageId === dropPageId) {
    return;
  }

  that.setState({
    dropPageId
  });
};

/**
 * 拖拽元素的鼠标离开目标元素时触发
 * @param  {[type]} that       [description]
 * @param  {[type]} targetPage [description]
 * @param  {[type]} event      [description]
 * @return {[type]}            [description]
 */
export const onDragLeaved = (that, targetPage, event) => {
  that.setState({
    dropPageId: null
  });
};

export const onDragPageTitleStarted = (that, sheetIndex, pageIndex, event) => {
  const ev = event || window.event;
  const { data } = that.props;
  const { paginationSpread } = data;
  const pages = paginationSpread.get('pages');

  const refName = getRefName(sheetIndex, pageIndex);

  if (pageIndex !== -1 && pages && pages.size > pageIndex) {
    onDragPageStarted(that, pages.get(pageIndex), refName, ev);
  }
};

export const onDragPageTitleEnd = (that, sheetIndex, pageIndex, event) => {
  onDragPageEnd(that);
};

/**
 * 删除pages.
 * @param  {[type]} that  [description]
 * @param  {[type]} pages [description]
 * @return {[type]}       [description]
 */
export const deletePages = (that, pageIds) => {
  const { actions } = that.props;
  const { onRemovePages, boundTrackerActions } = actions;

  if (!pageIds || pageIds.size < 2) {
    return;
  }

  const leftPageId = pageIds.first();
  const rightPageId = pageIds.last();

  onRemovePages && onRemovePages([leftPageId, rightPageId]);
  boundTrackerActions.addTracker('ArrangePageDeleteSheet');
};

export const onMouseOver = (that, pages, event) => {
  const { data } = that.props;
  const { maxSheetNumber, minSheetNumber, totalSheetNumber } = data;

  // 在这几种情况同时满足时才需要显示删除图标.
  // 1. page是enabled.
  // 2. sheet数量大于最小sheet数.
  const hasDisabledPage = pages && !!pages.find(m => !m.get('enabled'));

  if (!hasDisabledPage && totalSheetNumber > minSheetNumber) {
    that.setState({
      isShowDeleteIcon: true
    });
  }
};

export const onMouseOut = (that, event) => {
  if (that.state.isShowDeleteIcon) {
    that.setState({
      isShowDeleteIcon: false
    });
  }
};

export const onMouseOverInnerSheet = (that, page, event) => {
  that.setState({
    pageHovers: [
      {
        id: page.get('id'),
        value: true
      }
    ]
  });
};

export const onMouseOutInnerSheet = (that, page, event) => {
  that.setState({ pageHovers: [] });
};
