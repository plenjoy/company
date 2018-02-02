import Immutable from 'immutable';
import { get, merge } from 'lodash';
import { getSize } from '../../../common/utils/helper';
import { productTypes, canvasBorderTypes, canvasBorderShowRatio } from '../constants/strings';

export const getBgParams = (baseSize, parameters, settings) => {
  if (!baseSize.get('width')) return { width: 0, height: 0, bgX: 0, bgY: 0 };
  const boardInFrame = parameters.get('boardInFrame');
  const frameBorderThickness = parameters.get('frameBorderThickness');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  let canvasBorderThicknessShowWidth = (canvasBorderThickness.get('left') + canvasBorderThickness.get('right')) * canvasBorderShowRatio;
  let canvasBorderThicknessShowHeight = (canvasBorderThickness.get('top') + canvasBorderThickness.get('bottom')) * canvasBorderShowRatio;
  const product = settings.get('product');
  if(product === 'table_metalCube'){
    canvasBorderThicknessShowWidth = 300;
    canvasBorderThicknessShowHeight = 300;
  }
  const bgParams = {
    width: baseSize.get('width') + frameBorderThickness.get('left') + frameBorderThickness.get('right') - boardInFrame.get('left') - boardInFrame.get('right') + canvasBorderThicknessShowWidth,
    height: baseSize.get('height') + frameBorderThickness.get('top') + frameBorderThickness.get('bottom') - boardInFrame.get('top') - boardInFrame.get('bottom') + canvasBorderThicknessShowHeight,
    left: frameBorderThickness.get('left') - boardInFrame.get('left'),
    top: frameBorderThickness.get('top') - boardInFrame.get('top')
  };
  return bgParams;
};

const getRenderSheetSize = (baseSize, parameters, ratio = 0, renderBgParams) => {
  const {
    bleed,
    matteSize,
    floatBgSize,
    frameBaseSize,
    boardInMatting,
    canvasBorderThickness
  } = parameters;
  const bleedWidth = get(bleed, 'left') + get(bleed, 'right');
  const bleedHeight = get(bleed, 'top') + get(bleed, 'bottom');
  const matteWidth = get(matteSize, 'left') + get(matteSize, 'right');
  const matteHeight = get(matteSize, 'top') + get(matteSize, 'bottom');
  const floatBgWidth = get(floatBgSize, 'left') + get(floatBgSize, 'right');
  const floatBgHeight = get(floatBgSize, 'top') + get(floatBgSize, 'bottom');
  const boardInMattingWidth = get(boardInMatting, 'left') + get(boardInMatting, 'right');
  const boardInMattingHeight = get(boardInMatting, 'top') + get(boardInMatting, 'bottom');
  const canvasBorderThicknessWidth = get(canvasBorderThickness, 'left') + get(canvasBorderThickness, 'right');
  const canvasBorderThicknessHeight = get(canvasBorderThickness, 'top') + get(canvasBorderThickness, 'bottom');
  const pageWidth = frameBaseSize.width + canvasBorderThicknessWidth + bleedWidth - matteWidth + boardInMattingWidth - floatBgWidth;
  const pageHeight = frameBaseSize.height + canvasBorderThicknessHeight + bleedHeight - matteHeight + boardInMattingHeight - floatBgHeight;
  const size = {
    container: {
      width: (pageWidth * ratio),
      height: (pageHeight * ratio),
      left: -(((get(bleed, 'left')) * ratio)),
      top: -(((get(bleed, 'top')) * ratio))
    },
    sheet: {
      width: ((frameBaseSize.width - matteWidth + boardInMattingWidth - floatBgWidth) * ratio),
      height: ((frameBaseSize.height - matteHeight + boardInMattingHeight - floatBgHeight) * ratio),
      left: (renderBgParams.left + ((get(matteSize, 'left') - get(boardInMatting, 'left') + get(floatBgSize, 'left') - get(canvasBorderThickness, 'left')) * ratio)),
      top: (renderBgParams.top + ((get(matteSize, 'top') - get(boardInMatting, 'top') + get(floatBgSize, 'top') - get(canvasBorderThickness, 'top')) * ratio))
    }
  };
  return size;
};

