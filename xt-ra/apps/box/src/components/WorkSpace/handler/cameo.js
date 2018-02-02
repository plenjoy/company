import { get, merge, forIn } from 'lodash';
import Element from '../../../utils/entries/element';
import { getSpineRect } from '../../../utils/spine';
import { getNewPosition } from '../../../utils/elementPosition';
import { getPxByPt, decToHex } from '../../../../common/utils/math';
import { elementTypes, pageTypes, cameoShapeTypes, defaultFontStyle, defaultFrameOptions } from '../../../contants/strings';

export const computedCameoElementOptions = (frontPage, cameoSize, cameoBleed) => {
  const frontPageWidth = frontPage.width;
  const frontPageHeight = frontPage.height;
  const frontBleedWidth = get(frontPage, 'bleed.left') + get(frontPage, 'bleed.right');

  // 天窗的尺寸: 基础宽高加上出血.
  const width = get(cameoSize, 'width') + get(cameoBleed, 'left') + get(cameoBleed, 'right');
  const height = get(cameoSize, 'height') + get(cameoBleed, 'top') + get(cameoBleed, 'top');

  const left = ((frontPageWidth - frontBleedWidth - get(frontPage, 'wrapSize.right') - width) / 2) + get(frontPage, 'bleed.left');
  const top = (frontPageHeight - height) / 2;

  const x = left;
  const y = top;
  const px = x / frontPageWidth;
  const py = y / frontPageHeight;
  const pw = width / frontPageWidth;
  const ph = height / frontPageHeight;

  return { x, y, px, py, pw, ph };
};


/**
 * 创建一个新的cameo 元素.
 * @param  that editPage组件的this指向.
 */
const createNewCameoElement = (that) => {
  const { parameterMap, boundProjectActions, cover } = that.props;

  const cameoSize = get(parameterMap, 'cameoSize');
  const cameoBleed = get(parameterMap, 'cameoBleed');

  // 天窗的尺寸: 基础宽高加上出血.
  const width = get(cameoSize, 'width') + get(cameoBleed, 'left') + get(cameoBleed, 'right');
  const height = get(cameoSize, 'height') + get(cameoBleed, 'top') + get(cameoBleed, 'top');

  const coverPages = get(cover, 'containers');
  const frontPage = coverPages.find(p => p.type === pageTypes.front);

  // 计算新的天窗的基本属性: { x, y, px, py, pw, ph }
  const options = computedCameoElementOptions(frontPage, cameoSize, cameoBleed);

  const newElement = new Element(merge({}, options, {
    type: elementTypes.cameo,
    elType: 'cameo',
    dep: 100,
    width,
    height
  }));

  // cameoelement始终添加在封面上
  if (frontPage) {
    boundProjectActions.createElement(frontPage.id, newElement);
    // showCameoActionBar(that);
  }
};

/**
 * 显示天窗的action bar
 */
const showCameoActionBar = (that) => {
  that.setState({
    isCameoActionBarShow: true
  });
};

/**
 * 隐藏天窗的action bar
 */
export const hideCameoActionBar = (that) => {
  that.setState({
    isCameoActionBarShow: false
  });
};

/**
 * 添加cameo天窗
 * @param  that editPage组件的this指向.
 */
export const onAddCameo = (that, event) => {
  //  添加天窗的埋点。
  var e = event || window.event;
  const { boundTrackerActions, paginationSpread } = that.props;
  const { summary } = paginationSpread;
  const { cameo, cameoShape } = summary;
  boundTrackerActions.addTracker('AddCameo');
  if (cameo && cameoShape) {
    createNewCameoElement(that);
  }
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
};

/**
 * 删除cameo天窗
 * @param  that editPage组件的this指向.
 */
export const onRemoveCameo = (that) => {
  // 删除天窗的埋点。
  const { boundTrackerActions, paginationSpread, boundProjectActions, cover } = that.props;
  boundTrackerActions.addTracker('RemoveCameo');

  const elements = get(paginationSpread, 'elements');
  let elementId = null;

  const coverPages = get(cover, 'containers');
  const frontPage = coverPages.find(p => p.type === pageTypes.front);

  forIn(elements, (value) => {
    if (get(value, 'type') === elementTypes.cameo) {
      elementId = get(value, 'id');
    }
  });

  if (elementId && frontPage) {
    boundProjectActions.deleteElement(frontPage.id, elementId);
    boundProjectActions.changeProjectSetting({cameoShape: cameoShapeTypes.rect});
  }
};

