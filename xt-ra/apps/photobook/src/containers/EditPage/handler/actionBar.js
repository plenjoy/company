import Immutable from 'immutable';
import { get, merge } from 'lodash';
import {
  elementTypes,
  productTypes,
  pageTypes,
  defaultFrameOptions,
  autofillResultTypes,
  maxImagesCountEachSheet
} from '../../../contants/strings';
import { getNewPosition } from '../../../utils/elementPosition';
import Element from '../../../utils/entries/element';

import {
  getAutoFillData,
  computedAddedCount
} from '../../../utils/autofill/autofill';
import { checkIsSupportImageInCover } from '../../../utils/cover';
import { getSpineTextRect } from '../../../utils/spine';
import { getPxByPt, decToHex } from '../../../../../common/utils/math';

const getCurrentPage = that => {
  const { pagination, paginationSpread } = that.props;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');

  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });

  return currentPage;
};

/**
 * 计算添加的图片框和文本框, painted text的大小.
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
const calcDefaultFrameSize = page => {
  let width = 0;
  let height = 0;

  if (page) {
    const pageWidth = page.get('width');

    // 框的宽与page的宽的比.
    let wRatio = defaultFrameOptions.default.value;

    // 框的宽与高的比.
    let whRatio = defaultFrameOptions.default.whRatio;

    if (
      page.get('type') === pageTypes.page ||
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front
    ) {
      wRatio = defaultFrameOptions.ps.value;
      whRatio = defaultFrameOptions.ps.whRatio;
    }

    width = pageWidth * wRatio;
    height = width / whRatio;
  }

  return {
    width,
    height
  };
};

/**
 * design setting的处理函数
 */
export const onDesignSetting = that => {
  const { boundBookSettingsModalActions } = that.props;

  boundBookSettingsModalActions.showBookSettingsModal();
};

/**
 * auto fill的处理函数
 */
