import Immutable from 'immutable';
import { get, merge } from 'lodash';
import { elementTypes, pageTypes, dragTypes } from '../../../contants/strings';
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
  const eWidth = curElement.type === elementTypes.photo ? 960 : curElement.width;
  const eHeight = curElement.type === elementTypes.photo ? 640 : curElement.height;
  const step = 80;
  const viewEleWidth = eWidth * ratio.coverWorkspace;
  const viewEleHeight = eHeight * ratio.coverWorkspace;
  const viewConWidth = currentPage.get('width') * ratio.coverWorkspace;
  const viewConHeight = currentPage.get('height') * ratio.coverWorkspace;
  const containerProps = document.querySelector('.inner-sheet')
    ? getOffset(document.querySelector('.inner-sheet'))
    : getOffset(document.querySelector('.cover-sheet'));
  // 计算鼠标放开位置的真实坐标
  let viewX = x - containerProps.left;
  let viewY = y - containerProps.top;
  let xStep = index * step;
  let yStep = index * step;

  const leftPage = paginationSpread.getIn(['pages', 0]);
  const innerPageBleed = parameters.get('innerPageBleed');
  const leftPageWidth = (leftPage.get('width') - innerPageBleed.get('left') - innerPageBleed.get('right')) * ratio.coverWorkspace;

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

  const ex = viewX / ratio.coverWorkspace + xStep;
  const ey = viewY / ratio.coverWorkspace + yStep;
  const defaultPosition = { x: ex, y: ey };

  const options = getCropOptions(width, height, eWidth * ratio.coverWorkspace, eHeight * ratio.coverWorkspace, 0);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const maxDepElement = elements.maxBy((item) => {
    return item.get('dep');
  });

  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;
  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    // 应用border.
    const { bookSetting } = settings;
    const border = bookSetting.border;

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
      border
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
    newElements.push(convertElement(that, currentPage, curElement, index, x, y));
  });

  return boundProjectActions.createElements(newElements);
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
  const newPhotoElement = convertElement(that, currentPage, curElement, 0, x, y);

  return boundProjectActions.createElement(newPhotoElement);
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

function convertElements(that, nextProps, ratio) {
  let outList = Immutable.List();
  let elements = Immutable.List();
  const props = nextProps || that.props;
  const { data } = props;
  const { elementArray } = that.state;

  const elementArrayData = data.elementArray;

  const eles = data.page.get('elements');

  eles.forEach((eid) => {
    const ele = elementArrayData.find((e) => {
      return e.get('id') === eid;
    });
    elements = elements.push(ele);
  });


  elements.forEach((element) => {
    if (!element) {
      return;
    };
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
  const { page, ratio, paginationSpread, size } = that.props.data;
  that.setState({
    elementArray: convertElements(that, that.props, ratio.coverWorkspace)
  });
};


export const componentWillReceiveProps = (that, nextProps) => {
  const oldData = that.props.data;
  const newData = nextProps.data;

  const oldPage = oldData.paginationSpread;
  const page = newData.paginationSpread;

  const oldElements = oldPage.get('elements');
  const newElements = page.get('elements');

  const oldRatio = oldData.ratio.coverWorkspace;
  const newRatio = newData.ratio.coverWorkspace;

  if (!Immutable.is(oldElements, newElements) || oldRatio !== newRatio) {
    const newElementArray = convertElements(that, nextProps, newRatio);

    that.setState({
      elementArray: newElementArray
    });

    toDownload(that, newElementArray);
  }

  if (oldRatio !== newRatio) {
    // FIXME: 需要知道render材质后的时机
    clearTimeout(that.updateOffsetTimer);
    that.updateOffsetTimer = setTimeout(() => {
      // that.updateOffset();
      that.setState({
        isRatioChanged: true
      });
    }, 1200);
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
    page
  } = data;
  const x = event.pageX;
  const y = event.pageY;
  let elementsProps;
  elementsProps = getTransferData(event);

  const index = pagination.pageIndex === 1 ? 0 : 1;
  if (elementsProps.length) {
    // 判断鼠标释放时所在的page是否是当前活动的page
    // 如果不是, 就先切换到鼠标释放时所在的page.
    if (page && pagination.pageId !== page.get('id')) {
      // spine上不支持接受拖拽事件.
      if (page.get('type') !== pageTypes.spine) {
        switchPage(that, e, () => {
          addElements(that, elementsProps, x, y).then(() => {
            that.doAutoLayout(that.props);
          });
        });
      }
    } else {
      addElements(that, elementsProps, x, y).then(() => {
        that.doAutoLayout(that.props);
      });
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
    const { guid } = elementsProps;
    that.applyTemplate(guid);
  }
  that.elementControlsNode.needRedrawElementControlsRect();
  that.setState({
    isDragOver: false
  });
  stopEvent(event);
};

