import { fromJS } from 'immutable';
import { createNewElement } from '../element';
import { elementTypes, spineTextInfo, innerTextInfo } from '../../constants/strings';

export function getCaptionTextSize(
  innerPageSize,
  widthWithBleed,
  isLeft,
  isWholePageCaption
) {
  let innerTextTop = 0;
  let innerTextLeft = 0;
  let height = 0;

  if(isWholePageCaption) {
    if(isLeft) {
      innerTextTop = innerPageSize.get('leftImageTop');
      innerTextLeft = innerPageSize.get('leftImageLeft');
    } else {
      innerTextTop = innerPageSize.get('rightImageTop');
      innerTextLeft = widthWithBleed / 2 + innerPageSize.get('rightImageLeft');
    }
    height = innerPageSize.get('innerImageHeight');
  } else {
    if(isLeft) {
      innerTextTop = innerPageSize.get('leftImageTop') + innerPageSize.get('innerImageHeight') + innerPageSize.get('imageBottomTextDistance');
      innerTextLeft = innerPageSize.get('leftImageLeft');
    } else {
      innerTextTop = innerPageSize.get('leftImageTop') + innerPageSize.get('innerImageHeight') + innerPageSize.get('imageBottomTextDistance');
      innerTextLeft = widthWithBleed / 2 + innerPageSize.get('rightImageLeft');
    }
    // 文字3行上限
    height = (innerPageSize.get('captionFontSize') + 10) * 3;
  }

  return {
    x: innerTextLeft,
    y: innerTextTop,
    width: innerPageSize.get('innerImageWidth'),
    height,
    fontSize: innerPageSize.get('captionFontSize'),
    ...innerTextInfo,
    textAlign: isWholePageCaption ? 'left' : 'center',
    verticalTextAlign: 'middle',
    isCaption: true
  }
}

/**
 * 
 * @param {*} coverPageSize 
 * @param {*} spineExpanding 
 * @param {*} spineWidth 
 * @param {*} coverBleed 
 * @param {*} widthWithBleed 
 * @param {*} coverWorkspace 
 * @param {*} originalPhoto 
 */
export function getCoverLogoElementSize(
  coverPageSize,
  spineExpanding,
  spineWidth,
  coverBleed,
  widthWithBleed,
  coverWorkspace,
  originalPhoto
) {
  const elementSize = {
    x: (coverPageSize.get('width') -
      spineWidth -
      spineExpanding.get('expandingOverBackcover') -
      spineExpanding.get('expandingOverBackcover')
    ) / 2 / 2 - coverPageSize.get('backCoverLogoWidth') / 2,
    y: coverPageSize.get('height') - coverPageSize.get('backCoverLogoBottom') - coverPageSize.get('backCoverLogoWidth') / 280 * 109,
    width: coverPageSize.get('backCoverLogoWidth'),
    height: coverPageSize.get('backCoverLogoWidth') / 280 * 109
  };

  const elementComputedSize = {
    x: elementSize.x * coverWorkspace,
    y: elementSize.y * coverWorkspace,
    width: elementSize.width * coverWorkspace,
    height: elementSize.height * coverWorkspace
  };

  return createNewElement({
    ...elementSize,
    type: elementTypes.logoElement,
    computedSize: elementComputedSize
  });
}

/**
 * 获取图片上方日期和地点文字的显示尺寸
 * @param {*} innerPageSize 
 * @param {*} widthWithBleed 
 * @param {*} isLeft 
 * @param {*} textAlign 
 */
export function getImageTopTextSize(
  innerPageSize,
  widthWithBleed,
  isLeft,
  textAlign
) {
  let innerTextTop = 0;
  let innerTextLeft = 0;
  let height = 0;

  if(isLeft) {
    innerTextTop = innerPageSize.get('imageTopTextTop');
    innerTextLeft = innerPageSize.get('leftImageLeft');
  } else {
    innerTextTop = innerPageSize.get('imageTopTextTop');
    innerTextLeft = widthWithBleed / 2 + innerPageSize.get('rightImageLeft');
  }

  height = innerPageSize.get('dateLocationTextFontSize') + 10;

  return {
    x: innerTextLeft,
    y: innerTextTop,
    width: innerPageSize.get('innerImageWidth'),
    fontSize: innerPageSize.get('dateLocationTextFontSize'),
    height,
    ...innerTextInfo,
    textAlign,
    isCaption: false
  }
}

