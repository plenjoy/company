import { get, merge, forIn } from 'lodash';
import Immutable from 'immutable';
import {
  pageStep,
  spreadTypes,
  elementTypes,
  coverTypes,
  pageTypes,
  smallViewWidthInArrangePages,
  productTypes,
  shadowBaseSize,
  arrangePageRules
} from '../contants/strings';
import { checkBookShapeType } from './bookShape';
import {
  checkIsSetCoverAsInnerBg,
  checkIsSupportImageInCover,
  checkIsSupportHalfImageInCover,
  checkIsSupportFullImageInCover,
  checkIsSupportPaintedTextInCover,
  checkIsSupportFrontPaintedTextInCover,
  checkIsSupportPaintedTextInSpine,
  checkIsSupportParentBook,
  checkIsSupportSpineText,
  checkIsSupportEditParentBook
} from './cover';

/* -------------private methods----------------*/
/**
 * 根据产品的名称, 获取该产品对应的内页的shadow的图片信息.
 */
const getShadowImage = (settings, materials) => {
  const shadowImages = materials.getIn(['originalMaterials', 'shadowImages']);
  let shadowImageObject = null;
  const product = get(settings, 'spec.product');

  switch (product) {
    case productTypes.LF: {
      shadowImageObject = shadowImages ? shadowImages.get('lfb').toJS() : null;
      break;
    }
    case productTypes.FM: {
      shadowImageObject = shadowImages ? shadowImages.get('fma').toJS() : null;
      break;
    }
    case productTypes.PS: {
      shadowImageObject = shadowImages
        ? shadowImages.get('pressbook').toJS()
        : null;
      break;
    }
    default: {
      break;
    }
  }

  return shadowImageObject;
};

/**
 * 根据产品的名称, 获取该产品对应的内页的shadow的图片原始宽高.
 */
const getShadowBaseSize = (settings) => {
  let baseSize = null;
  const product = get(settings, 'spec.product');

  switch (product) {
    case productTypes.LF: {
        baseSize = shadowBaseSize.LF;
        break;
      }
    case productTypes.FM: {
        baseSize = shadowBaseSize.FM;
        break;
      }
    case productTypes.PS: {
        baseSize = shadowBaseSize.PS;
        break;
      }
    default: {
        break;
      }
  }

  return baseSize;
};

const getShadowData = (pages, settings, materials) => {
  let shadow;
  const shadowImageObject = getShadowImage(settings, materials);
  const shadowImageBaseSize = getShadowBaseSize(settings);

  // 产品为FM,LF
  if (pages.size === 1) {
    const page = pages.get(0);

    const leftImage = {
      width: page.get('width') / 2,
      height: page.get('height'),
      top: 0,
      left: 0,
      imgUrl: shadowImageObject ? shadowImageObject.left : ''
    };

    const middleImageWidth =
      page.get('height') *
      shadowImageBaseSize.middle.width /
      shadowImageBaseSize.middle.height;
    const middleImage = {
      width: middleImageWidth,
      height: page.get('height'),
      top: 0,
      left: (page.get('width') - middleImageWidth) / 2,
      imgUrl: shadowImageObject ? shadowImageObject.middle : ''
    };

    const rightImage = {
      width: page.get('width') / 2,
      height: page.get('height'),
      top: 0,
      left: page.get('width') / 2,
      imgUrl: shadowImageObject ? shadowImageObject.right : ''
    };

    shadow = Immutable.fromJS({
      width: page.get('width'),
      height: page.get('height'),
      top: page.getIn(['offset', 'top']),
      left: page.getIn(['offset', 'left']),

      leftImage,
      middleImage,
      rightImage
    });
  } else if (pages.size === 2) {
    // 产品为Press book.
    const page1 = pages.get(0);
    const page2 = pages.get(1);

    const leftImage = {
      width: page1.get('width') - page1.getIn(['bleed', 'right']),
      height: page1.get('height'),
      top: 0,
      left: 0,
      imgUrl: shadowImageObject ? shadowImageObject.left : ''
    };

    const middleImageWidth =
      page1.get('height') *
      shadowImageBaseSize.middle.width /
      shadowImageBaseSize.middle.height;
    const middleImage = {
      width: middleImageWidth,
      height: page1.get('height'),
      top: 0,
      left: leftImage.width - middleImageWidth / 2,
      imgUrl: shadowImageObject ? shadowImageObject.middle : ''
    };

    const rightImage = {
      width: page2.get('width') - page2.getIn(['bleed', 'left']),
      height: page2.get('height'),
      top: 0,
      left: leftImage.width,
      imgUrl: shadowImageObject ? shadowImageObject.right : ''
    };

    shadow = Immutable.fromJS({
      width: page1.get('width') + page2.get('width'),
      height: page1.get('height'),
      top: page1.getIn(['offset', 'top']),
      left: page1.getIn(['offset', 'left']),

      leftImage,
      middleImage,
      rightImage
    });
  }

  return shadow;
};

const getPageNumberData = (summary, pages, pagination, totalOfPages) => {
  const isPressBook = summary.get('isPressBook');

  let leftPage,
    rightPage;
  let isActiveLeftPage = false;
  let isActiveRightPage = false;

  // 当前page.
  let currentPage = pages.find(page => page.get('id') === pagination.pageId);
  currentPage = currentPage || pages.get(0);

  // 设置待选中的page number.
  if (currentPage) {
    switch (currentPage.get('type')) {
      case pageTypes.sheet:
      case pageTypes.full: {
          isActiveLeftPage = isActiveRightPage = false;
          break;
        }
      case pageTypes.front: {
          isActiveRightPage = true;
          break;
        }
      case pageTypes.back: {
          isActiveLeftPage = true;
          break;
        }
      case pageTypes.page: {
          isActiveLeftPage = pagination.pageIndex === 0;
          isActiveRightPage = !isActiveLeftPage;
          break;
        }
      default:
        break;
    }
  }

  // 设置当前活动的pageNumber
  if (summary.get('isCover')) {
    // 判断当前的封面是否支持在封面的正面放置图片.
    const isSupportHalfImageInCover = summary.get('isSupportHalfImageInCover');

    leftPage = {
      text: 'Back Cover',
      active: false,
      disable: true,

      // page index
      index: -1,

      // sheet index
      sheetIndex: pagination.sheetIndex,

      // 是否左右保持相同的选中状态.
      keepSame: true
    };
    rightPage = {
      text: 'Front Cover',
      active: false,
      disable: true,

      // page index
      index: -1,

      // sheet index
      sheetIndex: pagination.sheetIndex,

      // 是否左右保持相同的选中状态.
      keepSame: true
    };
  } else {
    const leftSurfaceIndex = pagination.sheetIndex * pagination.pageStep - 1;
    const rightSurfaceIndex = pagination.sheetIndex * pagination.pageStep;

    let leftText = `${leftSurfaceIndex}`;
    let leftIndex = -1;

    let rightText = `${rightSurfaceIndex}`;
    let rightIndex = -1;

    // 左右的pageindex
    if (isPressBook) {
      if (pagination.sheetIndex === 1) {
        leftText = '';

        rightText = '1';
        rightIndex = 1;
      } else if (pagination.sheetIndex === pagination.total) {
        leftIndex = (pagination.sheetIndex - 1) * pagination.pageStep;

        leftText = `${leftIndex}`;
        rightText = '';
      } else {
        leftIndex = (pagination.sheetIndex - 1) * pagination.pageStep;
        rightIndex = (pagination.sheetIndex - 1) * pagination.pageStep + 1;

        leftText = `${leftIndex}`;
        rightText = `${rightIndex}`;
      }

      // PS:  左页的index为0, 右页的为1.
      leftIndex %= 2;
      rightIndex %= 2;
    } else {
      // FMA, LFB. 统一使用第一个page.
      leftIndex = 0;
      rightIndex = 0;
    }

    leftPage = {
      text: leftText,
      active: isPressBook ? isActiveLeftPage : false,

      // pressbook的第一页为不可用.
      disable: isPressBook ? (!!(isPressBook && leftSurfaceIndex - 1 === 0)) : true,

      // page index
      index: leftIndex,
      id: pages.getIn([leftIndex, 'id']),

      // sheet index
      sheetIndex: pagination.sheetIndex,

      // 是否左右保持相同的选中状态.
      keepSame: !isPressBook
    };
    rightPage = {
      text: rightText,
      active: isPressBook ? isActiveRightPage : false,

      // pressbook的第后一页为不可用.
      disable: isPressBook ? (!!(isPressBook && rightSurfaceIndex - 1 === totalOfPages - 1)) : true,

      // page index
      index: rightIndex,
      id: pages.getIn([rightIndex, 'id']),

      // sheet index
      sheetIndex: pagination.sheetIndex,

      // 是否左右保持相同的选中状态.
      keepSame: !isPressBook
    };
  }

  return Immutable.fromJS({
    leftPage,
    rightPage
  });
};

