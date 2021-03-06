import { CHANGE_TAB_IN_SIDEBAR,CHANGE_FILTER_PHOTO_TAB } from '../../../constants/actionTypes';

/**
 * 切换选项卡
 * @param {number} tabIndex 选项卡的索引.
 */
export function changeTab(tabIndex) {
  return {
    type: CHANGE_TAB_IN_SIDEBAR,
    tabIndex
  };
}

export function changeManagePhotoFilterPhotoTab(tabIndex) {
  return {
    type: CHANGE_FILTER_PHOTO_TAB,
    tabIndex
  };
}