export const onAutoFill = that => {
  const {
    project,
    settings,
    boundTrackerActions,
    boundProjectActions,
    boundConfirmModalActions,
    boundTemplateActions,
    boundUndoActions,
    size,
    uploadStatus,
    hasAddedElements
  } = that.props;

  boundUndoActions.stopUndo();

  const { total, errored, uploaded } = uploadStatus;
  const isDisableAutoLayout = errored + uploaded < total;

  boundTrackerActions.addTracker('ClickAutoFill');

  if (isDisableAutoLayout) {
    that.setState({
      isShowDisableTip: !that.state.isShowDisableTip
    });
    return;
  }

  // 如果应用了booktheme, 那就走booktheme的分支.
  if (project.property.get('applyBookThemeId')) {
    return boundProjectActions.fillImagesByDateTime();
  }

  const imageArray = project.imageArray;
  const pageArray = project.pageArray.present;
  const projectType = get(settings, 'spec.product');
  const coverType = get(settings, 'spec.cover');
  const productSize = get(settings, 'spec.size');
  const sheetNumberRange = project.parameterMap.get('sheetNumberRange');
  const minSheetNumber = sheetNumberRange.get('min');
  const maxSheetNumber = sheetNumberRange.get('max');
  const { renderInnerSheetSize } = size;
  const innerPageRatio =
    renderInnerSheetSize.width / renderInnerSheetSize.height;

  // 对pressbook做特殊处理.
  const isPressBook = projectType === productTypes.PS;
  const currentSheetNumber = pageArray.size / 2;

  const startAutofill = (groups, addedCount = 0) => {
    boundTemplateActions.changeApplyTemplateStatus(true);

    // 隐藏弹框.
    boundConfirmModalActions.hideConfirm();

    that.setState(
      {
        loading: { isShown: true }
      },
      () => {
        boundProjectActions.deleteAll().then(() => {
          if (addedCount) {
            boundProjectActions
              .createMultipleDualPage(null, addedCount)
              .then(() => {
                that.doAutoLayout(groups).then(() => {
                  boundTemplateActions.changeApplyTemplateStatus(false);
                  boundUndoActions.startUndo();
                });
              });
          } else {
            that.doAutoLayout(groups).then(() => {
              boundTemplateActions.changeApplyTemplateStatus(false);
              boundUndoActions.startUndo();
            });
          }
        });
      }
    );
  };

  const doAutofill = () => {
    boundTrackerActions.addTracker('ClickAutofillAndContinue');

    // 计算autofill的分组数据.
    const autofillData = getAutoFillData(
      isPressBook,
      checkIsSupportImageInCover(coverType),
      minSheetNumber,
      maxSheetNumber,
      currentSheetNumber,
      imageArray,
      innerPageRatio,
      isPressBook
        ? Math.ceil(maxImagesCountEachSheet / 2)
        : maxImagesCountEachSheet
    );

    const defaultResult = autofillData.find(
      m => m.get('type') === autofillResultTypes.default
    );
    const bestResult = autofillData.find(
      m => m.get('type') === autofillResultTypes.best
    );

    // 获取平均值, 中间值和最大值.
    const avg = defaultResult.get('avg');
    const mid = defaultResult.get('mid');
    const max = defaultResult.get('max');

    // Auto Fill方案: 得到平均值过后，判断该平均值的落值范围
    // a. 平均值<中间值，直接进入下一步的开始运行Auto Fill算法
    // b. 平均值>最大值，提示用户当前照片数过多，无法进行Auto Fill的运算，如果需要使用Auto Fill，需要加上X页
    //     - Buttons: [No] [Yes]
    //     - 点击“No”：停止Auto Fill算法
    //     - 点击“Yes”：按最大值的需要，按“中间值<平均值<最大值”方式添加X页，然后从头运行Auto Fill算法，
    //     - 按“中间值<平均值<最大值”方式运行
    // c. 中间值<平均值<最大值，提示用户当前照片数量较多，我们推荐添加X页以得到更好的布局效果，询问用户是否需要加页
    //     - Buttons: [No Thanks] [Add]
    //     - 点击“No Thanks”：按之前的分组结果进入Auto Fill下一步
    //     - 点击“Add”：按添加Pages过后的页数重新从头运行Auto Fill算法
    if (avg <= mid) {
      // a. 平均值<中间值，直接进入下一步的开始运行Auto Fill算法
      startAutofill(defaultResult.get('groups'));

      // 埋点. ImagelessThanAve, 业务参数：照片数量
      boundTrackerActions.addTracker(`ImagelessThanAve,${currentSheetNumber*2},${productSize},${imageArray.size}`);
    } else if (avg >= max) {
      // b. 平均值>最大值，提示用户当前照片数过多，无法进行Auto Fill的运算，如果需要使用Auto Fill，需要加上X页
      const addedCount = bestResult.get('addedCount');

      if (addedCount) {
        boundConfirmModalActions.showConfirm({
          okButtonText: 'Yes',
          cancelButtonText: 'No',
          hideOnOk: true,
          confirmMessage: `Your book currently does not have enough pages for your images.
            Running autofill will therefore add ${addedCount *
              2} pages. Would you like to continue?`,
          onOkClick: () => {
            startAutofill(bestResult.get('groups'), addedCount);

            // 埋点. ImageMoreThanMax, 业务参数：照片数量，需要添加的页数，选择了“No”还是“Yes”
            boundTrackerActions.addTracker(
              `ImageMoreThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},${addedCount * 2},Yes`
            );
          },
          onCancelClick: () => {
            // 埋点. ImageMoreThanMax, 业务参数：照片数量，需要添加的页数，选择了“No”还是“Yes”
            boundTrackerActions.addTracker(
              `ImageMoreThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},${addedCount * 2},No`
            );
            boundUndoActions.startUndo();
          }
        });
      } else {
        startAutofill(bestResult.get('groups'));

        // 埋点. ImageMoreThanMax, 业务参数：照片数量，需要添加的页数，选择了“No”还是“Yes”
        boundTrackerActions.addTracker(
          `ImageMoreThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},0,Yes`
        );
      }
    } else {
      // c. 中间值<平均值<最大值，提示用户当前照片数量较多，我们推荐添加X页以得到更好的布局效果，询问用户是否需要加页
      const bestAddedCount = bestResult.get('addedCount');

      if (bestAddedCount) {
        boundConfirmModalActions.showConfirm({
          okButtonText: 'Yes',
          cancelButtonText: 'No',
          hideOnOk: true,
          confirmMessage: `We recommend you add ${bestAddedCount *
            2} more pages to your book to get an improved layout.
            Would you like to add pages?`,
          onOkClick: () => {
            startAutofill(bestResult.get('groups'), bestAddedCount);

            // 埋点. ImageLessThanMax, 业务参数：照片数量，需要添加的页数，选择了“No thanks”还是“Yes please”
            boundTrackerActions.addTracker(
              `ImageLessThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},${bestAddedCount * 2},Yes please`
            );
          },
          onCancelClick: () => {
            startAutofill(defaultResult.get('groups'));

            // 埋点. ImageLessThanMax, 业务参数：照片数量，需要添加的页数，选择了“No thanks”还是“Yes please”
            boundTrackerActions.addTracker(
              `ImageLessThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},${bestAddedCount * 2},No thanks`
            );
          }
        });
      } else {
        startAutofill(bestResult.get('groups'), bestAddedCount);

        // 埋点. ImageLessThanMax, 业务参数：照片数量，需要添加的页数，选择了“No thanks”还是“Yes please”
        boundTrackerActions.addTracker(
          `ImageLessThanMax,${currentSheetNumber*2},${productSize},${imageArray.size},0,Yes please`
        );
      }
    }
  };

  // 检查图片的数量是否满足最小个数.
  const minImageSize = isPressBook
    ? (currentSheetNumber - 1) * 2
    : currentSheetNumber;
  if (imageArray.size < minImageSize) {
    boundConfirmModalActions.showConfirm({
      okButtonText: 'OK',
      confirmMessage:
        `Auto Fill requires at least ${minImageSize} photos, ` +
        'please add more photos!',
      onOkClick: () => {
        boundConfirmModalActions.hideConfirm();
      }
    });
  } else if (hasAddedElements) {
    boundConfirmModalActions.showConfirm({
      okButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      hideOnOk: false,
      confirmMessage:
        'Auto Fill will replace your current book design on ' +
        'all pages, and this operation cannot be reversed.' +
        ' Would you like to continue?',
      onOkClick: doAutofill
    });
  } else {
    doAutofill();
  }
};