/**
 * 检查当前的page是否enable.
 * @param  {[type]} page       [description]
 * @param  {[type]} settings   [description]
 * @param  {[type]} pagination [description]
 */
export const checkIsEnablePage = (
  totalOfSheets,
  currentSheetIndex,
  currentPageIndex,
  productType,
  coverType,
  isCover
) => {
  let enabled = true;

  // 在这几种情况下, 页面是活动的, 即用户可以添加照片等元素到页面..
  //  1. 封面:
  //    - 支持照片铺满整页的封面.
  //    - crystal和metal的正面.
  //  2. 内页
  //    - 除了pressbook第一个sheet的第一页和最后一个sheet的最后一页外, 其他所有的page都应该是活动的.
  if (!isCover) {
    // 内页.
    // 判断是不是pressbook第一个sheet的第一页
    if (
      productType === productTypes.PS &&
      ((currentSheetIndex === 1 && currentPageIndex === 0) ||
        (currentSheetIndex === totalOfSheets && currentPageIndex === 1))
    ) {
      enabled = false;
    }
  } else {
    // 封面
    // 判断支不支持在封面上添加图片. 如果不支持, 那么久设置成enabled为false
    // 如果支持, 再判断是否支持的是铺满还是半页. 如果是半页, 那么久只有封面的正面才能放置图片.
    if (!checkIsSupportImageInCover(coverType)) {
      enabled = false;
    } else if (
      checkIsSupportHalfImageInCover(coverType) &&
      (currentPageIndex === 0 || currentPageIndex === 1)
    ) {
      enabled = false;
    }

    // spine页面一律设置enabled为false
    if (currentPageIndex === 1) {
      enabled = false;
    }
  }

  return enabled;
};

/**
 * [description]
 * @param  {[type]} allPages 所有未处理的pages
 * @param  {[type]} pages   所有处理过的pages
 * @param  {[type]} firstPageIndex  待处理的page的索引
 * @param  {[type]} secondPageIndex 待处理的page的索引
 */
const convertSheetPages = (
  allPages,
  firstPageIndex,
  secondPageIndex,
  productType,
  coverType,
  totalOfSheets,
  currentSheetIndex,
  pagination
) => {
  let newPages = Immutable.List([]);
  const page1 = allPages.get(firstPageIndex);
  const page2 = allPages.get(secondPageIndex);

  const page1Enabled = checkIsEnablePage(
    totalOfSheets,
    currentSheetIndex,
    0,
    productType,
    coverType,
    false
  );
  const page2Enabled = checkIsEnablePage(
    totalOfSheets,
    currentSheetIndex,
    1,
    productType,
    coverType,
    false
  );

  newPages = newPages.push(
    page1.merge({
    width: page1.get('width'), // - (page1.getIn(['bleed', 'left']) + page1.getIn(['bleed', 'right'])),
    height: page1.get('height'), // - (page1.getIn(['bleed', 'top']) + page1.getIn(['bleed', 'bottom'])),
    offset: {
      top: 0,
      left: 0
    },
    enabled: page1Enabled,
    isActive: page1.get('id') === pagination.pageId,
    isPageDraggable: page1Enabled,
    isPageDropable: page1Enabled
    })
  );

  // 如果第一个page的类型为page, 那么第二个page的offset的left就要偏移第一个page的宽.
  // 如果第一个page的类型是sheet, 那么第二个page只是用于占位, 不需要渲染.
  if (page1.get('type') === pageTypes.page) {
    newPages = newPages.push(
      page2.merge({
      width: page2.get('width'), // - (page2.getIn(['bleed', 'left']) + page2.getIn(['bleed', 'right'])),
      height: page2.get('height'), // - (page2.getIn(['bleed', 'top']) + page2.getIn(['bleed', 'bottom'])),
      offset: {
        top: 0,
        // 左页和右页都有出血, 所以右页的坐标的x轴等于左页的宽减去左页的右边出血和右页的左边出血.
        left: 0 // page1.get('width') - (page1.getIn(['bleed', 'right']) + page2.getIn(['bleed', 'left']))
      },
      enabled: page2Enabled,
      // 标示当前page是否为选中page
      isActive: page2.get('id') === pagination.pageId,
      isPageDraggable: page2Enabled,
      isPageDropable: page2Enabled
      })
    );
  }

  return newPages;
};
/* -------------end----------------*/
/**
 * 计算特定容器大小下cover和inner工作区的缩放比例.
 * @return {[type]}          [description]
 */
export const computedRatioForSpecialView = (
  size,
  ratios,
  viewWidthOrHeight = 0,
  isWidth = true
) => {
  let coverWorkspace = 0;
  let innerWorkspace = 0;

  if (isWidth) {
    // 计算cover的相关ratio.
    if (size.coverSpreadSize && size.coverSpreadSize.width) {
      coverWorkspace = viewWidthOrHeight / size.coverSpreadSize.width;
    }

    // 计算inner的相关ratio.
    if (size.innerSpreadSize && size.innerSpreadSize.width) {
      innerWorkspace = viewWidthOrHeight / size.innerSpreadSize.width;
    }
  } else {
    // 计算cover的相关ratio.
    if (size.coverSpreadSize && size.coverSpreadSize.height) {
      coverWorkspace = viewWidthOrHeight / size.coverSpreadSize.height;
    }

    // 计算inner的相关ratio.
    if (size.innerSpreadSize && size.innerSpreadSize.height) {
      innerWorkspace = viewWidthOrHeight / size.innerSpreadSize.height;
    }
  }

  return merge({}, ratios, {
    coverWorkspace,
    innerWorkspace
  });
};

