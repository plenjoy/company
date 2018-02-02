import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { elementTypes, pageTypes } from '../../../contants/strings';
import { getTransferData } from '../../../../common/utils/drag';
import { merge } from 'lodash';

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

/**
 * 天窗drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, event) => {
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
  const elementsProps = getTransferData(event);

  if (elementsProps.length) {
      // addElements(that, elementsProps, x, y);
  } else if (elementsProps.type === elementTypes.sticker) {
    addElement(that, elementsProps, 0, x, y);
  }
  stopEvent(event);
};

const addElements = (that, elements, x, y) => {
  const { data, actions } = that.props;
  const {
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
  boundProjectActions.createElements(currentPageId, newElements).then(() => {
    // that.doAutoLayout();
  });
};

// drag and add elements
const addElement = (that, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
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
  boundProjectActions.createElement(currentPageId, newPhotoElement).then(() => {
    if (curElement.type === elementTypes.photo) {
      // that.doAutoLayout();
    }
  });
};

const convertElement = (that, currentPage, curElement, index, x, y) => {
  const { data, actions } = that.props;
  const {
    ratio,
    paginationSpread,
    pagination,
    parameters
  } = data;
  const elements = data.elementArray;
  const { width, height } = curElement;
  const eWidth = curElement.type === elementTypes.photo ? 960 : curElement.width;
  const eHeight = curElement.type === elementTypes.photo ? 640 : curElement.height;
  const step = 80;
  const viewEleWidth = eWidth * ratio.workspace;
  const viewEleHeight = eHeight * ratio.workspace;
  const viewConWidth = currentPage.get('width') * ratio.workspace;
  const viewConHeight = currentPage.get('height') * ratio.workspace;
  const containerProps = document.querySelector('.inner-sheet') ?
                          getOffset(document.querySelector('.inner-sheet')) :
                          getOffset(document.querySelector('.cover-sheet'));
  // 计算鼠标放开位置的真实坐标
  let viewX = x - containerProps.left;
  let viewY = y - containerProps.top;
  let xStep = index * step;
  let yStep = index * step;

  const leftPage = paginationSpread.getIn(['pages', 0]);
  const innerPageBleed = parameters.get('innerPageBleed');
  const leftPageWidth = (leftPage.get('width') - innerPageBleed.get('left') - innerPageBleed.get('right')) * ratio.workspace;

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

  const options = getCropOptions(width, height, eWidth * ratio.workspace, eHeight * ratio.workspace, 0);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const maxDepElement = elements.maxBy((item) => {
    return item.get('dep');
  });

  const dep = (maxDepElement ? maxDepElement.get('dep') : 0) + 1;
  let newPhotoElement;
  if (curElement.type === elementTypes.photo) {
    newPhotoElement = new Element({
      type: elementTypes.photo,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      px: defaultPosition.x / currentPage.get('width'),
      py: defaultPosition.y / currentPage.get('height'),
      pw: eWidth / currentPage.get('width'),
      ph: eHeight / currentPage.get('height'),
      encImgId: curElement.encImgId,
      imageid: curElement.imageid,
      dep,
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    });
  } else if (curElement.type === elementTypes.sticker) {
    newPhotoElement = {
      type: elementTypes.decoration,
      x: defaultPosition.x,
      y: defaultPosition.y,
      width: eWidth,
      height: eHeight,
      px: defaultPosition.x / currentPage.get('width'),
      py: defaultPosition.y / currentPage.get('height'),
      pw: eWidth / currentPage.get('width'),
      ph: eHeight / currentPage.get('height'),
      decorationid: curElement.guid,
      decorationtype: elementTypes.sticker,
      rot: 0,
      dep
    };
  }
  return newPhotoElement;
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

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};