/**
 * 获取翻页相关的信息
 */
export const getRenderPagination = (pagination, allPages) => {
  const total = allPages.size ? (allPages.size - 1) : 0;
  const current = 0;

  return merge({}, pagination.toJS(), {
    total,
    current
  });
};

/**
 * 获取翻页后, 当前页面的所有信息. */
export const getRenderPaginationSpread = (allPages, allImages, settings, pagination) => {
  let summary = Immutable.Map({
    pageId: '',
    sheetIndex: pagination.sheetIndex
  });

  // 保存当前sheet下所有page的id.
  let pageIds = Immutable.List();

  // 保存当前sheet下要渲染的所有page对象.
  let pages = Immutable.List();
  let images = Immutable.Map();

  const pageLen = allPages.size;
  const sheetIndex = pagination.sheetIndex;

  if (pageLen && pageLen >= sheetIndex) {
    const page = allPages.get(sheetIndex);
    pages = pages.push(page.merge({
      offset: {
        top: 0,
        left: 0
      },
      enabled: true,
      isActive: page.get('id') === pagination.pageId,
      isPageDraggable: false,
      isPageDropable: true
    }));
    // 获取当前sheet下所有page的id
    pageIds = pageIds.push(allPages.getIn([sheetIndex.toString(), 'id']));
  }

  // 更改当前活动的page id
  if (pages.size >= pagination.pageIndex) {
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

  const obj = Immutable.Map({
    summary,
    pages,
    images,
    pageIds,
    id: pageIds.get(0)
  });
  return obj;
};

/**
 * 获取所有页面的信息.
 */
export const getRenderAllSpreads = (allPages, coverSpread, allImages, settings) => {
  const countOfSheets = allPages.size;
  // 保存所有的处理过的sheet数据.
  let allSpreads = Immutable.List([]);

  for (let i = 0; i < countOfSheets; i++) {
    const sheet = getRenderPaginationSpread(allPages, allImages, settings, {
      sheetIndex: i,
      total: allPages.size
    });
    allSpreads = allSpreads.push(sheet);
  }
  return allSpreads;
};

export const getRenderCanvasProps = (renderBgSize, renderWhitePadding, isPreview = false, isScreenShot = false) => {
  const screenWidth = getSize();
  const stageWidth = isPreview
    ? screenWidth.width
    : isScreenShot
      ? get(renderBgSize, 'width')
      : screenWidth.width - 340;
  const stageHeight = isPreview
    ? screenWidth.height
    : isScreenShot
      ? get(renderBgSize, 'height')
      : screenWidth.height - 77;
  const renderStageProps = {
    width: stageWidth,
    height: stageHeight
  };
  const containerLeft = Math.floor((stageWidth - get(renderBgSize, 'width')) / 2);
  const renderContainerProps = {
    x: containerLeft,
    y: isScreenShot ? 0 : 90 - Math.floor(renderWhitePadding.top),
    width: get(renderBgSize, 'width'),
    height: get(renderBgSize, 'height'),
    clip: {
      x: 0,
      y: 0,
      width: get(renderBgSize, 'width'),
      height: get(renderBgSize, 'height')
    }
  };
  return {
    renderStageProps,
    renderContainerProps
  };
};

export const getRenderMatteSize = (parameters, ratio) => {
  const {
    matteSize,
    frameBaseSize
  } = parameters;
  const renderOutMatteSize = {
    width: Math.floor(get(frameBaseSize, 'width') * ratio),
    height: Math.floor(get(frameBaseSize, 'height') * ratio)
  };
  const renderMatteSize = {
    top: Math.floor(get(matteSize, 'top') * ratio),
    right: Math.floor(get(matteSize, 'right') * ratio),
    bottom: Math.floor(get(matteSize, 'bottom') * ratio),
    left: Math.floor(get(matteSize, 'left') * ratio)
  };
  const renderInnerMatteSize = {
    width: renderOutMatteSize.width - renderMatteSize.left - renderMatteSize.right,
    height: renderOutMatteSize.height - renderMatteSize.top - renderMatteSize.bottom
  };
  return {
    renderOutMatteSize,
    renderMatteSize,
    renderInnerMatteSize
  };
};

export const getRenderBackgroundSize = (renderFrameBorderSize, renderFrameBorderInnerSize, renderWhitePadding, renderBoardInFrameSize) => {
  const renderFrameBorderWidth = renderFrameBorderSize.left + renderFrameBorderSize.right;
  const renderFrameBorderHeight = renderFrameBorderSize.top + renderFrameBorderSize.bottom;
  const renderWhitePaddingWidth = renderWhitePadding.left + renderWhitePadding.right;
  const renderWhitePaddingHeight = renderWhitePadding.top + renderWhitePadding.bottom;

  return {
    width: Math.floor(renderFrameBorderInnerSize.width + renderFrameBorderWidth + renderWhitePaddingWidth),
    height: Math.floor(renderFrameBorderInnerSize.height + renderFrameBorderHeight + renderWhitePaddingHeight),
    centerLeft: renderWhitePadding.left + renderFrameBorderSize.left,
    centerTop: renderWhitePadding.top + renderFrameBorderSize.top,
    top: Math.floor(renderWhitePadding.top + renderFrameBorderSize.top - renderBoardInFrameSize.top),
    left: Math.floor(renderWhitePadding.left + renderFrameBorderSize.left - renderBoardInFrameSize.left),
    contentTop: renderWhitePadding.top,
    contentLeft: renderWhitePadding.left,
    contentWidth: renderFrameBorderInnerSize.width + renderFrameBorderWidth,
    contentHeight: renderFrameBorderInnerSize.height + renderFrameBorderHeight
  };
};

export const getRenderEffectCornerSize = (settings, ratio, parameters, variables) => {
  const product = settings.get('product');
  const shape = settings.get('shape');
  const foregroundAsset = variables.get('foregroundAsset');
  const frameBorderThickness = parameters.get('frameBorderThickness');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  const roundForegroundAsset = variables.get('roundForegroundAsset');
  const frameBaseSize = parameters.get('frameBaseSize');
  let renderFrameBorderSize = { top: 0, right: 0, bottom: 0, left: 0 };
  let renderWhitePadding = { top: 50, right: 50, bottom: 50, left: 50 };
  let renderInnerWhitePadding = { top: 50, right: 50, bottom: 50, left: 50 };
  if(shape === 'Round' && roundForegroundAsset){
    const assetRatio =  (roundForegroundAsset.get('width') - roundForegroundAsset.get('paddingLeft') - roundForegroundAsset.get('paddingRight')) / frameBaseSize.get('width');
    renderWhitePadding = { top: roundForegroundAsset.get('paddingTop') / assetRatio * ratio, right: roundForegroundAsset.get('paddingRight') / assetRatio * ratio, bottom: roundForegroundAsset.get('paddingBottom') / assetRatio * ratio, left: roundForegroundAsset.get('paddingLeft') / assetRatio * ratio };
    renderInnerWhitePadding = { top: 0, right: 0, bottom: 0, left: 0 };
    
  }else if (frameBorderThickness.get('left')) {
    renderFrameBorderSize = {
      top: Math.floor(frameBorderThickness.get('top') * ratio),
      right: Math.floor(frameBorderThickness.get('right') * ratio),
      bottom: Math.floor(frameBorderThickness.get('bottom') * ratio),
      left: Math.floor(frameBorderThickness.get('left') * ratio)
    };
    renderWhitePadding = {
      top: Math.floor(foregroundAsset.get('paddingTop') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('top') * ratio),
      right: Math.floor(foregroundAsset.get('paddingRight') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('right') * ratio),
      bottom: Math.floor(foregroundAsset.get('paddingBottom') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('bottom') * ratio),
      left: Math.floor(foregroundAsset.get('paddingLeft') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('left') * ratio)
    };

    renderInnerWhitePadding = {
      top: Math.floor(foregroundAsset.get('innerPaddingTop') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('top') * ratio),
      right: Math.floor(foregroundAsset.get('innerPaddingRight') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('right') * ratio),
      bottom: Math.floor(foregroundAsset.get('innerPaddingBottom') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('bottom') * ratio),
      left: Math.floor(foregroundAsset.get('innerPaddingLeft') / foregroundAsset.get('borderWidth') * frameBorderThickness.get('left') * ratio)
    };
  } else if (canvasBorderThickness.get('top')) {
    renderFrameBorderSize = {
      top: (canvasBorderThickness.get('top') * canvasBorderShowRatio * ratio),
      right: (canvasBorderThickness.get('right') * canvasBorderShowRatio * ratio),
      bottom: 0,
      left: 0
    };
    renderWhitePadding = {
      top: Math.floor(foregroundAsset.get('paddingTop') / foregroundAsset.get('borderWidth') * canvasBorderThickness.get('top') *canvasBorderShowRatio  * ratio),
      right: (foregroundAsset.get('paddingRight') / foregroundAsset.get('borderWidth2') * canvasBorderThickness.get('right') *canvasBorderShowRatio * ratio),
      bottom: Math.floor(foregroundAsset.get('paddingBottom') / foregroundAsset.get('borderWidth') * canvasBorderThickness.get('bottom') *canvasBorderShowRatio * ratio),
      left: (foregroundAsset.get('paddingLeft') / foregroundAsset.get('borderWidth2') * canvasBorderThickness.get('left')*canvasBorderShowRatio *ratio)
    };

    renderInnerWhitePadding = {
      top: Math.floor(foregroundAsset.get('innerPaddingTop') / foregroundAsset.get('borderWidth') * canvasBorderThickness.get('top')*canvasBorderShowRatio * ratio),
      right: (foregroundAsset.get('innerPaddingRight') / foregroundAsset.get('borderWidth2') * canvasBorderThickness.get('right')*canvasBorderShowRatio * ratio),
      bottom: Math.floor(foregroundAsset.get('innerPaddingBottom') / foregroundAsset.get('borderWidth') * canvasBorderThickness.get('bottom')*canvasBorderShowRatio * ratio),
      left: (foregroundAsset.get('innerPaddingLeft') / foregroundAsset.get('borderWidth2') * canvasBorderThickness.get('left')*canvasBorderShowRatio * ratio)
    };
  } else if (!frameBorderThickness.get('left')) {
    if(foregroundAsset && foregroundAsset.get('paddingTop')){
      renderWhitePadding = { top: foregroundAsset.get('paddingTop'), right: foregroundAsset.get('paddingRight'), bottom: foregroundAsset.get('paddingBottom'), left: foregroundAsset.get('paddingLeft') };
      renderInnerWhitePadding = { top: foregroundAsset.get('innerPaddingTop'), right: foregroundAsset.get('innerPaddingRight'), bottom: foregroundAsset.get('innerPaddingBottom'), left: foregroundAsset.get('innerPaddingLeft') };
    }else{
      renderWhitePadding = { top: 25, right: 25, bottom: 25, left: 25 };
      renderInnerWhitePadding = { top: 100, right: 100, bottom: 100, left: 100 };
    }

  }
  return {
    renderFrameBorderSize,
    renderWhitePadding,
    renderInnerWhitePadding
  };
};

export const getRenderCanvasMirrorParams = (settings, ratio, parameters, renderCanvasProps, renderSheetSize, renderBgSize) => {
  const product = settings.get('product');
  if (product !== productTypes.canvas) return null;
  const canvasBorder = settings.get('canvasBorder');
  const bleed = parameters.get('bleed');
  const frameBaseSize = parameters.get('frameBaseSize');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  const pagePosition = {
    x: get(renderCanvasProps, 'renderContainerProps.x') + get(renderSheetSize, 'sheet.left') + get(renderSheetSize, 'container.left'),
    y: get(renderCanvasProps, 'renderContainerProps.y') + get(renderSheetSize, 'sheet.top') + get(renderSheetSize, 'container.top')
  };
  const topMirrorCropParams = {
    x: ((bleed.get('left') + canvasBorderThickness.get('left')) * ratio) + pagePosition.x,
    width: frameBaseSize.get('width') * ratio + 5,
    height: canvasBorderThickness.get('right') * ratio
  };
  const topMirrorPositionParams = {
    x: renderBgSize.left,
    y: Math.ceil(renderBgSize.top),
    offsetX: 0,
    offsetY: 0,
    scaleY: canvasBorderShowRatio,
    skewX: -1
  };
  const rightMirrorCropParams = {
    y: ((bleed.get('top') + canvasBorderThickness.get('top')) * ratio) + pagePosition.y,
    width: canvasBorderThickness.get('right') * ratio,
    height: frameBaseSize.get('height') * ratio + 5
  };
  const rightMirrorPositionParams = {
    x: Math.floor(renderBgSize.left + (frameBaseSize.get('width') * ratio)),
    y: renderBgSize.top,
    offsetX: 0,
    offsetY: 0,
    scaleX: canvasBorderShowRatio,
    skewY: -1
  };
  if (canvasBorder === canvasBorderTypes.image) {
    topMirrorCropParams.y = (bleed.get('top') * ratio) + pagePosition.y;
    topMirrorPositionParams.y = renderBgSize.top - (canvasBorderThickness.get('top') * ratio * canvasBorderShowRatio);
    topMirrorPositionParams.offsetX = -canvasBorderThickness.get('top') * ratio * canvasBorderShowRatio;
    rightMirrorCropParams.x = ((bleed.get('left') + canvasBorderThickness.get('left') + frameBaseSize.get('width')) * ratio) + pagePosition.x;
  } else {
    topMirrorCropParams.y = ((bleed.get('top') + canvasBorderThickness.get('top')) * ratio) + pagePosition.y;
    topMirrorPositionParams.scaleY = -(canvasBorderShowRatio + 0.03);
    rightMirrorCropParams.x = ((bleed.get('left') + canvasBorderThickness.get('left') + frameBaseSize.get('width') - canvasBorderThickness.get('right')) * ratio) + pagePosition.x;
    rightMirrorPositionParams.x = ((canvasBorderThickness.get('right') * (canvasBorderShowRatio + 0.03)) * ratio) + Math.ceil(renderBgSize.left + (frameBaseSize.get('width') * ratio));
    rightMirrorPositionParams.scaleX = -(canvasBorderShowRatio + 0.03);
    rightMirrorPositionParams.offsetY = ((canvasBorderThickness.get('right') * (canvasBorderShowRatio + 0.03)) * ratio);
  }
  return {
    topMirrorCropParams,
    rightMirrorCropParams,
    topMirrorPositionParams,
    rightMirrorPositionParams
  };
};

/**
 * 计算渲染到页面上后, 乘以ratio后的实际值.
 */
export const getRenderSize = (settings, ratios, parameters, variables, isPreview = false, isScreenShot = false) => {
  // 获取 baseSize 的大小.
  const frameBaseSize = parameters.get('frameBaseSize');
  if (!frameBaseSize || !variables.size) return {};
  const boardInFrame = parameters.get('boardInFrame');
  const floatBgSize = parameters.get('floatBgSize');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  const bgParams = getBgParams(frameBaseSize, parameters, settings);
  const ratio = isPreview
    ? ratios.get('previewWorkspace')
    : ratios.get('workspace');
  const baseSize = {
    width: frameBaseSize.get('width'),
    height: frameBaseSize.get('height')
  };
  const renderBaseSize = {
    width: (frameBaseSize.get('width') * ratio),
    height: (frameBaseSize.get('height') * ratio)
  };
  const renderCanvasBorderThickness = {
    left: canvasBorderThickness.get('left') * ratio,
    right: canvasBorderThickness.get('right') * ratio,
    top: canvasBorderThickness.get('top') * ratio,
    bottom: canvasBorderThickness.get('bottom') * ratio
  };
  // const renderBgSize = !ratios.get('workspace') ? bgParams : {
  //   width: Math.floor(bgParams.width * ratio),
  //   height: Math.floor(bgParams.height * ratio)
  // };

  const renderEffectCornerSize = getRenderEffectCornerSize(settings, ratio, parameters, variables);
  const renderFrameBorderSize = renderEffectCornerSize.renderFrameBorderSize;

  const renderBoardInFrameSize = {
    left: boardInFrame.get('left') * ratio,
    top: boardInFrame.get('top') * ratio,
    right: boardInFrame.get('right') * ratio,
    bottom: boardInFrame.get('bottom') * ratio
  };
  const renderFloatBgSize = {
    top: floatBgSize.get('top') * ratio,
    right: floatBgSize.get('right') * ratio,
    bottom: floatBgSize.get('bottom') * ratio,
    left: floatBgSize.get('left') * ratio
  };
  const frameBorderInnerSize = {
    width: baseSize.width - boardInFrame.get('left') - boardInFrame.get('right'),
    height: baseSize.height - boardInFrame.get('top') - boardInFrame.get('bottom')
  };

  const renderFrameBorderInnerSize = {
    width: Math.floor(frameBorderInnerSize.width * ratio),
    height: Math.floor(frameBorderInnerSize.height * ratio)
  };
  const renderWhitePadding = renderEffectCornerSize.renderWhitePadding;

  const renderInnerWhitePadding = renderEffectCornerSize.renderInnerWhitePadding;

  const renderBgSize = getRenderBackgroundSize(renderFrameBorderSize, renderFrameBorderInnerSize, renderWhitePadding, renderBoardInFrameSize);

  // 渲染book时, sheet的实际大小.
  const renderSheetSize = getRenderSheetSize(frameBaseSize, parameters.toJS(), ratio, renderBgSize);
  const renderMatteImgSize = getRenderMatteSize(parameters.toJS(), ratio);
  const renderCanvasProps = getRenderCanvasProps(renderBgSize, renderWhitePadding, isPreview, isScreenShot);
  const product = settings.get('product');
  if (product === 'table_metalCube' && !isScreenShot) {
    renderCanvasProps.renderContainerProps.y += 130 * ratio;
  }
  const renderCanvasMirrorParams = getRenderCanvasMirrorParams(settings, ratio, parameters, renderCanvasProps, renderSheetSize, renderBgSize);
  const renderMatteProps = {
    width: renderBaseSize.width,
    height: renderBaseSize.height,
    x: (renderBgSize.left),
    y: (renderBgSize.top)
  };

  const bleed = parameters.get('bleed');
  const renderBleedSize = {
    top: bleed.get('top') * ratio,
    right: bleed.get('right') * ratio,
    bottom: bleed.get('bottom') * ratio,
    left: bleed.get('left') * ratio
  };
  const obj = {
    baseSize,
    bgParams,
    renderBleedSize,
    frameBorderInnerSize,
    renderBgSize,
    renderBaseSize,
    renderFrameBorderSize,
    renderFrameBorderInnerSize,
    renderMatteProps,
    renderFloatBgSize,
    renderWhitePadding,
    renderBoardInFrameSize,
    renderInnerWhitePadding,
    renderCanvasMirrorParams,
    renderCanvasBorderThickness,
    renderOutMatteSize: renderMatteImgSize.renderOutMatteSize,
    renderMatteSize: renderMatteImgSize.renderMatteSize,
    renderInnerMatteSize: renderMatteImgSize.renderInnerMatteSize,
    renderStageProps: renderCanvasProps.renderStageProps,
    renderContainerProps: renderCanvasProps.renderContainerProps,
    renderSheetSize: renderSheetSize.container,
    renderSheetSizeWithoutBleed: renderSheetSize.sheet
  };
  return obj;
};