/**
 * 计算内页的spread的大小.
 * - width: 基础宽 * 2 + 左右出血
 * - height: 基础高 + 上下出血
 * @param {object} bookInnerBaseSize   - 内页的基础宽高. 结构为: {width, height}
 * @param {object} innerPageBleed - 内页的出血对象. 结构为: {left, right, top, bottom}
 */
export const getInnerSheetSize = (bookInnerBaseSize, innerPageBleed) => {
  const innerPageBleedWidth = innerPageBleed.left + innerPageBleed.right;
  const innerPageBleedHeight = innerPageBleed.top + innerPageBleed.bottom;

  return {
    width: Math.round(bookInnerBaseSize.width * 2 + innerPageBleedWidth),
    height: Math.round(bookInnerBaseSize.height + innerPageBleedHeight)
  };
};

export const getInnerPageSize = (bookInnerBaseSize, innerPageBleed) => {
  const innerPageBleedWidth = innerPageBleed.left + innerPageBleed.right;
  const innerPageBleedHeight = innerPageBleed.top + innerPageBleed.bottom;

  return {
    width: Math.round(bookInnerBaseSize.width + innerPageBleedWidth),
    height: Math.round(bookInnerBaseSize.height + innerPageBleedHeight)
  };
};

export const getSpineWidth = (spineWidth, addedSheetNumber = 0) => {
  return spineWidth.baseValue + spineWidth.addtionalValue * addedSheetNumber;
};

/**
 * 计算封面spread的大小.
 * - width: 基础宽 * 2 + 书脊宽 + 延边 + 左右出血
 * - height: 基础高 + 延边 + 上下出血
 * @param {object} bookCoverBaseSize       - 封面的基础宽高. 结构为: {width, height}
 * @param {object} coverPageBleed     - 封面的出血对象. 结构为: {left, right, top, bottom}
 * @param {object} coverExpandingSize - 封面的延边. 结构为: {left, right, top, bottom}
 * @param {object} spineWidth         - 书脊的宽. 结构为: {baseValue, addtionalValue}
 * @param {Number} addedSheetNumber   - 新增的sheet数量, 一个sheet包含两个pages.
 */
export const getCoverSheetSize = (
  bookCoverBaseSize,
  coverPageBleed,
  coverExpandingSize,
  spineWidth,
  addedSheetNumber = 0
) => {
  const coverPageBleedWidth = coverPageBleed.left + coverPageBleed.right;
  const coverExpandingWidth =
    coverExpandingSize.left + coverExpandingSize.right;
  const totalSpineWidth = getSpineWidth(spineWidth, addedSheetNumber);

  const coverPageBleedHeight = coverPageBleed.top + coverPageBleed.bottom;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  // spread的宽高.
  const width = Math.round(
    bookCoverBaseSize.width * 2 +
      coverPageBleedWidth +
      coverExpandingWidth +
      totalSpineWidth
  );
  const height = Math.round(
    bookCoverBaseSize.height + coverPageBleedHeight + coverExpandingHeight
  );

  return {
    width,
    height
  };
};

export const getFrontCoverSize = (
  bookCoverBaseSize,
  coverPageBleed,
  coverExpandingSize,
  spineExpanding
) => {
  const coverPageBleedWidth = coverPageBleed.left + coverPageBleed.right;
  const coverPageBleedHeight = coverPageBleed.top + coverPageBleed.bottom;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  return {
    width:
      bookCoverBaseSize.width +
      coverPageBleedWidth +
      coverExpandingSize.right,
    height:
      bookCoverBaseSize.height + coverPageBleedHeight + coverExpandingHeight
  };
};

export const getBackCoverSize = (
  bookCoverBaseSize,
  coverPageBleed,
  coverExpandingSize,
  spineExpanding
) => {
  const coverPageBleedWidth = coverPageBleed.left + coverPageBleed.right;
  const coverPageBleedHeight = coverPageBleed.top + coverPageBleed.bottom;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  return {
    width:
      bookCoverBaseSize.width +
      coverPageBleedWidth +
      coverExpandingSize.left,
    height:
      bookCoverBaseSize.height + coverPageBleedHeight + coverExpandingHeight
  };
};

/**
 * 计算内页的渲染容器的大小.
 * - width: 基础宽 * 2 + 左右出血
 * - height: 基础高 + 上下出血
 * @param {object} bookInnerBaseSize       - 内页的基础宽高. 结构为: {width, height}
 * @param {object} paddings           - 白边对象. 结构为: {left, right, top, bottom}
 * @param {object} coverExpandingSize - 封面的延边. 结构为: {left, right, top, bottom}
 */
export const getInnerRenderSize = (
  bookInnerBaseSize,
  paddings,
  coverExpandingSize
) => {
  // 白边大小
  const paddingsWidth = paddings.left + paddings.right;
  const paddingsHeight = paddings.top + paddings.bottom;

  // 延边.
  const coverExpandingWidth =
    coverExpandingSize.left + coverExpandingSize.right;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  return {
    width: bookInnerBaseSize.width * 2 + coverExpandingWidth + paddingsWidth,
    height: bookInnerBaseSize.height + coverExpandingHeight + paddingsHeight
  };
};

/**
 * 计算封面渲染容器的大小.
 * - width: 基础宽 * 2 + 书脊宽 + 延边 + 左右白边
 * - height: 基础高 + 延边 + 上下白边
 * @param {object} bookCoverBaseSize       - 封面的基础宽高. 结构为: {width, height}
 * @param {object} coverExpandingSize - 封面的延边. 结构为: {left, right, top, bottom}
 * @param {object} paddings           - 封面的白边对象. 结构为: {left, right, top, bottom}
 * @param {object} spineWidth         - 书脊的宽. 结构为: {baseValue, addtionalValue}
 * @param {Number} addedSheetNumber   - 新增的sheet数量, 一个sheet包含两个pages.
 */
export const getCoverRenderSize = (
  bookCoverBaseSize,
  coverExpandingSize,
  paddings,
  spineWidth,
  addedSheetNumber = 0
) => {
  // 白边大小
  const coverPaddingsWidth = paddings.left + paddings.right;
  const coverPaddingHeight = paddings.top + paddings.bottom;

  // 书脊宽
  const totalSpineWidth =
    spineWidth.baseValue + spineWidth.addtionalValue * addedSheetNumber;

  // 延边.
  const coverExpandingWidth =
    coverExpandingSize.left + coverExpandingSize.right;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  // render的宽高.
  const width =
    bookCoverBaseSize.width * 2 +
    coverPaddingsWidth +
    coverExpandingWidth +
    totalSpineWidth;
  const height =
    bookCoverBaseSize.height + coverPaddingHeight + coverExpandingHeight;

  return {
    width,
    height
  };
};

/**
 * 计算书脊的宽.
 * @param allSpreads 所有的spreads
 * @param parameters
 */
