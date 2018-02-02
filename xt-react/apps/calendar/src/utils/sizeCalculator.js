import Immutable from 'immutable';
import { get, merge } from 'lodash';
import { productTypes, pageTypes, pageStepMap, innerPageHeightShowRatio } from '../constants/strings';

export const convertCoverSummaryPages = (coverSpread, settings, pagination) => {
  let pages = Immutable.List();
  let summary = Immutable.Map();

  const bgImageUrl = coverSpread.get('bgImageUrl');
  const bleed = coverSpread.get('bleed');
  const height = coverSpread.get('height');
  const width = coverSpread.get('width');
  const id = coverSpread.get('id');
  const containers = coverSpread.get('containers');

  // 封面是否支持图片.
  const isSupportImageInCover = true;

  let coverPage;
  if (containers) {
    // 是否包含full类型的page.
    coverPage = containers.find(page => page.get('type') === pageTypes.cover);
  }


  summary = summary.merge({
    bgImageUrl,
    bleed,
    height,
    width,
    id,
    month: (coverPage && coverPage.get('month')) || 0,
    year: (coverPage && coverPage.get('year')) || 0
  });

  // 封面都不允许拖动来调整位置.
  const draggable = {
    isPageDraggable: false,
    isPageDropable: false
  };

  if (coverSpread) {
    if (coverPage) {
      pages = pages.push(coverPage.merge(draggable, {
        bgColor: isSupportImageInCover ? coverSpread.get('bgColor') : 'transparent',
        offset: {
          top: 0,
          left: 0
        },
        enabled: true,
        isActive: coverPage.get('id') === pagination.pageId
      }));
    }
  }

  return { summary, pages };
};

/**
 * [description]
 * @param  {[type]} allPages 所有未处理的pages
 * @param  {[type]} pages   所有处理过的pages
 * @param  {[type]} firstPageIndex  待处理的page的索引
 * @param  {[type]} secondPageIndex 待处理的page的索引
 */
const convertSheetPages = (allPages, firstPageIndex, secondPageIndex, productType, coverType, totalOfSheets, currentSheetIndex, pagination) => {
  let newPages = Immutable.List([]);
  const page1 = allPages.get(firstPageIndex);
  const page2 = allPages.get(secondPageIndex);

  // const page1Enabled = checkIsEnablePage(totalOfSheets, currentSheetIndex, 0, productType, coverType, false);
  // const page2Enabled = checkIsEnablePage(totalOfSheets, currentSheetIndex, 1, productType, coverType, false);
  const page1Enabled = true;
  const page2Enabled = false;

  newPages = newPages.push(page1.merge({
    width: page1.get('width'), // - (page1.getIn(['bleed', 'left']) + page1.getIn(['bleed', 'right'])),
    height: page1.get('height'), // - (page1.getIn(['bleed', 'top']) + page1.getIn(['bleed', 'bottom'])),
    offset: {
      top: 0,
      left: 0
    },
    enabled: page1Enabled,
    isActive: page1.get('id') === pagination.pageId,
    isPageDraggable: false,
    isPageDropable: false
  }));

  // 如果第一个page的类型为page, 那么第二个page的offset的left就要偏移第一个page的宽.
  // 如果第一个page的类型是sheet, 那么第二个page只是用于占位, 不需要渲染.
  if (page1.get('type') === pageTypes.top) {
    newPages = newPages.push(page2.merge({
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
      isPageDraggable: false,
      isPageDropable: false
    }));
  }

  return newPages;
};