/**
 * { item_description }
 */
export const onChangeBgColor = that => {
  const {
    boundChangeBgColorModalActions,
    paginationSpread,
    boundTrackerActions
  } = that.props;
  const selectedPageId = paginationSpread.getIn(['summary', 'pageId']);
  const pages = paginationSpread.get('pages');
  let bgColor;

  boundTrackerActions.addTracker('ClickChangeBgColor');

  pages.forEach(item => {
    if (item.get('id') === selectedPageId) {
      bgColor = item.get('bgColor');
    }
  });
  boundChangeBgColorModalActions.showChangeBgColorModal({
    selectedPageId,
    bgColor
  });
};

const addSpineText = (that, id, currentPage) => {
  const { project } = that.props;
  const preAddFrameObj = preAddFrame(that, id);
  const { pages, maxDepElement } = preAddFrameObj;

  const bookSetting = project.bookSetting;
  const fontColor =
    (currentPage && currentPage.get('fontColor')) ||
    bookSetting.getIn(['font', 'color']);
  const fontSize = bookSetting.getIn(['font', 'fontSize']);
  const fontWeight = bookSetting.getIn(['font', 'fontId']);
  const fontFamily = bookSetting.getIn(['font', 'fontFamilyId']);

  const spinePage = pages.find(v => v.get('type') === pageTypes.spine);
  const { x, y, width, height } = getSpineTextRect(spinePage);

  const newElement = {
    width,
    height,
    fontColor,
    fontWeight,
    fontFamily,
    fontSize: 0,
    text: '',
    type: elementTypes.text,
    textAlign: 'center',
    textVAlign: 'middle',
    dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,
    x,
    y,
    px: x / spinePage.get('width'),
    py: y / spinePage.get('height'),
    pw: width / spinePage.get('width'),
    ph: height / spinePage.get('height'),
    rot: 90
  };

  return newElement;
};

