import { get } from 'lodash';
import { getSize, getScreenSize } from '../../../../common/utils/helper';
import { workSpacePrecent, sideBarWidth, spreadTypes, bottomHeight, topHeight } from '../../../contants/strings';

export const getWorkspaceAvailableSize = (pageSize, bgWidth, bgHeight, wsPrecent, coverBackgroundSize, isPreview) => {
  let maxWidth;
  let maxHeight;
  if (isPreview) {
    maxWidth = pageSize.width * wsPrecent;
    maxHeight = pageSize.height - 50 - bottomHeight;
  } else {
    maxWidth = (pageSize.width - sideBarWidth) * wsPrecent;
    maxHeight = pageSize.height - topHeight - bottomHeight;
  }

  const coverBgWidth = get(coverBackgroundSize, 'bgImageWidth');
  const coverBgHeight = get(coverBackgroundSize, 'bgImageHeight');

  if (!(bgWidth && bgHeight && coverBgWidth && coverBgHeight)) {
    return {
      width: maxWidth,
      height: maxHeight
    };
  }

  // 根据workspace的高度, 计算workspace的宽.
  // let width = (maxHeight * bgWidth) / bgHeight;
  // let height = (maxWidth * bgHeight) / bgWidth;
  let width = (maxHeight * coverBgWidth) / coverBgHeight;
  let height = (maxWidth * coverBgHeight) / coverBgWidth;

  // 如果根据最大高度计算出来的宽大于最大宽, 那就使用最大宽.
  if (width > maxWidth) {
    width = maxWidth;
  } else {
    height = maxHeight;
  }

  const outputWidth = height * bgWidth / bgHeight;

  return {
    width: outputWidth,
    height
  };
};

export const initWorkspace = (paginationSpread, coverBackgroundSize, isPreview) => {
  const { backgroundSize } = paginationSpread;
  const pageSize = getSize();
  const wsPrecent = workSpacePrecent.big;
  const bgWidth = get(backgroundSize, 'bgImageWidth');
  const bgHeight = get(backgroundSize, 'bgImageHeight');
  const workspaceSize = getWorkspaceAvailableSize(pageSize, bgWidth, bgHeight, wsPrecent, coverBackgroundSize, isPreview);
  const workspaceWidth = workspaceSize.width;
  const rate = workspaceWidth / bgWidth;
  const left = isPreview
    ? (pageSize.width - workspaceWidth) / 2
    : sideBarWidth + (((pageSize.width - sideBarWidth) - workspaceWidth) / 2);

  return {
    workspaceSize,
    rate,
    left
  };
};
