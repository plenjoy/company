import { get } from 'lodash';
import { ratioType, percent } from '../contants/strings';
import { computedWorkSpaceRatio, computedScreeRatio } from './screen';
import { checkBookShapeType } from './bookShape';
import { bookShapeTypes } from '../contants/strings';
import { getArrangePageViewSize } from './sizeCalculator';

/* ---------private functions----------*/
const computedWorkSpaceRatioForArrangePages = (spreadSize) => {
  let ratio = 0;
  if (spreadSize && spreadSize.width) {
    ratio = getArrangePageViewSize().width / spreadSize.width;
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
export const computedWorkSpaceOffset = (productSize, panelStep = 1) => {
  // 定义一个默认的值.
  let top = 150;
  let right = 0;
  let bottom = 180;
  let left = 320;

  // 判断当前的书是landscape/square/portrait
  const bookShapeType = checkBookShapeType(productSize);
  switch (panelStep) {
    case 0: {
      switch (bookShapeType) {
        case bookShapeTypes.square: {
          top = 150;
          right = 0;
          bottom = 40;
          left = 280;

          break;
        }
        case bookShapeTypes.portrait: {
          top = 150;
          right = 0;
          bottom = 60;
          left = 320;

          break;
        }
        case bookShapeTypes.landscape: {
          top = 100;
          right = 0;
          bottom = 130;
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
      switch (bookShapeType) {
        case bookShapeTypes.square: {
          top = 100;
          right = 80;
          bottom = 220;
          left = 280;
          break;
        }
        case bookShapeTypes.portrait: {
          top = 150;
          right = 0;
          bottom = 160;
          left = 320;
          break;
        }
        case bookShapeTypes.landscape: {
          top = 100;
          right = 80;
          bottom = 220;
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