const addPaintedText = (that, type, width, height, id, pageType) => {
  const { project, variables } = that.props;
  const preAddFrameObj = preAddFrame(that, id);
  const {
    newElementPosition,
    currentPage,
    maxDepElement,
    pages
  } = preAddFrameObj;
  let newElement = null;
  const bookSetting = project.bookSetting;
  // 如果为coveText    paintedTextColor为弹出层默认的颜色
  // 得到paintedTextColor 转为16进制
  let paintedTextColor = variables && variables.get('paintedTextColor');
  if (isNaN(paintedTextColor)) {
    paintedTextColor = 0;
  }

  const fontColor = decToHex(paintedTextColor);
  const fontSize = bookSetting.getIn(['font', 'fontSize']);
  const fontWeight = bookSetting.getIn(['font', 'fontId']);
  const fontFamily = bookSetting.getIn(['font', 'fontFamilyId']);

  const spinePage = pages.find(v => v.get('type') === pageTypes.spine);
  const backPage = pages.find(v => v.get('type') === pageTypes.back);

  if (pageType === pageTypes.spine) {
    const spineTextRect = getSpineTextRect(spinePage);
    newElement = {
      ...spineTextRect,
      fontColor,
      fontWeight,
      fontFamily,
      fontSize: 0,
      text: '',
      type: elementTypes.paintedText,
      textAlign: 'left',
      textVAlign: 'top',
      dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,
      px: spineTextRect.x / spinePage.get('width'),
      py: spineTextRect.y / spinePage.get('height'),
      pw: spineTextRect.width / spinePage.get('width'),
      ph: spineTextRect.height / spinePage.get('height'),
      rot: 90
    };
  } else {
    newElement = {
      width,
      height,
      fontColor,
      fontWeight,
      fontFamily,
      fontSize: getPxByPt(fontSize) / currentPage.get('height'),
      text: '',
      type: elementTypes.paintedText,
      textAlign: 'left',
      textVAlign: 'top',
      dep: maxDepElement ? maxDepElement.get('dep') + 1 : 1,
      x: newElementPosition.x,
      y: newElementPosition.y,
      px: newElementPosition.x / currentPage.get('width'),
      py: newElementPosition.y / currentPage.get('height'),
      pw: width / currentPage.get('width'),
      ph: height / currentPage.get('height'),
      rot: 0
    };
  }
  return newElement;
};

const preAddFrame = (that, id) => {
  const { pagination, paginationSpread, paginationSpreadForCover } = that.props;
  const pages = paginationSpreadForCover.get('pages');
  const summary = paginationSpreadForCover.get('summary');
  // 这个是指spineText，其他的为PaintedText
  const isSupportSpineText = summary.get('isSupportSpineText');
  const currentPageId = pagination.pageId;
  if (!currentPageId) {
    throw 'currentPageId can not null';
  }

  const currentPageArray = paginationSpread.get('pages');

  const currentPage = currentPageArray.find(page => {
    return page.get('id') === id || page.get('id') === currentPageId;
  });

  let currentElementArray = currentPage.get('elements');
  currentElementArray = currentElementArray.filter(
    ele => ele.get('type') !== elementTypes.background
  );

  const maxDepElement = currentElementArray.maxBy(element => {
    return element.get('dep');
  });

  const newElementPosition = getNewPosition(currentElementArray, currentPage);
  const preAddFrameObj = {
    isSupportSpineText,
    maxDepElement,
    currentPage,
    newElementPosition,
    isSpineText: isSupportSpineText,
    pages
  };
  return preAddFrameObj;
};

