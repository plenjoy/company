import { get } from 'lodash';
import { getSize } from '../../../common/utils/helper';
import { ratioType, percent, smallViewWidthInArrangePages } from '../contants/strings';
import { computedWorkSpaceRatio, computedScreeRatio } from './screen';
import { checkBookSize } from './bookShape';
import { bookShapeTypes, arrangePageRules } from '../contants/strings';
import { getArrangePageViewSize } from '../utils/sizeCalculator';

/* ---------private functions----------*/
const computedWorkSpaceRatioForArrangePages = (spreadSize) => {
  let ratio = 0;
  if (spreadSize && spreadSize.width) {
    ratio = getArrangePageViewSize().width / spreadSize.width;
    // ratio = smallViewWidthInArrangePages / spreadSize.width;
  }

  return ratio;
};

/* ---------end--------------------*/
/**
 * 计算workspace的偏移量.
 * @param  {string} productSize 产品的尺寸: 8x8
 * @param  {Number} panelStep 编辑区域下方的panel的状态: 0/1
 * @return {object} {top, right, bottom, left}
 */
export const computedWorkSpaceOffset = (productSize, panelStep = 1, isAdvancedMode = false) => {
  // 定义一个默认的值.
  let top = 150;
  let right = 0;
  let bottom = 180;
  let left = 320;

  // 判断当前的书是landscape/square/portrait
  const { type, width, height } = checkBookSize(productSize);
  const small = width < 8 || height < 8;

  if (isAdvancedMode) {
    switch (panelStep) {
      case 0: {
        switch (type) {
          case bookShapeTypes.square: {
            top = small ? 240 : 220;
            right = small ? 100 : 100;
            bottom = small ? 80 : 60;
            left = small ? 320 : 320;

            break;
          }
          case bookShapeTypes.portrait: {
            top = 200;
            right = 0;
            bottom = 110;
            left = 320;

            break;
          }
          case bookShapeTypes.landscape: {
            top = 100;
            right = 130;
            bottom = 0;
            left = 280;

            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case 1: {
        switch (type) {
          case bookShapeTypes.square: {
            top = small ? 200 : 200;
            right = small ? 100 : 50;
            bottom = small ? 220 : 180;
            left = small ? 320 : 320;
            break;
          }
          case bookShapeTypes.portrait: {
            top = 200;
            right = 0;
            bottom = 200;
            left = 320;
            break;
          }
          case bookShapeTypes.landscape: {
            top = 100;
            right = 130;
            bottom = 0;
            left = 280;

            break;
          }
          default: {
            break;
          }
        }
      }
      default: {
        break;
      }
    }
  } else {
    switch (panelStep) {
      case 0: {
        switch (type) {
          case bookShapeTypes.square: {
            top = 100;
            right = 50;
            bottom = 40;
            left = 250;

            break;
          }
          case bookShapeTypes.portrait: {
            top = 160;
            right = 0;
            bottom = 80;
            left = 320;

            break;
          }
          case bookShapeTypes.landscape: {
            top = 0;
            right = 80;
            bottom = 0;
            left = 230;

            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case 1: {
        switch (type) {
          case bookShapeTypes.square: {
            top = 140;
            right = 0;
            bottom = 190;
            left = 320;
            break;
          }
          case bookShapeTypes.portrait: {
            top = 160;
            right = 0;
            bottom = 170;
            left = 320;
            break;
          }
          case bookShapeTypes.landscape: {
            top = 0;
            right = 80;
            bottom = 0;
            left = 240;
            break;
          }
          default: {
            break;
          }
        }
      }
      default: {
        break;
      }
    }
  }

  return { top, right, bottom, left };
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const updateWorkspaceRatio = (boundRatioActions, size, offset) => {
  const { top = 130, right = 0, bottom = 150, left = 320 } = offset || {};
  const coverWorkspaceRatio = computedWorkSpaceRatio(size.coverSpreadSize, {
    top,
    right,
    bottom,
    left
  }, percent.lg);

  const innerWorkspaceRatio = computedWorkSpaceRatio(size.innerSpreadSize, {
    top,
    right,
    bottom,
    left
  }, percent.lg);

  // 计算在arrange pages上每一个sheet的ratio.
  const coverWorkspaceRatioForArrangePages = computedWorkSpaceRatioForArrangePages(size.coverSpreadSize);
  const innerWorkspaceRatioForArrangePages = computedWorkSpaceRatioForArrangePages(size.innerSpreadSize);

  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioType.coverWorkspace, ratio: coverWorkspaceRatio },
    { type: ratioType.innerWorkspace, ratio: innerWorkspaceRatio },

    { type: ratioType.coverWorkspaceForArrangePages, ratio: coverWorkspaceRatioForArrangePages },
    { type: ratioType.innerWorkspaceForArrangePages, ratio: innerWorkspaceRatioForArrangePages }
  ]);
};

export const computedPreviewWorkSpaceOffset = (productSize) => {
  let top = 0;
  let right = 0;
  let bottom = 0;
  let left = 0;

  // 判断当前的书是landscape/square/portrait
  const { type, width, height } = checkBookSize(productSize);
  const small = width < 8 || height < 8;

  // 屏幕的size
  const windowSize = getSize();

  switch (type) {
    case bookShapeTypes.square: {
      top = 20;
      right = 30;
      bottom = 60;
      left = 30;
      break;
    }
    case bookShapeTypes.portrait: {
      top = 50;
      right = 0;
      bottom = 60;
      left = 0;
      break;
    }
    case bookShapeTypes.landscape: {
      top = 0;
      right = 30;
      bottom = 60;
      left = 30;
      break;
    }
    default: {
      break;
    }
  }

  return { top, right, bottom, left };
};