/**
 * 生成TextElement的显示尺寸
 * @param {*} elementSize 
 * @param {*} text 
 * @param {*} innerWorkspace 
 * @param {*} urls 
 */
export function getTextElementSize(
  elementSize,
  text,
  innerWorkspace,
  urls,
  isDOMRender
) {
  // 没有高度的为undefined
  const elementComputedSize = {
    x: elementSize.x * innerWorkspace,
    y: elementSize.y * innerWorkspace,
    width: elementSize.width * innerWorkspace,
    height: elementSize.height * innerWorkspace || undefined,
    isDOMRender,
    isCaption: elementSize.isCaption,
    textParams: {
      width: elementSize.width,
      height: elementSize.height,
      fontSize: elementSize.fontSize,
      fontColor: elementSize.fontColor,
      fontFamily: elementSize.fontFamily,
      textAlign: elementSize.textAlign,
      verticalTextAlign: elementSize.verticalTextAlign,
      ratio: innerWorkspace,
      text
    }
  };

  return createNewElement({
    ...elementSize,
    type: elementTypes.textElement,
    computedSize: elementComputedSize
  });
}

/**
 * 获取封面SpineTextElement渲染尺寸
 * @param {*} coverPageSize 
 * @param {*} spineExpanding 
 * @param {*} spineWidth 
 * @param {*} coverBleed 
 * @param {*} widthWithBleed 
 * @param {*} coverWorkspace 
 * @param {*} urls 
 * @param {*} coverPage 
 * @param {*} isHardCover 
 */
export function getCoverSpineTextElementSize(
  coverPageSize,
  spineExpanding,
  spineWidth,
  coverBleed,
  widthWithBleed,
  coverWorkspace,
  urls,
  coverPage,
  isHardCover
) {
  const elementSize = {
    x: coverPageSize.get('spinePaddingTop'),
    // Soft cover的spine text坐标有点误差，Hard cover的没有问题，因此做微调处理
    y: (widthWithBleed - spineWidth + (!isHardCover ? -10 : 0)) / 2,
    width: coverPageSize.get('height') - coverPageSize.get('spinePaddingTop') - coverPageSize.get('spinePaddingBottom'),
    height: spineWidth
  };

  const elementComputedSize = {
    x: elementSize.x * coverWorkspace,
    y: elementSize.y * coverWorkspace,
    width: elementSize.width * coverWorkspace,
    height: elementSize.height * coverWorkspace,
    spineLogoSize: coverPageSize.get('spineLogoSize') * coverWorkspace,
    spineLogoTextDistance: coverPageSize.get('spineLogoTextDistance') * coverWorkspace,
    spineUsername: {
      width: elementSize.width,
      height: elementSize.height,
      fontSize: coverPageSize.get('spineTextFontSize'),
      fontColor: spineTextInfo.fontColor,
      fontFamily: spineTextInfo.fontFamily,
      textAlign: spineTextInfo.textAlign,
      verticalTextAlign: spineTextInfo.verticalTextAlign,
      text: coverPage.get('spineUserName'),
      ratio: coverWorkspace
    },
    spineDate: {
      width: elementSize.width,
      height: elementSize.height,
      fontSize: coverPageSize.get('spineTextFontSize'),
      fontColor: spineTextInfo.fontColor,
      fontFamily: spineTextInfo.fontFamily,
      textAlign: spineTextInfo.textAlign,
      verticalTextAlign: spineTextInfo.verticalTextAlign,
      text: coverPage.get('spineText'),
      ratio: coverWorkspace
    }
  };

  return createNewElement({
    ...elementSize,
    type: elementTypes.spineTextElement,
    computedSize: elementComputedSize
  });
}

/**
 * 获取封面PhotoElement渲染尺寸
 * @param {*} coverPageSize 
 * @param {*} spineExpanding 
 * @param {*} spineWidth 
 * @param {*} coverBleed 
 * @param {*} widthWithBleed 
 * @param {*} coverWorkspace 
 * @param {*} originalPhoto 
 */