const getRenderSheetSize = (baseSize, parameters, ratio = 0, calendarBgParams, isCover = false, isAllPage = false) => {
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

  const bleedLeft = parameters ? parameters.getIn(['pageBleed', 'left']) : 0;
  const bleedRight = parameters ? parameters.getIn(['pageBleed', 'right']) : 0;
  const bleedTop = parameters ? parameters.getIn(['pageBleed', 'top']) : 0;
  const bleedBottom = parameters ? parameters.getIn(['pageBleed', 'bottom']) : 0;

  // 渲染book时, cover sheet的实际大小, 所有元素都是基于spread来定位.
  size.container.width = Math.floor((baseSize.get('width') + (bleedLeft + bleedRight)) * ratio);
  size.container.height = Math.floor((baseSize.get('height') + (bleedTop + bleedBottom)) * ratio);
  size.container.left = -Math.floor(bleedLeft * ratio);
  size.container.top = -Math.floor(bleedTop * ratio);

  // 渲染book时, 看到的sheet的实际大小, 其中不包括出血.
  size.sheet.width = Math.floor(baseSize.get('width') * ratio);
  size.sheet.height = Math.floor(baseSize.get('height') * ratio);
  if (isCover) {
    if (isAllPage) {
      size.sheet.top = Math.floor(get(calendarBgParams, 'allPageCoverBgParams.top') * ratio);
      size.sheet.left = Math.floor(get(calendarBgParams, 'allPageCoverBgParams.left') * ratio);
    } else {
      size.sheet.top = Math.floor(get(calendarBgParams, 'coverBgParams.top') * ratio);
      size.sheet.left = Math.floor(get(calendarBgParams, 'coverBgParams.left') * ratio);
    }
  } else {
    if (isAllPage) {
      size.sheet.topPageTop = Math.floor(get(calendarBgParams, 'allPageInnerBgParams.topPageTop') * ratio);
      size.sheet.topPageLeft = Math.floor(get(calendarBgParams, 'allPageInnerBgParams.topPageLeft') * ratio);
      size.sheet.bottomPageTop = Math.floor(get(calendarBgParams, 'allPageInnerBgParams.bottomPageTop') * ratio);
      size.sheet.bottomPageLeft = Math.floor(get(calendarBgParams, 'allPageInnerBgParams.bottomPageLeft') * ratio);
    } else {
      size.sheet.topPageTop = Math.floor(get(calendarBgParams, 'innerBgParams.topPageTop') * ratio);
      size.sheet.topPageLeft = Math.floor(get(calendarBgParams, 'innerBgParams.topPageLeft') * ratio);
      size.sheet.bottomPageTop = Math.floor(get(calendarBgParams, 'innerBgParams.bottomPageTop') * ratio);
      size.sheet.bottomPageLeft = Math.floor(get(calendarBgParams, 'innerBgParams.bottomPageLeft') * ratio);
    }
  }

  return size;
};


/**
 * 获取翻页相关的信息
 */
export const getRenderPagination = (pagination, allPages, settings) => {
  let total = 0;
  const current = 0;
  const productType = get(settings, 'spec.product');
  const pageStep = pageStepMap[productType];

  if (allPages && allPages.size) {
    // sheet = 2 pages,
    total = allPages.size / pageStep;
  }

  return merge({}, pagination.toJS(), {
    total,
    current,
    pageStep
  });
};

export const getInnerPageSize = (bookInnerBaseSize, innerPageBleed) => {
  const innerPageBleedWidth = innerPageBleed.left + innerPageBleed.right;
  const innerPageBleedHeight = innerPageBleed.top + innerPageBleed.bottom;

  return {
    width: bookInnerBaseSize.width + innerPageBleedWidth,
    height: bookInnerBaseSize.height + innerPageBleedHeight
  };
};

/**
 * 获取翻页后, 当前页面的所有信息.
 * - onlyCover: 是否仅仅计算封面的页面数据.
 */
export const getRenderPaginationSpread = (allPages, coverSpread, allImages, settings, pagination, onlyCover = false) => {
  const productType = get(settings, 'spec.product');
  const coverType = get(settings, 'spec.cover');
  const pageStep = pageStepMap[productType];

  let summary = Immutable.Map({
    isCover: true,
    pageId: '',
    sheetIndex: pagination.sheetIndex
  });

  // 保存当前sheet下所有page的id.
  let pageIds = Immutable.List();

  // 保存当前sheet下要渲染的所有page对象.
  let pages = Immutable.List();
  let images = Immutable.Map();

  const pageLen = allPages.size;
  const sheetIndex = onlyCover ? 0 : pagination.sheetIndex;

  // 表示为cover sheet
  if (sheetIndex === 0) {
    if (coverSpread) {
      const coverSummaryPages = convertCoverSummaryPages(coverSpread, settings, pagination);

      summary = summary.merge(coverSummaryPages.summary);
      pages = pages.merge(coverSummaryPages.pages);

      // 获取当前sheet下所有page的id
      pages.forEach(p => pageIds = pageIds.push(p.get('id')));
    }
  } else {
    if (pageStep === 2) {
      if (pageLen > (sheetIndex - 1) * 2 + 1) {
        summary = summary.set('isCover', false);

        const topIndex = (sheetIndex - 1) * 2;
        const bottomIndex = (sheetIndex - 1) * 2 + 1;
        pages = convertSheetPages(allPages, topIndex, bottomIndex, productType, coverType, pagination.total, sheetIndex, pagination);
        summary = summary.set('month', pages.getIn(['0', 'month']));
        summary = summary.set('year', pages.getIn(['0', 'year']));

        // 获取当前sheet下所有page的id
        pageIds = pageIds.push(allPages.getIn([topIndex.toString(), 'id']));
        pageIds = pageIds.push(allPages.getIn([bottomIndex.toString(), 'id']));
      }
    } else if (pageStep === 1) {
      if (pageLen >= sheetIndex) {
        summary = summary.set('isCover', false);
        const page = allPages.get(sheetIndex-1);
        summary = summary.set('month', page.get('month'));
        summary = summary.set('year', page.get('year'));
        pages = pages.push(page.merge({
          offset: {
            top: 0,
            left: 0
          },
          enabled: true,
          isActive: page.get('id') === pagination.pageId,
          isPageDraggable: false,
          isPageDropable: false
        }));
        // 获取当前sheet下所有page的id
        pageIds = pageIds.push(allPages.getIn([(sheetIndex - 1).toString(), 'id']));
      }
    }
  }

  // 更改当前活动的page id
  if (pages.size > pagination.pageIndex) {
    summary = summary.set(
      'pageId',
      pages.getIn([String(pagination.pageIndex), 'id'])
    );
  }

  // 获取当前page下的所有的image.
  if (allImages && allImages.size) {
    allImages.forEach((image) => {
      images = images.set(String(image.get('encImgId')), image);
    });
  }

  // 获取页面标识的数据.
  // const pageNumber = getPageNumberData(summary, pages, pagination, pageLen);
  const pageNumber = Immutable.List();

  const obj = Immutable.Map({
    summary,
    pages,
    images,
    pageNumber,
    // shadow,
    pageIds,
    id: pageIds.get(0)
  });

  return obj;
};