export const getSpainSize = (allSpreads, parameters) => {
  let width = 0;

  if (
    allSpreads &&
    allSpreads.length &&
    parameters &&
    parameters.sheetNumberRange
  ) {
    const { spineWidth, sheetNumberRange } = parameters;
    const baseValue = spineWidth.baseValue;

    // 减去封面
    let sheetsToAdd = allSpreads.length - 1 - sheetNumberRange.min;
    const allowNum = sheetNumberRange.max - sheetNumberRange.min;

    // 判断是否超过允许的最大值.
    sheetsToAdd = sheetsToAdd > allowNum ? allowNum : sheetsToAdd;

    // 基础宽 + 新增的sheets * 每个sheet的厚度.
    width = baseValue + spineWidth.addtionalValue * sheetsToAdd;
  }

  return width;
};

/** ***********************************************/
// 以下用于计算渲染时的各种尺寸.
/** ***********************************************/

/* -----------private function----------------*/
/**
 * 获取spread的大小.
 * @param spreadArray
 * @return {{width: number, height: number}}
 */
const getSpreadSize = (project, isCover = true) => {
  const size = {
    width: 0,
    height: 0
  };

  if (isCover) {
    const cover = project.cover.present;
    size.width = cover.get('width') || 0;
    size.height = cover.get('height') || 0;
  } else {
    const pages = project.pageArray.present;

    if (pages.size > 2) {
      const firstPage = pages.get(0);
      const secondPage = pages.get(1);

      if (firstPage.get('type') === pageTypes.sheet) {
        size.width = firstPage.get('width');
        size.height = firstPage.get('height');
      } else {
        // 当一个sheet与两个page组成时, sheet的宽应该是第一个page的宽加上第二个page的宽再减去第一个page的右出血和第二个page的左出血.
        size.width =
          firstPage.get('width') +
          secondPage.get('width') -
          (firstPage.getIn(['bleed', 'right']) +
            secondPage.getIn(['bleed', 'left']));
        size.height = firstPage.get('height');
      }
    }
  }

  size.width = Math.ceil(size.width);
  size.height = Math.ceil(size.height);

  return size;
};

/**
 * 获取workspace的大小.
 * @param spreadSize spread原始宽高
 * @param ratio 缩放比.
 */
const getWorkspaceSize = (spreadSize, ratio) => {
  const size = {
    width: 0,
    height: 0
  };

  if (spreadSize && spreadSize.width) {
    size.width = spreadSize.width * ratio;
    size.height = size.width * spreadSize.height / spreadSize.width;
  }

  size.width = Math.ceil(size.width);
  size.height = Math.ceil(size.height);

  return size;
};

export const getRenderCoverSheetSize = (
  coverSpreadSize,
  parameters,
  ratio = 0
) => {
  const size = {
    container: {
      width: 0,
      height: 0
    },
    sheet: {
      width: 0,
      height: 0
    }
  };
  const bleedLeft = parameters
    ? parameters.getIn(['coverPageBleed', 'left']) || 0
    : 0;
  const bleedRight = parameters
    ? parameters.getIn(['coverPageBleed', 'right']) || 0
    : 0;
  const bleedTop = parameters
    ? parameters.getIn(['coverPageBleed', 'top']) || 0
    : 0;
  const bleedBottom = parameters
    ? parameters.getIn(['coverPageBleed', 'bottom']) || 0
    : 0;

  // 渲染book时, cover sheet的实际大小, 所有元素都是基于spread来定位.
  size.container.width = Math.ceil(coverSpreadSize.width * ratio);
  size.container.height = Math.ceil(
    size.container.width * coverSpreadSize.height / coverSpreadSize.width
  );
  size.container.bleed = {
    left: Math.ceil(bleedLeft * ratio),
    top: Math.ceil(bleedTop * ratio)
  };

  // 渲染book时, 看到的sheet的实际大小, 其中不包括出血.
  const spreadWithWithoutBleed =
    coverSpreadSize.width - (bleedLeft + bleedRight);
  const spreadHeightWithoutBleed =
    coverSpreadSize.height - (bleedTop + bleedBottom);

  size.sheet.width = Math.ceil(spreadWithWithoutBleed * ratio);
  size.sheet.height = Math.ceil(
    size.sheet.width * spreadHeightWithoutBleed / spreadWithWithoutBleed
  );
  size.sheet.bleed = {
    left: Math.ceil(bleedLeft * ratio),
    top: Math.ceil(bleedTop * ratio)
  };

  return size;
};

const getRenderInnerSheetSize = (innerSpreadSize, parameters, ratio = 0) => {
  const size = {
    container: {
      width: 0,
      height: 0
    },
    sheet: {
      width: 0,
      height: 0
    }
  };

  const bleedLeft = parameters
    ? parameters.getIn(['innerPageBleed', 'left'])
    : 0;
  const bleedRight = parameters
    ? parameters.getIn(['innerPageBleed', 'right'])
    : 0;
  const bleedTop = parameters ? parameters.getIn(['innerPageBleed', 'top']) : 0;
  const bleedBottom = parameters
    ? parameters.getIn(['innerPageBleed', 'bottom'])
    : 0;

  // 渲染book时, inner sheet的实际大小: 整个inner spread的大小 - 出血 + 延边.
  // size.width = (innerSpreadSize.width - (bleedLeft + bleedRight) + (expandingLeft + expandingRight)) * ratio;
  // size.height = (innerSpreadSize.height - (bleedTop + bleedBottom) + (expandingTop + expandingBottom)) * ratio;
  // size.width = (innerSpreadSize.width - (bleedLeft + bleedRight)) * ratio;
  // size.height = (innerSpreadSize.height - (bleedTop + bleedBottom)) * ratio;

  // 渲染book时, cover sheet的实际大小, 所有元素都是基于spread来定位.
  size.container.width = Math.floor(innerSpreadSize.width * ratio);
  size.container.height = Math.floor(
    size.container.width * innerSpreadSize.height / innerSpreadSize.width
  );
  size.container.bleed = {
    left: Math.ceil(bleedLeft * ratio),
    top: Math.ceil(bleedTop * ratio)
  };

  // 渲染book时, 看到的sheet的实际大小, 其中不包括出血.
  const innerSpreadWidthWithoutBleed =
    innerSpreadSize.width - (bleedLeft + bleedRight);
  const innerSpreadHeightWithoutBleed =
    innerSpreadSize.height - (bleedTop + bleedBottom);
  size.sheet.width = Math.floor(innerSpreadWidthWithoutBleed * ratio);
  size.sheet.height = Math.floor(
    size.sheet.width *
      innerSpreadHeightWithoutBleed /
      innerSpreadWidthWithoutBleed
  );
  size.sheet.bleed = {
    left: Math.ceil(bleedLeft * ratio),
    top: Math.ceil(bleedTop * ratio)
  };

  return size;
};
/*---------------------------*/

/**
 * 计算渲染到页面上后, 乘以ratio后的实际值.
 * @param  {object]} project  store上project的对象
 * @param  {object} ratios    原始值与屏幕显示值的比例.
 * @param  {object} spineSize   书脊的大小
 * @param  {object} spainExpanding 书脊压线的大小
 * @param  {object} parameters   store上所有的paramters
 * @param  {object} materials   store上所有的materials
 */