function addFrame(that, type, width, height, id = '', pageType = '') {
  const { project, boundProjectActions, settings, variables } = that.props;
  const preAddFrameObj = preAddFrame(that, id);
  const {
    newElementPosition,
    currentPage,
    maxDepElement,
    isSpineText,
    isSupportSpineText,
    pages
  } = preAddFrameObj;
  let newElement = null;
  if (type === elementTypes.photo) {
    // 应用border.
    const { bookSetting } = settings;
    const border = bookSetting.border;

    newElement = new Element({
      type,
      width,
      height,
      x: newElementPosition.x,
      y: newElementPosition.y,
      px: newElementPosition.x / currentPage.get('width'),
      py: newElementPosition.y / currentPage.get('height'),
      pw: width / currentPage.get('width'),
      ph: height / currentPage.get('height'),
      dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,

      // 应用border.
      border
    });
  } else if (type === elementTypes.text) {
    const bookSetting = project.bookSetting;
    const fontColor =
      (currentPage && currentPage.get('fontColor')) ||
      bookSetting.getIn(['font', 'color']);

    const fontSize = bookSetting.getIn(['font', 'fontSize']);
    const fontWeight = bookSetting.getIn(['font', 'fontId']);
    const fontFamily = bookSetting.getIn(['font', 'fontFamilyId']);
    newElement = {
      width,
      height,
      fontColor,
      fontWeight,
      fontFamily,
      fontSize: getPxByPt(fontSize),
      text: '',
      type: elementTypes.text,
      textAlign: 'left',
      textVAlign: 'top',
      dep: maxDepElement ? maxDepElement.get('dep') + 1 : 0,
      x: newElementPosition.x,
      y: newElementPosition.y,
      px: newElementPosition.x / currentPage.get('width'),
      py: newElementPosition.y / currentPage.get('height'),
      pw: width / currentPage.get('width'),
      ph: height / currentPage.get('height'),
      rot: 0
    };
  } else if (type === elementTypes.paintedText) {
    if (isSupportSpineText) {
      newElement = addSpineText(that, id, currentPage);
    } else {
      newElement = addPaintedText(that, type, width, height, id, pageType);
    }
  }

  boundProjectActions.createElement(merge({}, newElement), id);
}

/**
 * add text的处理函数
 */
export const onAddText = that => {
  const { boundTrackerActions } = that.props;
  const currentPage = getCurrentPage(that);

  if (currentPage) {
    const frameSize = calcDefaultFrameSize(currentPage);
    addFrame(that, elementTypes.text, frameSize.width, frameSize.height);
  }
};

export const onAddCoverText = that => {
  const { paginationSpreadForCover, boundTrackerActions } = that.props;
  const pages = paginationSpreadForCover.get('pages');

  boundTrackerActions.addTracker('ClickAddCoverText');

  const backpage = pages.find(
    v => v.get('type') === pageTypes.full || v.get('type') === pageTypes.back
  );
  const id = backpage.get('id');

  if (backpage) {
    const frameSize = calcDefaultFrameSize(backpage);
    addFrame(
      that,
      elementTypes.paintedText,
      frameSize.width,
      frameSize.height,
      id
    );
  }
};

export const onAddSpineText = that => {
  const { paginationSpreadForCover, boundTrackerActions } = that.props;
  const pages = paginationSpreadForCover.get('pages');
  // 传入uid属于Spine的类型，区分pageType 类型
  const coverSpin = pages.find(v => v.get('type') === pageTypes.spine);
  const id = coverSpin.get('id');
  const pageType = pageTypes.spine;

  boundTrackerActions.addTracker('ClickAddSpineText');

  // 这里的elementTypes如果是paintedText 表示传的是paintedText类型 如果spinetext 传的是标识并不传入数据里面存的会修改为text
  addFrame(
    that,
    elementTypes.paintedText,
    coverSpin.get('width'),
    coverSpin.get('height'),
    id,
    pageType
  );
};

/**
 * add frame的处理函数
 */
export const onAddFrame = (that, orientation) => {
  const currentPage = getCurrentPage(that);

  if (currentPage) {
    const frameSize = calcDefaultFrameSize(currentPage);

    let frameWidth = frameSize.width;
    let frameHeight = frameSize.height;

    if (orientation === 'portrait') {
      frameWidth = frameSize.height;
      frameHeight = frameSize.width;
    }

    addFrame(that, elementTypes.photo, frameWidth, frameHeight);
  }
};

