import { get } from 'lodash';
import { getSize } from '../../../common/utils/helper';
import { ratioTypes, percent, pageNumPerRow, innerPageHeightShowRatio, productTypes } from '../constants/strings';
import { computedWorkSpaceRatio } from './screen';

/* ---------private functions----------*/
const computedWorkSpaceRatioForArrangePages = (spreadSize, productType) => {
  let ratio = 0;
  // const pageNum = pageNumPerRow[productType];
  const screenWidth = getSize().width;
  const idealWidth = 356 + 20;
  const availableWidth = screenWidth - 20 * 2;
  const idealPageNum =  Math.round(availableWidth / idealWidth);
  let pageWidth = Math.floor((screenWidth - 20 * 2 - (idealPageNum - 1) * 20 - 20) / idealPageNum);
  // const pageWidth = Math.floor((screenWidth - 30 * 2 - (pageNum - 1) * 20 - 20) / pageNum);
  // const checkedPageWidth = pageWidth < 200
  //   ? 200
  //   : pageWidth > 400
  //     ? 400
  //     : pageWidth;
  if (availableWidth <= 400) {
    pageWidth = 360;
  }
  if (spreadSize && spreadSize.width) {
    ratio = pageWidth / Math.max(spreadSize.width, spreadSize.height);
  }
  // if (spreadSize && spreadSize.width) {
  //   ratio = checkedPageWidth / spreadSize.width;
  // }

  return ratio;

};

/* ---------private functions----------*/
const computedWorkSpaceRatioForUpgrade = (spreadSize, isLandscapeShape = false) => {
  let ratio = 0;
  const checkedPageWidth = isLandscapeShape ? 200 : 123;

  if (spreadSize && spreadSize.width) {
    ratio = checkedPageWidth / spreadSize.width;
  }

  return ratio;
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const updateWorkspaceRatio = (boundRatioActions, size, offset, productType) => {
  const { top = 130, right = 0, bottom = 150, left = 320 } = offset || {};
  const coverWorkspaceRatio = computedWorkSpaceRatio(size.coverBgParams, {
    top,
    right,
    bottom,
    left
  }, percent.lg);

  const suitInnerBgParams = {
    width: size.innerBgParams.width,
    height: size.innerBgParams.height * innerPageHeightShowRatio[productType]
  };
  const innerWorkspaceRatio = computedWorkSpaceRatio(suitInnerBgParams, {
    top,
    right,
    bottom,
    left
  }, percent.lg);

  const innerWorkspaceRatioLandscape = computedWorkSpaceRatio(size.innerBgParamsLandscape, {
    top,
    right,
    bottom,
    left
  }, percent.lg);

  // 计算在 all pages上每一个sheet的ratio.
  const coverWorkspaceRatioForArrangePages = computedWorkSpaceRatioForArrangePages(size.allPageCoverBgParams, productType);
  const innerWorkspaceRatioForArrangePages = computedWorkSpaceRatioForArrangePages(size.allPageInnerBgParams, productType);

  const coverWorkspaceRatioForUpgrade = computedWorkSpaceRatioForUpgrade(size.allPageCoverBgParams);
  const innerWorkspaceRatioForUpgrade = computedWorkSpaceRatioForUpgrade(size.allPageInnerBgParams);
  const innerWorkspaceRatioForUpgradeLandscape = computedWorkSpaceRatioForUpgrade(size.innerBgParamsLandscape, true);

  // 更新workspace和preview的ratio
  boundRatioActions.updateRatio([
    { type: ratioTypes.coverWorkspace, ratio: coverWorkspaceRatio },
    { type: ratioTypes.innerWorkspace, ratio: innerWorkspaceRatio },
    { type: ratioTypes.innerWorkspaceLandscape, ratio: innerWorkspaceRatioLandscape},

    { type: ratioTypes.coverWorkspaceForArrangePages, ratio: coverWorkspaceRatioForArrangePages },
    { type: ratioTypes.innerWorkspaceForArrangePages, ratio: innerWorkspaceRatioForArrangePages },

    { type: ratioTypes.coverWorkspaceForUpgrade, ratio: coverWorkspaceRatioForUpgrade },
    { type: ratioTypes.innerWorkspaceForUpgrade, ratio: innerWorkspaceRatioForUpgrade },
    { type: ratioTypes.innerWorkspaceForUpgradeLandscape, ratio: innerWorkspaceRatioForUpgradeLandscape }
  ]);
};

/* ---------end--------------------*/
/**
 * 计算workspace的偏移量.
 * @param  {string} productSize 产品的尺寸: 8x8
 * @param  {Number} panelStep 编辑区域下方的panel的状态: 0/1
 * @return {object} {top, right, bottom, left}
 */
export const computedWorkSpaceOffset = (productType, isCover) => {
  // 定义一个默认的值.
  let top = 150;
  let right = 40;
  let left = 320;
  let bottom = 130;

  switch (productType) {
    case productTypes.WC: {
      top = isCover ? 100 : 77;
      bottom = isCover ? 150 : 130;
      break;
    }
    case productTypes.DC: {
      top = 100;
      bottom = 180;
      break;
    }
    case productTypes.LC: {
      top = 100;
      bottom = 180;
      break;
    }
    default: {
      break;
    }
  }

  return { top, right, bottom, left };
};
