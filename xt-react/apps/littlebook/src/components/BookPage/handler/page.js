import Immutable from 'immutable';
import { get, merge } from 'lodash';
import { elementTypes, pageTypes, defaultFrameOptions, dragTypes } from '../../../contants/strings';
import { getTransferData } from '../../../../../common/utils/drag';
import { createPhotoElement } from '../../../utils/elementHelper';
import { computedSizeWithoutSpineExpanding } from '../../../utils/sizeCalculator';
import { convertElementsGuideLines, covertStaticGuideLines } from './guideLines';

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const getOffset = (el) => {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

/**
 * 计算添加的图片框和文本框, painted text的大小.
 * @param  {[type]} page [description]
 * @param  {number} whRatio 宽高比.
 * @return {[type]}      [description]
 */
const calcDefaultFrameSize = (page, whRatio = 2) => {
  let width = 0;
  let height = 0;

  if (page) {
    const pageWidth = page.get('width');

    // 框的宽与page的宽的比.
    let wRatio = defaultFrameOptions.default.value;

    if (page.get('type') === pageTypes.page ||
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front) {
      wRatio = defaultFrameOptions.ps.value;
    }

    width = pageWidth * wRatio;
    height = width / whRatio;

    if (whRatio < 1) {
      height = width;
      width = height * whRatio;
    }
  }

  return {
    width,
    height
  };
};

const convertDragElement = (that, currentPage, curElement, index, x, y) => {
  const { data } = that.props;
  const {
    ratio,
    userId
  } = data;

  const eWidth = currentPage.get('width') / 2;

  const containerProps = document.querySelector('.inner-sheet')
    ? getOffset(document.querySelector('.inner-sheet'))
    : getOffset(document.querySelector('.cover-sheet'));

  // 计算鼠标放开位置的真实坐标
  const viewX = x - containerProps.left;

  // 判断鼠标释放点是在左侧还是右侧.
  const isDropInLeft = viewX < eWidth * ratio.workspace || viewX === eWidth * ratio.workspace;

  // 判断要添加在左侧还是右侧.
  let isLeft = true;
  if (isDropInLeft) {
    isLeft = !index;
  } else {
    isLeft = !!index;
  }

  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    newPhotoElement = createPhotoElement(currentPage, curElement, userId, isLeft);
  }

  return newPhotoElement;
};

const addElements = (that, elements, x, y) => {
  const { data, actions } = that.props;
  const {
    settings,
    pagination,
    paginationSpread,
  } = data;
  const { boundProjectActions } = actions;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find((page) => {
    return page.get('id') === currentPageId;
  });
  const newElements = [];
  elements.map((curElement, index) => {
    if (index <= 1) {
      newElements.push(convertDragElement(that, currentPage, curElement, index, x, y));
    }
  });

  return boundProjectActions.createElements(currentPageId, newElements);
};

// drag and add elements
const addElement = (that, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
    settings,
    pagination,
    paginationSpread,
  } = data;
  const { boundProjectActions } = actions;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find((page) => {
    return page.get('id') === currentPageId;
  });
  const newPhotoElement = convertDragElement(that, currentPage, curElement, 0, x, y);

  return boundProjectActions.createElement(currentPageId, newPhotoElement);
};

/**
 * 切换当前的page为工作目录.
 * @param  {object} that BookPage的this指向
 */
export const switchPage = (that, e, callback) => {
  const { actions, data } = that.props;
  const { boundPaginationActions } = actions;
  const { page, index, pagination, elements } = data;
  const event = e || window.event;
  // event.stopPropagation();

  if (page && pagination.pageId !== page.get('id') && page.get('type') !== pageTypes.spine) {
    boundPaginationActions.switchPage(index, page.get('id')).then(() => {
      callback && callback();
    });
  }
};