export const onFlipHorizontally = that => {
  const {
    boundProjectActions,
    project,
    pagination,
    paginationSpread,
    boundTrackerActions
  } = that.props;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');

  boundTrackerActions.addTracker('ClickFlipHorizontally');

  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });

  const currentElementArray = currentPage.get('elements');

  const centerX = currentPage.get('width') / 2;
  let updateObjectArray = Immutable.List();

  currentElementArray.forEach(element => {
    const elementId = element.get('id');
    const elementX = element.get('x');
    const deltaX = centerX - elementX;
    const x = centerX + deltaX - element.get('width');

    updateObjectArray = updateObjectArray.push(
      Immutable.Map({
        id: elementId,
        x,
        px: x / currentPage.get('width')
      })
    );
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
};

export const onFlipVertically = that => {
  const {
    boundProjectActions,
    project,
    pagination,
    paginationSpread,
    boundTrackerActions
  } = that.props;
  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');

  boundTrackerActions.addTracker('ClickFlipVertically');

  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });

  const currentElementArray = currentPage.get('elements');

  const centerY = currentPage.get('height') / 2;
  let updateObjectArray = Immutable.List();

  currentElementArray.forEach(element => {
    const elementId = element.get('id');
    const elementY = element.get('y');
    const deltaY = centerY - elementY;
    const y = centerY + deltaY - element.get('height');

    updateObjectArray = updateObjectArray.push(
      Immutable.Map({
        id: elementId,
        y
      })
    );
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
};

/**
 * undo的处理函数
 */
export const onUndo = that => {
  const { boundUndoActions, boundTrackerActions } = that.props;
  boundUndoActions.undo();

  boundTrackerActions.addTracker('Click,Undo,EditPage');
};

/**
 * redo的处理函数
 */
export const onRedo = that => {
  const { boundUndoActions, boundTrackerActions } = that.props;
  boundUndoActions.redo();

  boundTrackerActions.addTracker('Click,Redo,EditPage');
};

function clearCurrentPageElements(that, typeList) {
  const { pagination, paginationSpread, boundProjectActions } = that.props;

  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');
  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });
  let willDeleteElements = currentPage
    .get('elements')
    .filter(element => typeList.indexOf(element.get('type')) !== -1);

  // cover页面需要删除 spine text；
  if (pagination.sheetIndex === 0) {
    const spinePage = currentPageArray.find(
      page => page.get('type') === pageTypes.spine
    );
    if (spinePage) {
      const willDeleteSpineElements = spinePage
        .get('elements')
        .filter(element => typeList.indexOf(element.get('type')) !== -1);
      willDeleteElements = willDeleteElements.concat(willDeleteSpineElements);
    }
  }

  if (willDeleteElements.size) {
    boundProjectActions.deleteElements(
      willDeleteElements.map(e => e.get('id')).toArray()
    );
  }
}

/**
 * clear all images的处理函数
 */
export const onClearAllImages = that => {
  const {
    pagination,
    paginationSpread,
    project,
    boundProjectActions,
    boundTrackerActions
  } = that.props;

  const currentPageId = pagination.pageId;
  const currentPageArray = paginationSpread.get('pages');

  const currentPage = currentPageArray.find(page => {
    return page.get('id') === currentPageId;
  });

  const currentElements = currentPage.get('elements');

  const typeList = [elementTypes.photo, elementTypes.cameo];
  const currentPhotoElements = currentElements.filter(element => {
    return typeList.indexOf(element.get('type')) !== -1;
  });

  let updateObjectArray = Immutable.List();
  currentPhotoElements.forEach(element => {
    updateObjectArray = updateObjectArray.push(
      Immutable.Map({
        id: element.get('id'),
        imageid: null,
        encImgId: null
      })
    );
  });

  boundProjectActions.updateElements(updateObjectArray);
};

/**
 * remove all frames的处理函数
 */
export const onRemoveAllFrames = that => {
  clearCurrentPageElements(that, [
    elementTypes.photo,
    elementTypes.text,
    elementTypes.cameo,
    elementTypes.sticker,
    elementTypes.paintedText,
    elementTypes.background
  ]);
};

/**
 * remove sheet的处理函数
 */