export function getCoverPhotoElementSize(
  coverPageSize,
  spineExpanding,
  spineWidth,
  coverBleed,
  widthWithBleed,
  coverWorkspace,
  originalPhoto,
  isHardCover
) {
  const elementSize = {
    x: (widthWithBleed - spineWidth) / 2 + spineWidth + spineExpanding.get('expandingOverBackcover') + coverPageSize.get('coverImageLeft'),
    y: coverPageSize.get('coverImageTop'),
    width: coverPageSize.get('coverImageWidth'),
    height: coverPageSize.get('coverImageHeight')
  };

  // ASH-5919: 如果是HC，则做一定的偏移，使图片居中（原因spec参数不准）
  if(isHardCover) {
    const widthOffset = 288;
    const HeightOffset = 360;
    elementSize.x -= widthOffset / 2.5;
    elementSize.y -= HeightOffset / 2;
    elementSize.width += widthOffset;
    elementSize.height += HeightOffset;
  }

  const elementComputedSize = {
    x: elementSize.x * coverWorkspace,
    y: elementSize.y * coverWorkspace,
    width: elementSize.width * coverWorkspace,
    height: elementSize.height * coverWorkspace,
    photoSize: getPhotoSize(elementSize.width, elementSize.height, originalPhoto, coverWorkspace)
  };

  return createNewElement({
    ...elementSize,
    computedSize: elementComputedSize
  });
};

/**
 * 获取内页PhotoElement渲染尺寸
 * @param {*} innerPageSize 
 * @param {*} innerBleed 
 * @param {*} widthWithBleed 
 * @param {*} innerWorkspace 
 * @param {*} originalPhoto 
 * @param {*} isLeft 
 */
export function getInnerPhotoElementSize(
  innerPageSize,
  innerBleed,
  widthWithBleed,
  innerWorkspace,
  originalPhoto,
  isLeft,
  pageIdx
) {
  let innerImageLeft = 0;
  let innerImageTop = 0;

  if(isLeft) {
    innerImageLeft = innerPageSize.get('leftImageLeft');
    innerImageTop = innerPageSize.get('leftImageTop');
  } else {
    innerImageLeft = widthWithBleed / 2 + innerPageSize.get('rightImageLeft');
    innerImageTop = innerPageSize.get('rightImageTop');
  }

  const elementSize = {
    x: innerImageLeft,
    y: innerImageTop,
    width: innerPageSize.get('innerImageWidth'),
    height: innerPageSize.get('innerImageHeight'),
    isLeft
  };

  const elementComputedSize = {
    x: elementSize.x * innerWorkspace,
    y: elementSize.y * innerWorkspace,
    width: elementSize.width * innerWorkspace,
    height: elementSize.height * innerWorkspace,
    photoSize: getPhotoSize(elementSize.width, elementSize.height, originalPhoto, innerWorkspace)
  };

  return createNewElement({
    ...elementSize,
    computedSize: elementComputedSize
  });
};

/**
 * 获取PhotoElement中图片的渲染尺寸
 * @param {*} containerWidth 
 * @param {*} containerHeight 
 * @param {*} originalPhoto 
 * @param {*} workspace 
 */
function getPhotoSize(containerWidth, containerHeight, originalPhoto, workspace) {

  let thumbnail = originalPhoto.get('thumbnail');
  if(thumbnail.get('width') / thumbnail.get('height') >= containerWidth / containerHeight) {
    const ratio = containerWidth / thumbnail.get('width');

    thumbnail = thumbnail.set('width', containerWidth);
    thumbnail = thumbnail.set('height', thumbnail.get('height') * ratio);
  } else {
    const ratio = containerHeight / thumbnail.get('height');

    thumbnail = thumbnail.set('height', containerHeight);
    thumbnail = thumbnail.set('width', thumbnail.get('width') * ratio);
  }

  return {
    x: (containerWidth / 2 - thumbnail.get('width') / 2) * workspace,
    y: (containerHeight / 2 - thumbnail.get('height') / 2) * workspace,
    width: thumbnail.get('width') * workspace,
    height: thumbnail.get('height') * workspace,
    url: thumbnail.get('url')
  }
}