export const getRenderSize = (
  project,
  ratios,
  spineSize,
  spainExpanding,
  parameters,
  materials
) => {
  // 获取cover spread的大小.
  const coverSpreadSize = getSpreadSize(project, true);
  const innerSpreadSize = getSpreadSize(project, false);

  const coverWorkspaceSize = getWorkspaceSize(
    coverSpreadSize,
    ratios.coverWorkspace
  );
  const innerWorkspaceSize = getWorkspaceSize(
    innerSpreadSize,
    ratios.innerWorkspace
  );

  const renderCoverSize = !ratios.coverRenderWidth
    ? coverWorkspaceSize
    : {
    width: Math.ceil(coverWorkspaceSize.width * ratios.coverRenderWidth),
    height: Math.ceil(coverWorkspaceSize.height * ratios.coverRenderHeight)
  };

  const renderInnerSize = !ratios.innerRenderWidth
    ? innerWorkspaceSize
    : {
    width: Math.ceil(innerWorkspaceSize.width * ratios.innerRenderWidth),
    height: Math.ceil(innerWorkspaceSize.height * ratios.innerRenderHeight)
  };

  // 渲染书脊时的实际宽度: 书脊宽度 + 书脊压线.
  // const renderSpainWidth = (spineSize.width + spainExpanding.expandingOverBackcover + spainExpanding.expandingOverFrontcover) * ratios.coverWorkspace;
  let renderSpainWidth = Math.ceil(spineSize.width * ratios.coverWorkspace);
  let renderSpainWidthWithoutBleed = Math.ceil(
    (spineSize.width - (spineSize.bleed.left + spineSize.bleed.right)) *
      ratios.coverWorkspace
  );

  // 渲染book时, cover sheet的实际大小: 整个spread的大小减去出血.
  const renderCoverSheetSize = getRenderCoverSheetSize(
    coverSpreadSize,
    parameters,
    ratios.coverWorkspace
  );

  // 渲染book时, inner sheet的实际大小: 整个inner spread的大小 - 出血 + 延边.
  const renderInnerSheetSize = getRenderInnerSheetSize(
    innerSpreadSize,
    parameters,
    ratios.innerWorkspace
  );

  // 校正rendersize, 由于cover和inner的出血不一样, 导致在workspace尺寸相同的情况下.
  // 渲染出来的的效果图的尺寸就不一样. 为了使cover和内页的高度一样, 我们以内页的高作为基础.
  // 对内页计算出来的尺寸做一次校正.
  if (
    renderCoverSheetSize.sheet.height &&
    ratios.coverRenderWidth &&
    renderCoverSheetSize.sheet.height !== renderInnerSheetSize.sheet.height
  ) {
    const oldCoverWidth = renderCoverSheetSize.sheet.width;
    const oldCoverHeight = renderCoverSheetSize.sheet.height;

    // 校正cover渲染尺寸.
    renderCoverSheetSize.sheet.height = renderInnerSheetSize.sheet.height;
    renderCoverSheetSize.sheet.width =
      oldCoverWidth * renderCoverSheetSize.sheet.height / oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下sheet container的尺寸.
    const oldContainerWidth = renderCoverSheetSize.container.width;
    const oldContainerHeight = renderCoverSheetSize.container.height;
    renderCoverSheetSize.container.width =
      oldContainerWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    renderCoverSheetSize.container.height =
      oldContainerHeight * renderCoverSheetSize.sheet.height / oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下coverWorkspaceSize的尺寸.
    const oldCoverWorkspaceWidth = coverWorkspaceSize.width;
    const oldCoverWorkspaceHeight = coverWorkspaceSize.height;
    coverWorkspaceSize.width =
      oldCoverWorkspaceWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    coverWorkspaceSize.height =
      oldCoverWorkspaceHeight *
      renderCoverSheetSize.sheet.height /
      oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下renderCoverSize的尺寸.
    renderCoverSize.width = Math.ceil(
      coverWorkspaceSize.width * ratios.coverRenderWidth
    );
    renderCoverSize.height = Math.ceil(
      coverWorkspaceSize.height * ratios.coverRenderHeight
    );

    // renderSpainWidth
    renderSpainWidth =
      renderSpainWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    renderSpainWidthWithoutBleed =
      renderSpainWidthWithoutBleed *
      renderCoverSheetSize.sheet.width /
      oldCoverWidth;
  }

  const obj = {
    // 封面上spread的实际大小.
    coverSpreadSize,
    innerSpreadSize,

    // 书脊的原始大小.
    spineSize,
    spainExpanding,

    // 工作区的实际大小. 原始的spread的大小 * 缩放比例.
    coverWorkspaceSize,
    innerWorkspaceSize,

    // 渲染book的效果图的大小.
    renderCoverSize,
    renderInnerSize,
    renderSpainWidth,
    renderSpainWidthWithoutBleed,

    // 渲染book时, sheet的实际大小.
    renderCoverSheetSize: renderCoverSheetSize.container,
    renderCoverSheetSizeWithoutBleed: renderCoverSheetSize.sheet,

    renderInnerSheetSize: renderInnerSheetSize.container,
    renderInnerSheetSizeWithoutBleed: renderInnerSheetSize.sheet
  };

  return obj;
};

/**
 * 计算cover和内页显示位置.
 */
export const getRenderPosition = (size, ratios) => {
  const ratio = ratios;
  const obj = {
    cover: {
      render: {
        top: Math.ceil(
          size.coverWorkspaceSize.height * ratio.coverRenderPaddingTop
        ),
        left: Math.ceil(
          size.coverWorkspaceSize.width * ratio.coverRenderPaddingLeft
        ),
        outTop: Math.ceil(
          size.coverWorkspaceSize.height * ratio.coverRenderOutPaddingTop
        ),
        outLeft: Math.ceil(
          size.coverWorkspaceSize.width * ratio.coverRenderOutPaddingLeft
        )
      },
      sheet: {
        top: Math.ceil(
          size.coverWorkspaceSize.height * ratio.coverSheetPaddingTop
        ),
        left: Math.ceil(
          size.coverWorkspaceSize.width * ratio.coverSheetPaddingLeft
        )
      }
    },
    inner: {
      render: {
        top: Math.ceil(
          size.innerWorkspaceSize.height * ratio.innerRenderPaddingTop
        ),
        left: Math.ceil(
          size.innerWorkspaceSize.width * ratio.innerRenderPaddingLeft
        ),
        outTop: Math.ceil(
          size.innerWorkspaceSize.height * ratio.innerRenderOutPaddingTop
        ),
        outLeft: Math.ceil(
          size.innerWorkspaceSize.width * ratio.innerRenderOutPaddingLeft
        )
      },
      sheet: {
        top: Math.ceil(
          size.innerWorkspaceSize.height * ratio.innerSheetPaddingTop
        ),
        left: Math.ceil(
          size.innerWorkspaceSize.width * ratio.innerSheetPaddingLeft
        )
      }
    }
  };

  return obj;
};

/**
 * 获取翻页相关的信息
 */