export const onRemoveSheet = that => {
  const {
    paginationSpread,
    paginationSpreadForCover,
    pagination,
    boundProjectActions,
    boundConfirmModalActions,
    settings,
    allSheets,
    boundTrackerActions
  } = that.props;

  const coverType = get(settings, 'spec.cover');

  boundConfirmModalActions.showConfirm({
    okButtonText: 'Continue',
    cancelButtonText: 'Cancel',
    confirmMessage:
      'This operation will remove current sheet, ' +
      'would you like to continue?',
    onOkClick: () => {
      const pageIds = paginationSpread.get('pageIds');
      const leftPageId = pageIds.first();
      const rightPageId = pageIds.last();

      boundProjectActions.deleteDualPage(leftPageId, rightPageId).then(() => {
        let sheetIndex = pagination.sheetIndex;
        // 删除page后，总sheet数量并没有更新，手动减1
        const maxIndex = pagination.total - 1;
        if (sheetIndex > maxIndex) {
          sheetIndex = maxIndex;
        }
        that.switchSheet({
          current: sheetIndex
        });

        // 如果是pressbook  Soft 且页面数量少于40页，并且有spinetext 就先移除spinetext
        const pages = paginationSpreadForCover.get('pages');
        const spinePage = pages.find(
          page => page.get('type') === pageTypes.spine
        );
        const spineElements = spinePage.get('elements');

        if (
          allSheets.size <= 22 &&
          spineElements.size &&
          coverType === 'PSSC'
        ) {
          boundProjectActions.deleteElement(spineElements.first().get('id'));
        }
      });
    }
  });
};

/**
 * restart的处理函数
 */
export const onRestart = that => {
  const {
    boundProjectActions,
    boundConfirmModalActions,
    boundTrackerActions,
    boundSnippingActions,
    boundPaginationActions
  } = that.props;

  boundConfirmModalActions.showConfirm({
    okButtonText: 'Continue',
    cancelButtonText: 'Cancel',
    confirmMessage:
      'This operation will remove all photo frames and ' +
      'text frames from all pages to start over from scratch, ' +
      'would you like to continue?',
    onOkClick: () => {
      boundTrackerActions.addTracker('ClickRestartAndContinue');

      boundProjectActions.deleteAll().then(() => {
        // 重置store上的封面截图.
        boundSnippingActions.updateSnippingThumbnail({
          type: 'cover',
          base64: ''
        });

        boundProjectActions.clearApplyThemeId();

        // 重置到封面当book options发生改变时.
        boundPaginationActions.switchSheet(0);
      });
    },
    onCancelClick: () => {
      boundTrackerActions.addTracker('ClickRestartButCancel');
    }
  });
};

/**
 * 添加sheet到最前面的处理函数
 */
export const onAddToFront = that => {
  // todo
};

/**
 * 添加sheet到最后面的处理函数
 */
export const onAddToBack = that => {
  const {
    boundProjectActions,
    boundPaginationActions,
    boundUndoActions,
    boundTrackerActions,
    pagination,
    project
  } = that.props;

  boundProjectActions.createDualPage().then(() => {
    const projectType = project.setting.get('product');
    const isPressBook = projectType === productTypes.PS;
    const sheetIndex = isPressBook ? pagination.total : pagination.total + 1;
    boundPaginationActions.switchSheet(sheetIndex);

    boundUndoActions.clearHistory();
  });
};

/**
 * 添加sheet到当前页的后面处理函数
 */
export const onAddAfterThisPage = that => {
  const {
    boundProjectActions,
    boundPaginationActions,
    boundUndoActions,
    boundTrackerActions,
    pagination
  } = that.props;

  const insertIndex = pagination.sheetIndex * 2;
  boundProjectActions.createDualPage(insertIndex).then(() => {
    boundPaginationActions.switchSheet(pagination.sheetIndex + 1);
    boundUndoActions.clearHistory();
  });
};

/**
 * 添加sheet到当前页的前面的处理函数
 */
export const onAddBeforeThisPage = that => {
  const {
    boundProjectActions,
    boundPaginationActions,
    boundUndoActions,
    boundTrackerActions,
    pagination
  } = that.props;

  const insertIndex = (pagination.sheetIndex - 1) * 2;
  boundProjectActions.createDualPage(insertIndex).then(() => {
    boundPaginationActions.switchSheet(pagination.sheetIndex);
    boundUndoActions.clearHistory();
  });
};

export function hideTooltip(that) {
  that.setState({
    isShowDisableTip: false
  });
}