function addFrame(that, type, width, height, id = '', pageType = '') {
  const {
    boundProjectActions,
    project,
    pagination,
    settings,
    paginationSpread,
    variableMap,
    coverPageSpread,
    elementArray
  } = that.props;
  const pages = get(coverPageSpread, 'pages');
  const currentPageId = pagination.pageId;
  if (!currentPageId) {
    throw 'currentPageId can not null';
  }

  const currentPageArray = get(paginationSpread, 'pages');

  const currentPage = currentPageArray.find((page) => {
    return get(page, 'id') === id;
  });

  const currentElementArray = elementArray.filter((element) => {
    return get(currentPage, 'elements').indexOf(get(element, 'id')) !== -1;
  });

  let maxDep = 0;
  currentElementArray.forEach((ele) => {
    if (get(ele, 'type') !== elementTypes.cameo && get(ele, 'dep') > maxDep) maxDep = get(ele, 'dep');
  });

  const newElementPosition = getNewPosition(elementArray, currentPage, width, height);

  let newElement = null;
  if (type === elementTypes.paintedText) {
    // 如果为coveText    paintedTextColor为弹出层默认的颜色
    // 得到paintedTextColor 转为16进制
    let paintedTextColor = variableMap && get(variableMap, 'paintedTextColor');
    if (isNaN(paintedTextColor)) {
      paintedTextColor = 0;
    }

    const fontColor = decToHex(paintedTextColor);
    const fontSize = defaultFontStyle.defaultFontSize;
    const fontWeight = encodeURIComponent(defaultFontStyle.defaultFontWeight);
    const fontFamily = encodeURIComponent(defaultFontStyle.defaultFontFamily);

    const spinePage = pages.find(v => get(v, 'type') === pageTypes.spine);
    const backPage = pages.find(v => get(v, 'type') === pageTypes.back);
    const spineBleed = get(spinePage, 'bleed');
    if (pageType === pageTypes.spine) {
      const pageWidth = get(spinePage, 'width');
      const pageHeight = get(spinePage, 'height');
      const wrapSize = get(spinePage, 'wrapSize');
      const spineRect = getSpineRect(pageWidth, pageHeight, wrapSize);
      let { x, y, width, height } = spineRect;

      newElement = {
        width,
        height,
        fontColor,
        fontWeight,
        fontFamily,
        fontSize: 0,
        text: '',
        type: elementTypes.paintedText,
        textAlign: 'left',
        textVAlign: 'top',
        // dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,
        dep: maxDep + 1,
        x,
        y,
        px: x / get(spinePage, 'width'),
        py: y / get(spinePage, 'height'),
        pw: width / get(spinePage, 'width'),
        ph: height / get(spinePage, 'height'),
        rot: 90,
      };
    } else {
      newElement = {
        width,
        height,
        fontColor,
        fontWeight,
        fontFamily,
        fontSize: getPxByPt(fontSize) / get(currentPage, 'height'),
        text: '',
        type: elementTypes.paintedText,
        textAlign: 'left',
        textVAlign: 'top',
        dep: maxDep ? maxDep + 1 : 0,
        x: newElementPosition.x,
        y: newElementPosition.y,
        px: newElementPosition.x / get(currentPage, 'width'),
        py: newElementPosition.y / get(currentPage, 'height'),
        pw: width / get(currentPage, 'width'),
        ph: height / get(currentPage, 'height'),
        rot: 0,
      };
    }
  }

  boundProjectActions.createElement(id || currentPageId, newElement);
}

/**
 * 添加painted text
 * @param  that workspace 组件的this指向.
 */
export const onAddSpineText = (that) => {
  const { coverPageSpread } = that.props;
  const pages = get(coverPageSpread, 'pages');
  // 传入uid属于Spine的类型，区分pageType 类型
  const coverSpine = pages.find(p => get(p, 'type') === pageTypes.spine);
  const id = get(coverSpine, 'id');
  const pageType = pageTypes.spine;
  addFrame(that, elementTypes.paintedText, get(coverSpine, 'width'), get(coverSpine, 'height'), id, pageType);
};

/**
 * 计算添加的图片框和文本框, painted text的大小.
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
const calcDefaultFrameSize = (page) => {
  let width = 0;
  let height = 0;

  if (page) {
    const pageWidth = get(page, 'width');

    // 框的宽与page的宽的比.
    const wRatio = defaultFrameOptions.default.value;

    // 框的宽与高的比.
    const whRatio = defaultFrameOptions.default.whRatio;

    width = pageWidth * wRatio;
    height = width / whRatio;
  }

  return {
    width,
    height
  };
};

export const onAddCoverText = (that, pageType) => {
  const { coverPageSpread } = that.props;
  const pages = get(coverPageSpread, 'pages');

  const targetPage = pages.find(p => get(p, 'type') === pageType);
  const id = get(targetPage, 'id');

  if (targetPage) {
    const frameSize = calcDefaultFrameSize(targetPage);
    addFrame(that, elementTypes.paintedText, frameSize.width, frameSize.height, id);
  }
};