export const getRenderPagination = (pagination, allPages) => {
  let total = 0;
  const current = 0;

  if (allPages && allPages.size) {
    // sheet = 2 pages,
    total = allPages.size / 2;
  }

  return merge({}, pagination.toJS(), {
    total,
    current,
    pageStep
  });
};

export const convertCoverSummaryPages = (coverSpread, settings, pagination) => {
  let pages = Immutable.List();
  let summary = Immutable.Map();

  const bgImageUrl = coverSpread.get('bgImageUrl');
  const bleed = coverSpread.get('bleed');
  const height = coverSpread.get('height');
  const width = coverSpread.get('width');
  const id = coverSpread.get('id');
  const containers = coverSpread.get('containers');
  const productType = get(settings, 'spec.product');
  const coverType = get(settings, 'spec.cover');
  const totalOfSheets = pagination.total;

  // 封面是否支持图片.
  const isSupportImageInCover = checkIsSupportImageInCover(coverType);

  let fullPage;
  let frontPage;
  let backPage;
  let spinePage;
  let cameoElement;

  if (containers) {
    // 是否包含full类型的page.
    fullPage = containers.find(page => page.get('type') === pageTypes.full);
    frontPage = containers.find(page => page.get('type') === pageTypes.front);
    backPage = containers.find(page => page.get('type') === pageTypes.back);
    spinePage = containers.find(page => page.get('type') === pageTypes.spine);

    // 查找天窗元素
    if (fullPage) {
      const allElements = fullPage.get('elements');

      if (allElements) {
        cameoElement = allElements.find(
          ele => ele.get('type') === elementTypes.cameo
        );
      }
    }
  }

  summary = summary.merge({
    bgImageUrl,
    bleed,
    height,
    width,
    id,
    cameo: cameoElement
      ? cameoElement.get('cameo')
      : get(settings, 'spec.cameo'),
    cameoShape: cameoElement
      ? cameoElement.get('cameoShape')
      : get(settings, 'spec.cameoShape')
  });

  // 封面都不允许拖动来调整位置.
  const draggable = {
    isPageDraggable: false,
    isPageDropable: false
  };

  if (containers) {
    const spineWidth = spinePage ? spinePage.get('width') : 0;
    const halfPageWidth = (width - spineWidth) / 2;

    // 如果包含full page, 就设置full page的offset的left为0, 即基于原点定位.
    if (fullPage) {
      pages = pages.push(
        fullPage.merge(draggable, {
          bgColor: isSupportImageInCover
            ? fullPage.get('bgColor')
            : 'transparent',
        width: fullPage.get('width'), // - (fullPage.getIn(['bleed', 'left']) + fullPage.getIn(['bleed', 'right'])),
        height: fullPage.get('height'), // - (fullPage.getIn(['bleed', 'top']) + fullPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
          enabled: checkIsEnablePage(
            totalOfSheets,
            0,
            0,
            productType,
            coverType,
            true
          ),
        isActive: fullPage.get('id') === pagination.pageId
        })
      );
    }

    // 如果包含backPage, 就设置backPage的offset的left为0.
    if (backPage) {
      pages = pages.push(
        backPage.merge(draggable, {
        bgColor: 'transparent',
        width: backPage.get('width'), // - (backPage.getIn(['bleed', 'left']) + backPage.getIn(['bleed', 'right'])),
        height: backPage.get('height'), // - (backPage.getIn(['bleed', 'top']) + backPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
          enabled: checkIsEnablePage(
            totalOfSheets,
            0,
            0,
            productType,
            coverType,
            true
          ),
        isActive: backPage.get('id') === pagination.pageId
        })
      );
    }

    // spinePage, 就设置spinePage的offset的left为:左半页.
    if (spinePage) {
      pages = pages.push(
        spinePage.merge(draggable, {
        bgColor: 'transparent',
        width: spinePage.get('width'), // - (spinePage.getIn(['bleed', 'left']) + spinePage.getIn(['bleed', 'right'])),
        height: spinePage.get('height'), // - (spinePage.getIn(['bleed', 'top']) + spinePage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
          enabled: checkIsEnablePage(
            totalOfSheets,
            0,
            1,
            productType,
            coverType,
            true
          ),
        isActive: spinePage.get('id') === pagination.pageId
        })
      );
    }

    // 如果包含frontPage, 就设置frontPage的offset的left为:左半页+书脊宽.
    if (frontPage) {
      pages = pages.push(
        frontPage.merge(draggable, {
          bgColor: isSupportImageInCover
            ? frontPage.get('bgColor')
            : 'transparent',
        width: frontPage.get('width'), // - (frontPage.getIn(['bleed', 'left']) + frontPage.getIn(['bleed', 'right'])),
        height: frontPage.get('height'), // - (frontPage.getIn(['bleed', 'top']) + frontPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
          enabled: checkIsEnablePage(
            totalOfSheets,
            0,
            2,
            productType,
            coverType,
            true
          ),
        isActive: frontPage.get('id') === pagination.pageId
        })
      );
    }
  }

  return { summary, pages };
};

/**
 * 获取翻页后, 当前页面的所有信息.
 * - onlyCover: 是否仅仅计算封面的页面数据.
 */
