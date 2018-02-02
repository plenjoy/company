import Immutable from 'immutable';
import { get, merge } from 'lodash';
import {
  elementTypes,
  pageTypes,
  dragTypes,
  defaultFrameOptions,
  defaultStickerOptions,
  BACKGROUND_ELEMENT_DEP
} from '../../../contants/strings';
import Element from '../../../utils/entries/element';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { getTransferData } from '../../../../../common/utils/drag';
import {
  convertElementsGuideLines,
  covertStaticGuideLines
} from './guideLines';
import { toDownload } from '../canvas/downloadImage';

export const stopEvent = event => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const getOffset = el => {
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
const calcDefaultFrameSize = (page, whRatio = 2, isSticker = false) => {
  let width = 0;
  let height = 0;

  if (page) {
    const pageWidth = page.get('width');
    const defaultOptions = isSticker
      ? defaultStickerOptions
      : defaultFrameOptions;

    // 框的宽与page的宽的比.
    let wRatio = defaultOptions.default.value;

    if (
      page.get('type') === pageTypes.page ||
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front
    ) {
      wRatio = defaultOptions.ps.value;
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

const convertElement = (that, currentPage, currentElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
    ratio,
    elements,
    paginationSpread,
    pagination,
    parameters,
    settings
  } = data;

  const curElement = merge({}, currentElement);
  const { width, height, type, orientation = 0 } = curElement;

  // 90, 270
  const isSwitched = (Math.abs(orientation) / 90) % 2 === 1;
  const isSticker = type === elementTypes.sticker;

  if (isSwitched) {
    curElement.width = height;
    curElement.height = width;
  }

  const whRatio = curElement.width / curElement.height;
  const frameSize = calcDefaultFrameSize(currentPage, whRatio, isSticker);

  const eWidth = frameSize.width;
  const eHeight = frameSize.height;

  const pageWidth = currentPage.get('width');
  const pageHeight = currentPage.get('height');

  const step = 80;
  const viewEleWidth = eWidth * ratio.workspace;
  const viewEleHeight = eHeight * ratio.workspace;
  const viewConWidth = pageWidth * ratio.workspace;
  const viewConHeight = pageHeight * ratio.workspace;

  const containerProps = document.querySelector('.spreads-list .inner-sheet')
    ? getOffset(document.querySelector('.spreads-list .inner-sheet canvas'))
    : getOffset(document.querySelector('.spreads-list .cover-sheet canvas'));

  // 计算鼠标放开位置的真实坐标
  let viewX = x - containerProps.left;
  let viewY = y - containerProps.top;
  let xStep = index * step;
  let yStep = index * step;

  const leftPage = paginationSpread.getIn(['pages', 0]);
  const innerPageBleed = parameters.get('innerPageBleed');
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

  const newElements = elements.filter(
    ele => ele.get('type') !== elementTypes.background
  );

  const maxDepElement = newElements.maxBy(item => {
    return item.get('dep');
  });

  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1 + index;
  let newElement;
  if (curElement.type === elementTypes.photo) {
    // 应用border.
    const { bookSetting } = settings;
    const border = bookSetting.border;

    newElement = new Element({
      type: elementTypes.photo,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      dep,
      imgRot: orientation,

      // 应用border.
      border,
      px: null,
      py: null,
      pw: null,
      ph: null
    });
  } else if (curElement.type === elementTypes.sticker) {
    newElement = {
      type: elementTypes.sticker,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      decorationId: curElement.stickerCode,
      rot: 0,
      px: defaultPosition.x / pageWidth,
      py: defaultPosition.y / pageHeight,
      pw: eWidth / pageWidth,
      ph: eHeight / pageHeight,
      cropLUX: 0,
      cropLUY: 0,
      cropRLX: 1,
      cropRLY: 1,
      dep
    };
  } else if (curElement.type === elementTypes.background) {
    const pWidth = currentPage.get('width');
    const pHeight = currentPage.get('height');
    newElement = {
      type: elementTypes.background,
      x: 0,
      y: 0,
      width: pWidth,
      height: pHeight,
      backgroundId: curElement.code,
      rot: 0,
      imgRot: 0,
      dep: BACKGROUND_ELEMENT_DEP
    };
  }
  return Object.assign({}, newElement);
};

const addElements = (that, elements, x, y) => {
  const { data } = that.props;
  const { pagination, paginationSpread } = data;

  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find(page => {
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
  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });
  const newElement = convertElement(that, currentPage, curElement, 0, x, y);

  return boundProjectActions.createElement(newElement);
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
    pagination.pageId !== page.get('id') &&
    page.get('type') !== pageTypes.spine
  ) {
    boundPaginationActions.switchPage(index, page.get('id')).then(() => {
      callback && callback();
    });
  }
};

export const activePage = that => {
  const { actions, data } = that.props;
  const { page } = data;

  actions.activePage(page.get('id'));
};

const getSpineFirstElement = paginationSpread => {
  let firstSpineText;

  if (paginationSpread) {
    const pages = paginationSpread.get('pages');

    if (pages && pages.size) {
      const spinePage = pages.find(
        page => page.get('type') === pageTypes.spine
      );

      if (spinePage) {
        // 如果里面的element的type本来就是spine 就不需要拷贝到full
        const spineElements = spinePage.get('elements');
        if (spineElements && spineElements.size) {
          const newSpineElements = spineElements.first();
          if (newSpineElements.get('type') === elementTypes.text) {
            firstSpineText = newSpineElements.merge({
              isSpineText: true,
              rot: 0
            });
          }
        }
      }
    }
  }

  return firstSpineText;
};

function convertElements(that, nextProps, ratio) {
  let outList = Immutable.List();
  const props = nextProps || that.props;
  const { data } = props;
  const { elementArray } = that.state;

  // 在full页面拿到spine页面 里面的spineTextElement 的第一个
  const firstSpineText = getSpineFirstElement(data.paginationSpread);
  let elements = data.page.get('elements');
  if (firstSpineText) {
    elements = data.page.get('elements').push(firstSpineText);
  }

  elements.forEach(element => {
    const computed = that.computedElementOptions(props, element, ratio);

    const stateElement = elementArray.find(o => {
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

export const componentWillMount = that => {
  const { page, ratio, paginationSpread, size, parameters } = that.props.data;
  const staticGuideLines = covertStaticGuideLines(
    that,
    page,
    ratio,
    paginationSpread,
    size,
    parameters
  );
  that.setState({
    elementArray: convertElements(that, that.props, ratio.workspace),
    staticGuideLines
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

  const oldUndoData = oldData.undoData;
  const newUndoData = newData.undoData;

  const oldActivePageId = oldData.activePageId;
  const newActivePageId = newData.activePageId;

  const oldCoverImg = oldData.materials.getIn(['cover', 'img']);
  const newCoverImg = newData.materials.getIn(['cover', 'img']);

  if (
    !Immutable.is(oldElements, newElements) ||
    oldRatio !== newRatio ||
    !Immutable.is(oldPaginationSpread, newPaginationSpread)
  ) {
    const newElementArray = convertElements(that, nextProps, newRatio);
    const dynamicGuideLines = convertElementsGuideLines(
      that,
      page,
      newElementArray,
      newRatio
    );

    that.setState({
      elementArray: newElementArray,
      dynamicGuideLines
    });

    toDownload(that, newElementArray);
  }

  if (oldElements.size !== newElements.size && that.elementControlsNode) {
    that.elementControlsNode.redrawElementControlsRect();
  }

  if (oldCoverImg !== newCoverImg) {
    that.updateOffset();
  }

  // 切换page时，取消其他page所有已选择的状态
  if (oldPageId !== newPageId || oldActivePageId !== newActivePageId) {
    const newElementArray = convertElements(that, nextProps, newRatio);
    const dynamicGuideLines = convertElementsGuideLines(
      that,
      page,
      newElementArray,
      newRatio
    );

    that.setState(
      {
        elementArray: newElementArray.map(element => {
          return element.set('isSelected', false);
        }),
        dynamicGuideLines
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
  const {
    boundProjectActions,
    boundGlobalLoadingActions,
    boundTrackerActions
  } = actions;
  const x = event.pageX;
  const y = event.pageY;
  let elementsProps;
  elementsProps = getTransferData(event);

  if (!elementsProps) {
    return;
  }

  const backgroundElement = elements.find(ele => {
    return ele.get('type') === elementTypes.background;
  });

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
    boundProjectActions.addProjectSticker({
      code: elementsProps.stickerCode,
      width: elementsProps.width,
      height: elementsProps.height,
      name: elementsProps.name
    });
    boundTrackerActions.addTracker('DragAndDropSticker');
  } else if (
    elementsProps.type === elementTypes.background &&
    page.get('type') !== pageTypes.spine
  ) {
    boundTrackerActions.addTracker('DragAndDropBackground');
    const applyBackground = () => {
      if (elementsProps.isDefaultBackground) {
        boundProjectActions.applyDefaultBackground();
      } else {
        boundProjectActions.applyBackground(elementsProps);
      }
    };
    // 当前释放的page不是当前活动的page
    if (page && pagination.pageId !== page.get('id')) {
      // 使用默认的Background
      switchPage(that, e, () => {
        applyBackground();
      });
    } else {
      applyBackground();
    }
  } else if (elementsProps.type === dragTypes.theme) {
    const { guid, pageIndex, sheetIndex } = elementsProps;
    boundGlobalLoadingActions.showGlobalLoading();
    boundProjectActions.applyThemePage(guid, pageIndex, sheetIndex).then(() => {
      boundGlobalLoadingActions.hideGlobalLoading();
    });
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