export const getBgParams = (baseSize, variables) => {
  if (!baseSize.get('width')) return { width: 0, height: 0, bgX: 0, bgY: 0 };
  const coverForeground = variables.get('coverForeground');
  const innerForeground = variables.get('innerForeground');
  const allPageCoverForeground = variables.get('allPageCoverForeground');
  const allPageInnerForeground = variables.get('allPageInnerForeground');
  const baseWidth = baseSize.get('width');
  const baseHeight = baseSize.get('height');

  const coverForegroundContentWidth = coverForeground.get('width') - coverForeground.get('left') - coverForeground.get('right');
  const coverForegroundContentHeight = coverForeground.get('height') - coverForeground.get('top') - coverForeground.get('bottom');
  const coverForegroundRatioX = coverForegroundContentWidth / baseWidth;
  const coverForegroundRatioY = coverForegroundContentHeight / baseHeight;
  const coverBgParams = {
    width: coverForeground.get('width') / coverForegroundRatioX,
    height: coverForeground.get('height') / coverForegroundRatioY,
    left: coverForeground.get('left') / coverForegroundRatioX,
    top: coverForeground.get('top') / coverForegroundRatioY
  };

  const innerForegroundContentWidth = innerForeground.get('width') - innerForeground.get('bottomPageLeft') - innerForeground.get('bottomPageRight');
  const innerForegroundContentHeight = innerForeground.get('height') - innerForeground.get('bottomPageTop') - innerForeground.get('bottomPageBottom');
  const innerForegroundRatioX = innerForegroundContentWidth / baseWidth;
  const innerForegroundRatioY = innerForegroundContentHeight / baseHeight;
  const innerBgParams = {
    width: innerForeground.get('width') / innerForegroundRatioX,
    height: innerForeground.get('height') / innerForegroundRatioY,
    topPageLeft: innerForeground.get('topPageLeft') / innerForegroundRatioX,
    topPageTop: innerForeground.get('topPageTop') / innerForegroundRatioY,
    bottomPageLeft: innerForeground.get('bottomPageLeft') / innerForegroundRatioX,
    bottomPageTop: innerForeground.get('bottomPageTop') / innerForegroundRatioY
  };

  const allPageCoverForegroundContentWidth = allPageCoverForeground.get('width') - allPageCoverForeground.get('left') - allPageCoverForeground.get('right');
  const allPageCoverForegroundContentHeight = allPageCoverForeground.get('height') - allPageCoverForeground.get('top') - allPageCoverForeground.get('bottom');
  const allPageCoverForegroundRatioX = allPageCoverForegroundContentWidth / baseWidth;
  const allPageCoverForegroundRatioY = allPageCoverForegroundContentHeight / baseHeight;
  const allPageCoverBgParams = {
    width: allPageCoverForeground.get('width') / allPageCoverForegroundRatioX,
    height: allPageCoverForeground.get('height') / allPageCoverForegroundRatioY,
    left: allPageCoverForeground.get('left') / allPageCoverForegroundRatioX,
    top: allPageCoverForeground.get('top') / allPageCoverForegroundRatioY
  };

  const allPageInnerForegroundContentWidth = allPageInnerForeground.get('width') - allPageInnerForeground.get('bottomPageLeft') - allPageInnerForeground.get('bottomPageRight');
  const allPageInnerForegroundContentHeight = allPageInnerForeground.get('height') - allPageInnerForeground.get('bottomPageTop') - allPageInnerForeground.get('bottomPageBottom');
  const allPageInnerForegroundRatioX = allPageInnerForegroundContentWidth / baseWidth;
  const allPageInnerForegroundRatioY = allPageInnerForegroundContentHeight / baseHeight;
  const allPageInnerBgParams = {
    width: allPageInnerForeground.get('width') / allPageInnerForegroundRatioX,
    height: allPageInnerForeground.get('height') / allPageInnerForegroundRatioY,
    topPageLeft: allPageInnerForeground.get('topPageLeft') / allPageInnerForegroundRatioX,
    topPageTop: allPageInnerForeground.get('topPageTop') / allPageInnerForegroundRatioY,
    bottomPageLeft: allPageInnerForeground.get('bottomPageLeft') / allPageInnerForegroundRatioX,
    bottomPageTop: allPageInnerForeground.get('bottomPageTop') / allPageInnerForegroundRatioY
  };
  return {
    coverBgParams,
    innerBgParams,
    allPageCoverBgParams,
    allPageInnerBgParams
  };
};