export const getRenderPaginationSpread = (
  allPages,
  coverSpread,
  allDecorations,
  allImages,
  settings,
  pagination,
  materials,
  project,
  onlyCover = false) => {
  const productType = get(settings, 'spec.product');
  const coverType = get(settings, 'spec.cover');
  const productSize = get(settings, 'spec.size');
  const applyBookThemeId = project ? get(project, 'property').get('applyBookThemeId') : 0;

  let summary = Immutable.Map({
    isCover: true,
    pageId: '',
    isPressBook: (productType === productTypes.PS),
    isHalfPage: productType === productTypes.PS,
    isCrystal: (coverType === coverTypes.CC || coverType === coverTypes.GC),
    isMetal: (coverType === coverTypes.MC || coverType === coverTypes.GM),
    isHardCover: (coverType === coverTypes.HC || coverType === coverTypes.LFHC || coverType === coverTypes.PSHC),
    isSupportHalfImageInCover: checkIsSupportHalfImageInCover(coverType),
    isSupportFullImageInCover: checkIsSupportFullImageInCover(coverType),

    isSupportImageInCover: checkIsSupportImageInCover(coverType),
    isSetCoverAsInnerBg: checkIsSetCoverAsInnerBg(coverType),

    // 封面上是否支持Spine text
    // pressbook soft cover支持的条件是: pages 大于等于40页. 但是pressbook前后有两个空白页需要排除.
    isSupportSpineText:
      checkIsSupportSpineText(coverType) ||
      (coverType === coverTypes.PSSC && allPages.size >= 42),

    // 封面上是否支持painted text.
    isSupportPaintedText: checkIsSupportPaintedTextInCover(coverType),
    isSupportFrontPaintedText: checkIsSupportFrontPaintedTextInCover(coverType),
    isSupportSpinePaintedText: checkIsSupportPaintedTextInSpine(coverType),

    sheetIndex: pagination.sheetIndex,

    // parent book
    isSupportParentBook: checkIsSupportParentBook(productType, productSize),
    isSupportEditParentBook: checkIsSupportEditParentBook(coverType),

    // book shape: landscape/square/portarit
    bookShape: checkBookShapeType(productSize),

    isAppliedTheme: !!applyBookThemeId
  });

  // 保存当前sheet下所有page的id.
  let pageIds = Immutable.List();

  // 保存当前sheet下要渲染的所有page对象.
  let pages = Immutable.List();
  let images = Immutable.Map();
  let shadow = Immutable.Map();

  const pageLen = allPages.size;
  const sheetIndex = onlyCover ? 0 : pagination.sheetIndex;

  // 表示为cover sheet
  if (sheetIndex === 0) {
    if (coverSpread) {
      const coverSummaryPages = convertCoverSummaryPages(
        coverSpread,
        settings,
        pagination
      );

      summary = summary.merge(coverSummaryPages.summary);
      pages = pages.merge(coverSummaryPages.pages);

      // 获取当前sheet下所有page的id
      pages.forEach(p => (pageIds = pageIds.push(p.get('id'))));
    }
  } else if (pageLen > (sheetIndex - 1) * 2 + 1) {
    summary = summary.set('isCover', false);

    const leftIndex = (sheetIndex - 1) * 2;
    const rightIndex = (sheetIndex - 1) * 2 + 1;
    pages = convertSheetPages(
      allPages,
      leftIndex,
      rightIndex,
      productType,
      coverType,
      pagination.total,
      sheetIndex,
      pagination
    );

    // 获取当前sheet下所有page的id
    pageIds = pageIds.push(allPages.getIn([leftIndex.toString(), 'id']));
    pageIds = pageIds.push(allPages.getIn([rightIndex.toString(), 'id']));
  }

  // 更改当前活动的page id
  if (pages.size > pagination.pageIndex) {
    summary = summary.set(
      'pageId',
      pages.getIn([String(pagination.pageIndex), 'id'])
    );
  }

  // 如果是封面, 判断是否有cameo 元素
  if (summary.get('isCover')) {
    let hasCameoElement = false;
    let hasPaintedTextElement = false;

    pages.forEach((page) => {
      page.get('elements').forEach((element) => {
        if (element.get('type') === elementTypes.cameo) {
          hasCameoElement = true;
        } else if (element.get('type') === elementTypes.paintedText) {
          hasPaintedTextElement = true;
        }
      });
    });

    summary = summary.set('hasCameoElement', hasCameoElement);
    summary = summary.set('hasPaintedTextElement', hasPaintedTextElement);
  }

  // 获取当前page下的所有的image.
  if (allImages && allImages.size) {
    allImages.forEach((image) => {
      images = images.set(String(image.get('encImgId')), image);
    });
  }

  // 获取页面标识的数据.
  const pageNumber = getPageNumberData(summary, pages, pagination, pageLen);

  // 给每个内页的sheet添加一个shadow的元素.
  if (!summary.get('isCover')) {
    shadow = getShadowData(pages, settings, materials);
  }

  const obj = Immutable.Map({
    summary,
    pages,
    images,
    pageNumber,
    shadow,
    pageIds,
    id: pageIds.get(0)
  });

  return obj;
};

export const computedSizeForSpecialView = (
  size,
  ratioData,
  parameters,
  viewWidthOrHeight = 0,
  isWidth = true
) => {
  // 重新计算在arrange page上小尺寸的ratio.
  const ratios = computedRatioForSpecialView(
    size,
    ratioData,
    viewWidthOrHeight,
    isWidth
  );

  // 获取cover spread的大小.
  const coverSpreadSize = size.coverSpreadSize;
  const innerSpreadSize = size.innerSpreadSize;

  const coverWorkspaceSize = getWorkspaceSize(
    coverSpreadSize,
    ratios.coverWorkspace
  );
  const innerWorkspaceSize = getWorkspaceSize(
    innerSpreadSize,
    ratios.innerWorkspace
  );

  const renderCoverSize = !ratios.coverRenderWidth
    ? coverWorkspaceSize
    : {
    width: Math.ceil(coverWorkspaceSize.width * ratios.coverRenderWidth),
    height: Math.ceil(coverWorkspaceSize.height * ratios.coverRenderHeight)
  };

  const renderInnerSize = !ratios.innerRenderWidth
    ? innerWorkspaceSize
    : {
    width: Math.ceil(innerWorkspaceSize.width * ratios.innerRenderWidth),
    height: Math.ceil(innerWorkspaceSize.height * ratios.innerRenderHeight)
  };

  // 渲染书脊时的实际宽度: 书脊宽度 + 书脊压线.
  // const renderSpainWidth = (spineSize.width + spainExpanding.expandingOverBackcover + spainExpanding.expandingOverFrontcover) * ratios.coverWorkspace;
  let renderSpainWidth = Math.ceil(
    size.spineSize.width * ratios.coverWorkspace
  );
  let renderSpainWidthWithoutBleed = Math.ceil(
    (size.spineSize.width -
      (size.spineSize.bleed.right + size.spineSize.bleed.left)) *
      ratios.coverWorkspace
  );

  const spainExpanding = {
    expandingOverBackcover: Math.ceil(
      size.spainExpanding.expandingOverBackcover * ratios.coverWorkspace
    ),
    expandingOverFrontcover: Math.ceil(
      size.spainExpanding.expandingOverFrontcover * ratios.coverWorkspace
    )
  };

  // 渲染book时, cover sheet的实际大小: 整个spread的大小减去出血.
  const renderCoverSheetSize = getRenderCoverSheetSize(
    coverSpreadSize,
    parameters,
    ratios.coverWorkspace
  );

  // 渲染book时, inner sheet的实际大小: 整个inner spread的大小 - 出血 + 延边.
  const renderInnerSheetSize = getRenderInnerSheetSize(
    innerSpreadSize,
    parameters,
    ratios.innerWorkspace
  );

  // 校正rendersize, 由于cover和inner的出血不一样, 导致在workspace尺寸相同的情况下.
  // 渲染出来的的效果图的尺寸就不一样. 为了使cover和内页的高度一样, 我们以内页的高作为基础.
  // 对内页计算出来的尺寸做一次校正.
  if (
    renderCoverSheetSize.sheet.height &&
    ratios.coverRenderWidth &&
    renderCoverSheetSize.sheet.height !== renderInnerSheetSize.sheet.height
  ) {
    const oldCoverWidth = renderCoverSheetSize.sheet.width;
    const oldCoverHeight = renderCoverSheetSize.sheet.height;

    // 校正cover渲染尺寸.
    renderCoverSheetSize.sheet.height = renderInnerSheetSize.sheet.height;
    renderCoverSheetSize.sheet.width =
      oldCoverWidth * renderCoverSheetSize.sheet.height / oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下sheet container的尺寸.
    const oldContainerWidth = renderCoverSheetSize.container.width;
    const oldContainerHeight = renderCoverSheetSize.container.height;
    renderCoverSheetSize.container.width =
      oldContainerWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    renderCoverSheetSize.container.height =
      oldContainerHeight * renderCoverSheetSize.sheet.height / oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下coverWorkspaceSize的尺寸.
    const oldCoverWorkspaceWidth = coverWorkspaceSize.width;
    const oldCoverWorkspaceHeight = coverWorkspaceSize.height;
    coverWorkspaceSize.width =
      oldCoverWorkspaceWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    coverWorkspaceSize.height =
      oldCoverWorkspaceHeight *
      renderCoverSheetSize.sheet.height /
      oldCoverHeight;

    // sheet渲染尺寸校正后, 也需要校正一下renderCoverSize的尺寸.
    renderCoverSize.width = Math.ceil(
      coverWorkspaceSize.width * ratios.coverRenderWidth
    );
    renderCoverSize.height = Math.ceil(
      coverWorkspaceSize.height * ratios.coverRenderHeight
    );

    // renderSpainWidth
    renderSpainWidth =
      renderSpainWidth * renderCoverSheetSize.sheet.width / oldCoverWidth;
    renderSpainWidthWithoutBleed =
      renderSpainWidthWithoutBleed *
      renderCoverSheetSize.sheet.width /
      oldCoverWidth;
    spainExpanding.expandingOverBackcover =
      spainExpanding.expandingOverBackcover *
      renderCoverSheetSize.sheet.width /
      oldCoverWidth;
    spainExpanding.expandingOverFrontcover =
      spainExpanding.expandingOverFrontcover *
      renderCoverSheetSize.sheet.width /
      oldCoverWidth;
  }

  const obj = {
    // 封面上spread的实际大小.
    coverSpreadSize,
    innerSpreadSize,

    // 书脊的原始大小.
    spineSize: size.spineSize,

    // 工作区的实际大小. 原始的spread的大小 * 缩放比例.
    coverWorkspaceSize,
    innerWorkspaceSize,

    // 渲染book的效果图的大小.
    renderCoverSize,
    renderInnerSize,
    renderSpainWidth,
    spainExpanding,
    renderSpainWidthWithoutBleed,

    // 渲染book时, sheet的实际大小.
    renderCoverSheetSize: renderCoverSheetSize.container,
    renderCoverSheetSizeWithoutBleed: renderCoverSheetSize.sheet,

    renderInnerSheetSize: renderInnerSheetSize.container,
    renderInnerSheetSizeWithoutBleed: renderInnerSheetSize.sheet
  };

  return obj;
};

