import Immutable from 'immutable';
import { get, merge } from 'lodash';
import {
  elementTypes,
  pageTypes,
  dragTypes,
  defaultFrameOptions
} from '../../../constants/strings';
import Element from '../../../utils/entries/element';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { getTransferData } from '../../../../../common/utils/drag';

import { toDownload } from '../canvas/downloadImage';

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

    if (
      page.get('type') === pageTypes.page ||
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front
    ) {
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

const convertElement = (that, currentPage, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
    ratio,
    elements,
    paginationSpread,
    pagination,
    parameters,
    settings
  } = data;
  const { width, height } = curElement;

  const whRatio = curElement.width / curElement.height;
  const frameSize = calcDefaultFrameSize(currentPage, whRatio);
  const eWidth = frameSize.width;
  const eHeight = frameSize.height;

  const step = 80;
  const viewEleWidth = eWidth * ratio.workspace;
  const viewEleHeight = eHeight * ratio.workspace;
  const viewConWidth = currentPage.get('width') * ratio.workspace;
  const viewConHeight = currentPage.get('height') * ratio.workspace;
  const containerProps = document.querySelector('.spreads-list .inner-sheet')
    ? getOffset(document.querySelector('.spreads-list .inner-sheet'))
    : getOffset(document.querySelector('.spreads-list .cover-sheet'));

  // 计算鼠标放开位置的真实坐标
  let viewX = x - containerProps.left;
  let viewY = y - containerProps.top;
  let xStep = index * step;
  let yStep = index * step;

  const leftPage = paginationSpread.getIn(['pages', 0]);
  const innerPageBleed = parameters.get('pageBleed');
  const leftPageWidth =
    (leftPage.get('width') -
      innerPageBleed.get('left') -
      innerPageBleed.get('right')) *
    ratio.workspace;

  // 如果不在当前选中page区域内，不添加元素
  if (pagination.pageIndex >= 1) {
    // 如果为右页，减去左页的宽度
    viewX -= leftPageWidth;
  }

  // 区域检测
  if (viewX <= 0) {
    viewX = 0;
  }
  if (viewY <= 0) {
    viewY = 0;
  }
  if (viewX >= viewConWidth - viewEleWidth) {
    viewX = viewConWidth - viewEleWidth;
    xStep -= 2 * step;
  }
  if (viewY >= viewConHeight - viewEleHeight) {
    viewY = viewConHeight - viewEleHeight;
    yStep -= 2 * step;
  }

  const ex = viewX / ratio.workspace + xStep;
  const ey = viewY / ratio.workspace + yStep;
  const defaultPosition = { x: ex, y: ey };

  const options = getCropOptions(
    width,
    height,
    eWidth * ratio.workspace,
    eHeight * ratio.workspace,
    0
  );
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const maxDepElement = elements.maxBy((item) => {
    return item.get('dep');
  });

  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1 + index;
  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    // 应用border.
    const { calendarSetting } = settings;
    const border = calendarSetting.border;

    newPhotoElement = new Element({
      type: elementTypes.photo,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      dep,
      // 应用border.
      border,
      px: null,
      py: null,
      pw: null,
      ph: null
    });
  } else if (curElement.type === elementTypes.sticker) {
    newPhotoElement = {
      type: elementTypes.decoration,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      decorationid: curElement.guid,
      decorationtype: elementTypes.sticker,
      rot: 0,
      dep
    };
  }
  return Object.assign({}, newPhotoElement);
};

const addElements = (that, elements, x, y) => {
  const { data } = that.props;
  const { pagination, paginationSpread } = data;

  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find((page) => {
    return page.get('id') === currentPageId;
  });
  const newElements = [];
  elements.map((curElement, index) => {
    newElements.push(
      convertElement(that, currentPage, curElement, index, x, y)
    );
  });

  return newElements;
};

// drag and add elements
const addElement = (that, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const { settings, pagination, paginationSpread } = data;
  const { boundProjectActions } = actions;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find((page) => {
    return page.get('id') === currentPageId;
  });
  const newPhotoElement = convertElement(
    that,
    currentPage,
    curElement,
    0,
    x,
    y
  );

  return boundProjectActions.createElement(newPhotoElement);
};

/**
 * 切换当前的page为工作目录.
 * @param  {object} that BookPage的this指向
 */