/**
 * 计算渲染到页面上后, 乘以ratio后的实际值.
 * @param  {object]} project  store上project的对象
 * @param  {object} ratios    原始值与屏幕显示值的比例.
 * @param  {object} spineSize   书脊的大小
 * @param  {object} spainExpanding 书脊压线的大小
 * @param  {object} parameters   store上所有的paramters
 * @param  {object} materials   store上所有的materials
 */
export const getRenderSize = (project, ratios, parameters, variables, isPreview = false) => {
  // 获取cover spread的大小.
  const baseSize = parameters.get('baseSize');
  if(!baseSize || !variables.size) return {};
  const calendarBgParams = getBgParams(baseSize, variables);
  const productType = project.setting.get('product');
  const heightShowRatio = isPreview ? 1 : innerPageHeightShowRatio[productType];

  const { coverBgParams, innerBgParams } = calendarBgParams;

  const renderCoverSize = !ratios.coverWorkspace ? coverBgParams : {
    width: Math.ceil(coverBgParams.width * ratios.coverWorkspace),
    height: Math.ceil(coverBgParams.height * ratios.coverWorkspace)
  };

  const renderInnerSize = !ratios.innerWorkspace ? innerBgParams : {
    width: Math.ceil(innerBgParams.width * ratios.innerWorkspace),
    height: Math.ceil(innerBgParams.height * ratios.innerWorkspace)
  };

  const renderInnerContainerSize = !ratios.innerWorkspace ? innerBgParams : {
    width: Math.ceil(innerBgParams.width * ratios.innerWorkspace),
    height: Math.ceil(innerBgParams.height * heightShowRatio * ratios.innerWorkspace)
  };

  const renderCoverSheetSize = getRenderSheetSize(baseSize, parameters, ratios.coverWorkspace, calendarBgParams, true);

  const renderInnerSheetSize = getRenderSheetSize(baseSize, parameters, ratios.innerWorkspace, calendarBgParams);

  const obj = {
    renderCoverSize,
    renderInnerSize,
    renderInnerContainerSize,
    baseWidth: baseSize.get('width'),
    baseHeight: baseSize.get('height'),
    ...calendarBgParams,
    // 渲染book时, sheet的实际大小.
    renderCoverSheetSize: renderCoverSheetSize.container,
    renderCoverSheetSizeWithoutBleed: renderCoverSheetSize.sheet,

    renderInnerSheetSize: renderInnerSheetSize.container,
    renderInnerSheetSizeWithoutBleed: renderInnerSheetSize.sheet
  };

  return obj;
};