/**
 * 获取翻页后, 当前页面的所有信息.
 * - onlyCover: 是否仅仅计算封面的页面数据.
 */
export const getRenderAllSpreads = (
  allPages,
  coverSpread,
  allDecorations,
  allImages,
  settings,
  materials
) => {
  // 计算sheet的数量: 加上一个封面.
  const countOfSheets = allPages.size / 2 + 1;

  // 保存所有的处理过的sheet数据.
  let allSpreads = Immutable.List([]);

  for (let i = 0; i < countOfSheets; i++) {
    const sheet = getRenderPaginationSpread(
      allPages,
      coverSpread,
      allDecorations,
      allImages,
      settings,
      {
      sheetIndex: i,
      pageStep,
      total: allPages.size / 2
      },
      materials
    );
    allSpreads = allSpreads.push(sheet);
  }

  return allSpreads;
};

/**
 *
 * @param  {[type]} productType [description]
 * @param  {[type]} productSize [description]
 * @param  {[type]} coverType   [description]
 * @return {[type]}             [description]
 */
export const checkParentBook = (productType, productSize, coverType) => {
  const isSupportParentBook = checkIsSupportParentBook(
    productType,
    productSize
  );
  const isSupportEditParentBook = checkIsSupportEditParentBook(coverType);

  return {
    isSupportParentBook,
    isSupportEditParentBook
  };
};

// 图片水平镜像 + 图片翻转
export const flipImgElements = (coverSpreadData) => {
  const coverElements = coverSpreadData.getIn(['pages', '0', 'elements']);
  if (coverElements) {
    const pages = coverSpreadData.get('pages');

    if (pages && pages.size) {
      const fullPage = pages.find(p => p.get('type') === pageTypes.full);

      if (fullPage) {
        const centerX = fullPage.get('width') / 2;

        // 2. 图片水平镜像 + 图片翻转
        const newElements = coverElements.map((element) => {
          const elementX = element.get('x');
          const deltaX = centerX - elementX;
          const x = centerX + deltaX - element.get('width');

          return element.merge({
            x,
            px: x / fullPage.get('width'),
            imgFlip: !element.get('imgFlip')
          });
        });

        return coverSpreadData.setIn(['pages', '0', 'elements'], newElements);
      }
    }
  }

  return coverSpreadData;
};

export function getArrangePageViewSize(additionalSize = 0) {
  const rules = arrangePageRules;

  // 获取窗口总宽
  const page = document.documentElement || document.body;
  const screenWidth = page.clientWidth + 20;
  const containerWidth = screenWidth - rules.containerPaddingLeft - rules.containerPaddingRight;

  // 获取可放下的spread个数：容器宽度 / spread宽度
  // 例：窗口宽度1920 - 左右padding 30 * 2 => 容器宽度1860
  //    1860 / 最小宽度 330 => 5.63个
  //    1860 / 最大宽度 400 => 4.65个
  //    取4.65 < 合适个数 < 5.63 => 5个 用Math.ceil Min 5 Max 6 取5来做
  //
  // 注：窗口宽度980 2.45 < 合适个数 < 2.96，则 不符合规则条件，做最优尺寸处理
  const spreadMinCount = Math.ceil(containerWidth / (rules.maxWidth + rules.margin + additionalSize));
  const spreadMaxCount = Math.ceil(containerWidth / (rules.minWidth + rules.margin + additionalSize));

  // 设置结果默认值
  let smallViewWidth = 290;
  let suitableCount = 1;

  // 如果 spread最少个数 < spread最多个数
  if(spreadMinCount < spreadMaxCount) {
    suitableCount = spreadMinCount;
    smallViewWidth = (containerWidth - suitableCount * (rules.margin + additionalSize)) / suitableCount;
  }
  // 如果 spread计算出个数不符合设计规则，则做最优处理
  else if(spreadMinCount === spreadMaxCount) {
    // 设置离规则最小差距值的历史结果
    let smallerOffset = Infinity;
    const resultGroup = [];

    for(let count = spreadMinCount - 1; count <= spreadMinCount + 1; count++) {
      // 计算该个数下的宽度、到maxWidth的距离、到minWidth的距离
      const width = (containerWidth - count * (rules.margin + additionalSize)) / count;
      const offsetToMax = Math.abs(rules.maxWidth - width);
      const offsetToMin = Math.abs(width - rules.minWidth);
      // 哪个离标准最小，取离规则最小的差距值
      const offset = offsetToMin < offsetToMax ? offsetToMin : offsetToMax;

      resultGroup.push({ count, width, offset });
    }

    // 找出 离规则最小差距值的历史结果 中 最接近规则的尺寸
    for(const result of resultGroup) {
      if(smallerOffset > result.offset) {
        smallerOffset = result.offset;
        smallViewWidth = result.width;
        suitableCount = result.count;
      }
    }
  }

  return {
    width: Math.floor(smallViewWidth),
    count: suitableCount
  };
}