export const switchPage = (that, e, callback) => {
  const { actions, data } = that.props;
  const { boundPaginationActions } = actions;
  const { page, index, pagination } = data;

  if (
    boundPaginationActions &&
    page &&
    page.get('enabled') &&
    pagination.pageId !== page.get('id')
  ) {
    boundPaginationActions.switchPage(index, page.get('id')).then(() => {
      callback && callback();
    });
  }
};

export const activePage = (that) => {
  const { actions, data } = that.props;
  const { page } = data;

  actions.activePage(page.get('id'));
};

function convertElements(that, nextProps, ratio) {
  let outList = Immutable.List();
  const props = nextProps || that.props;
  const { data } = props;
  const { elementArray } = that.state;
  const elements = data.page.get('elements');
  const { settings } = data;

  elements.forEach((element) => {
    const computed = that.computedElementOptions(props, element, ratio, settings);

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

    outList = outList.push(element.merge({ computed }, extraProps));
  });

  return outList;
}

export const componentWillMount = (that) => {
  const { page, ratio, paginationSpread, size } = that.props.data;
  that.setState({
    elementArray: convertElements(that, that.props, ratio.workspace)
  });
};

export const componentWillReceiveProps = (that, nextProps) => {
  const oldData = that.props.data;
  const newData = nextProps.data;

  const oldPaginationSpread = oldData.paginationSpread;
  const newPaginationSpread = newData.paginationSpread;


  const oldPage = oldData.page;
  const page = newData.page;

  const oldElements = oldPage.get('elements');
  const newElements = page.get('elements');

  const oldRatio = oldData.ratio.workspace;
  const newRatio = newData.ratio.workspace;

  const oldPageId = oldData.pagination.pageId;
  const newPageId = newData.pagination.pageId;

  const oldActivePageId = oldData.activePageId;
  const newActivePageId = newData.activePageId;

  if (!Immutable.is(oldElements, newElements) ||
      oldRatio !== newRatio ||
      !Immutable.is(oldPaginationSpread, newPaginationSpread)) {
    const newElementArray = convertElements(that, nextProps, newRatio);
    that.setState({
      elementArray: newElementArray
    });

    toDownload(that, newElementArray);
  }

  // if (oldElements.size !== newElements.size && that.elementControlsNode) {
  //   that.elementControlsNode.needRedrawElementControlsRect();
  // }

  // 切换page时，取消其他page所有已选择的状态
  if (oldPageId !== newPageId || oldActivePageId !== newActivePageId) {
    const newElementArray = convertElements(that, nextProps, newRatio);
    that.setState(
      {
        elementArray: newElementArray.map((element) => {
          return element.set('isSelected', false);
        })
      },
      () => {
        toDownload(that);
      }
    );
  }
};

export const onPageDragOver = (that, e) => {
  that.setState({
    isDragOver: true
  });
  stopEvent(e);
};

export const onPageDragMove = (that, e) => {
  that.setState({
    isDragOver: true
  });
  stopEvent(e);
};

export const onPageDragLeave = (that, e) => {
  that.setState({
    isDragOver: false
  });
  stopEvent(e);
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
    elements
  } = data;
  const x = event.pageX;
  const y = event.pageY;
  let elementsProps;
  elementsProps = getTransferData(event);

  if (!elementsProps) {
    return;
  }

  const index = pagination.pageIndex === 1 ? 0 : 1;
  if (elementsProps.length) {
    // 判断鼠标释放时所在的page是否是当前活动的page
    // 如果不是, 就先切换到鼠标释放时所在的page.
    if (page && pagination.pageId !== page.get('id')) {
      // spine上不支持接受拖拽事件.
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          const addedElements = addElements(that, elementsProps, x, y);
          that.doAutoLayout(addedElements);
        });
      }
    } else {
      const addedElements = addElements(that, elementsProps, x, y);
      that.doAutoLayout(addedElements);
    }
  } else if (elementsProps.type === elementTypes.sticker) {
    if (page && pagination.pageId !== page.get('id')) {
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          addElement(that, elementsProps, 0, x, y);
        });
      }
    } else {
      addElement(that, elementsProps, 0, x, y);
    }
  } else if (elementsProps.type === dragTypes.template) {
    if (page && pagination.pageId !== page.get('id')) {
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          const { guid } = elementsProps;
          that.applyTemplate(guid);
        });
      }
    } else {
      const { guid } = elementsProps;
      that.applyTemplate(guid);
    }
  }

  that.setState({
    isDragOver: false
  });
  stopEvent(event);
};


export const changeCurrentElement = (that, currentPointPhotoElementId) => {
  that.setState({
    currentPointPhotoElementId
  });
};