export const computedSizeForSpecialView = (project, size, ratios, parameters, variables) => {
  // 获取cover spread的大小.
  const baseSize = parameters.get('baseSize');
  if (!baseSize || !variables.size) return {};
  const calendarBgParams = getBgParams(baseSize, variables);
  const productType = project.setting.get('product');
  const heightShowRatio = innerPageHeightShowRatio[productType];

  const { allPageInnerBgParams, allPageCoverBgParams } = calendarBgParams;

  const renderCoverSize = !ratios.coverWorkspaceForArrangePages ? allPageCoverBgParams : {
    width: Math.ceil(allPageCoverBgParams.width * ratios.coverWorkspaceForArrangePages),
    height: Math.ceil(allPageCoverBgParams.height * ratios.coverWorkspaceForArrangePages)
  };

  const renderInnerSize = !ratios.innerWorkspaceForArrangePages ? allPageInnerBgParams : {
    width: Math.ceil(allPageInnerBgParams.width * ratios.innerWorkspaceForArrangePages),
    height: Math.ceil(allPageInnerBgParams.height * ratios.innerWorkspaceForArrangePages)
  };

  const renderInnerContainerSize = !ratios.innerWorkspaceForArrangePages ? allPageInnerBgParams : {
    width: Math.ceil(allPageInnerBgParams.width * ratios.innerWorkspaceForArrangePages),
    height: Math.ceil(allPageInnerBgParams.height * heightShowRatio * ratios.innerWorkspaceForArrangePages)
  };


  const renderCoverSheetSize = getRenderSheetSize(baseSize, parameters, ratios.coverWorkspaceForArrangePages, calendarBgParams, true, true);

  const renderInnerSheetSize = getRenderSheetSize(baseSize, parameters, ratios.innerWorkspaceForArrangePages, calendarBgParams, false, true);

  const obj = {
    renderCoverSize,
    renderInnerSize,
    renderInnerContainerSize,
    baseWidth: baseSize.get('width'),
    baseHeight: baseSize.get('height'),
    ...calendarBgParams,
    // 渲染book时, sheet的实际大小.
    renderCoverSheetSize: renderCoverSheetSize.container,
    renderCoverSheetSizeWithoutBleed: renderCoverSheetSize.sheet,

    renderInnerSheetSize: renderInnerSheetSize.container,
    renderInnerSheetSizeWithoutBleed: renderInnerSheetSize.sheet
  };

  return obj;
};

export const computedSizeForUpgrade = (project, size, ratios, parameters, variables) => {
  // 获取cover spread的大小.
  const baseSize = parameters.get('baseSize');
  if (!baseSize || !variables.size) return {};
  const calendarBgParams = getBgParams(baseSize, variables);
  const productType = project.setting.get('product');
  const heightShowRatio = innerPageHeightShowRatio[productType];

  const { coverBgParams, innerBgParams } = calendarBgParams;

  const renderCoverSize = !ratios.coverWorkspaceForUpgrade ? coverBgParams : {
    width: Math.ceil(coverBgParams.width * ratios.coverWorkspaceForUpgrade),
    height: Math.ceil(coverBgParams.height * ratios.coverWorkspaceForUpgrade)
  };

  const renderInnerSize = !ratios.innerWorkspaceForUpgrade ? innerBgParams : {
    width: Math.ceil(innerBgParams.width * ratios.innerWorkspaceForUpgrade),
    height: Math.ceil(innerBgParams.height * ratios.innerWorkspaceForUpgrade)
  };

  const renderInnerContainerSize = !ratios.innerWorkspaceForUpgrade ? innerBgParams : {
    width: Math.ceil(innerBgParams.width * ratios.innerWorkspaceForUpgrade),
    height: Math.ceil(innerBgParams.height * heightShowRatio * ratios.innerWorkspaceForUpgrade)
  };


  const renderCoverSheetSize = getRenderSheetSize(baseSize, parameters, ratios.coverWorkspaceForUpgrade, calendarBgParams, true);

  const renderInnerSheetSize = getRenderSheetSize(baseSize, parameters, ratios.innerWorkspaceForUpgrade, calendarBgParams);

  const obj = {
    renderCoverSize,
    renderInnerSize,
    renderInnerContainerSize,
    baseWidth: baseSize.get('width'),
    baseHeight: baseSize.get('height'),
    ...calendarBgParams,
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
export const getRenderAllSpreads = (allPages, coverSpread, allImages, settings) => {
  const productType = get(settings, 'spec.product');
  const pageStep = pageStepMap[productType];
  // 计算sheet的数量: 加上一个封面.
  const countOfSheets = allPages.size / pageStep + 1;

  // 保存所有的处理过的sheet数据.
  let allSpreads = Immutable.List([]);

  for (let i = 0; i < countOfSheets; i++) {
    const sheet = getRenderPaginationSpread(allPages, coverSpread, allImages, settings, {
      sheetIndex: i,
      pageStep,
      total: allPages.size / pageStep
    });
    allSpreads = allSpreads.push(sheet);
  }
  return allSpreads;
};