function convertElements(that, nextProps, elements, ratio) {
  let outList = Immutable.List();
  const props = nextProps || that.props;
  const { elementArray } = that.state;

  elements.forEach((element) => {
    const computed = that.computedElementOptions(props, element, ratio);

    const stateElement = elementArray.find((o) => {
      return o.get('id') === element.get('id');
    });

    const extraProps = {
      isDisabled: false,
      isSelected: false
    };

    if (stateElement) {
      extraProps.isDisabled = stateElement.get('isDisabled');
      extraProps.isSelected = stateElement.get('isSelected');
    }

    outList = outList.push(
      element.merge({ computed }, extraProps)
    );
  });

  return outList;
}

export const componentWillMount = (that) => {
  const { elements, page, ratio, paginationSpread, size } = that.props.data;
  const staticGuideLines = covertStaticGuideLines(that, page, ratio, paginationSpread, size);
  that.setState({
    elementArray: convertElements(that, that.props, elements, ratio.workspace),
    staticGuideLines
  });
};


export const componentWillReceiveProps = (that, nextProps) => {
  const oldData = that.props.data;
  const newData = nextProps.data;

  const oldElements = oldData.elements;
  const newElements = newData.elements;

  const oldRatio = oldData.ratio.workspace;
  const newRatio = newData.ratio.workspace;

  const oldPageId = oldData.pagination.pageId;
  const newPageId = newData.pagination.pageId;

  const oldPage = oldData.page;
  const page = newData.page;

  const oldUndoData = that.props.data.undoData;
  const newUndoData = nextProps.data.undoData;

  if (!Immutable.is(oldElements, newElements) || oldRatio !== newRatio) {
    const newElementArray = convertElements(that, nextProps, newElements, newRatio);
    const dynamicGuideLines = convertElementsGuideLines(that, page, newElementArray, newRatio);
    that.setState({
      elementArray: newElementArray,
      dynamicGuideLines
    });
  }

  if (oldRatio !== newRatio) {
    // FIXME: 需要知道render材质后的时机
    clearTimeout(that.updateOffsetTimer);
    that.updateOffsetTimer = setTimeout(() => {
      that.updateOffset();
      that.setState({
        isRatioChanged: true
      });
    }, 1200);
  }

  // 切换page时，取消其他page所有已选择的状态
  if (oldPageId !== newPageId && page.get('id') !== newPageId) {
    const dynamicGuideLines = convertElementsGuideLines(that, page, newElements);
    const { elementArray } = that.state;
    that.setState({
      elementArray: elementArray.map((element) => {
        return element.set('isSelected', false);
      }),
      dynamicGuideLines
    });
  }
};

export const onPageDragOver = (that, e) => {
  stopEvent(e);
};

export const onPageDragEnter = (that, e) => {
  const { data } = that.props;
  const {
    page,
    summary
  } = data;

  const isCover = summary.get('isCover');

  // 如果当前页不支持拖拽释放，则返回
  if (!page.get('enabled') || isCover) {
    return false;
  }
  that.setState({
    isHover: true
  });
};

export const onPageDragLeave = (that, e) => {
  that.setState({
    isHover: false
  });
};

export const onPageDragEnd = (that, e) => {
  that.setState({
    isHover: false
  });
};

export const onPageDroped = (that, e) => {
  const event = e || window.event;
  const { data, actions } = that.props;
  const {
    ratio,
    paginationSpread,
    pagination,
    parameters,
    page,
    summary
  } = data;

  // 如果当前页不支持拖拽释放，则返回
  if (!page.get('enabled')) {
    return false;
  }
  const isCover = summary.get('isCover');

  const x = event.pageX;
  const y = event.pageY;
  let elementsProps;
  elementsProps = getTransferData(event);

  const index = pagination.pageIndex === 1 ? 0 : 1;
  if (elementsProps.length && !isCover) {
    // 判断鼠标释放时所在的page是否是当前活动的page
    // 如果不是, 就先切换到鼠标释放时所在的page.
    if (page && pagination.pageId !== page.get('id')) {
      // spine上不支持接受拖拽事件.
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          addElements(that, elementsProps, x, y);
        });
      }
    } else {
      addElements(that, elementsProps, x, y);
    }
  }

  that.setState({
    isHover: false
  });
  stopEvent(event);
};


