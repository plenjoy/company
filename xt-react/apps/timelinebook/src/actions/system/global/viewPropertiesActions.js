import * as types from '../../../constants/actionTypes';

/**
 * 更新all pages中每一个booksheet显示时的宽高, 以及每一行显示的个数.
 */
export function updateViewPropertiesOfBookSheet(data) {
  const { width, count } = data;

  return {
    type: types.UPDATE_VIEW_PROPERTIES_OF_BOOK_SHEET,
    width,
    count
  };
}

export function showViewIsRending() {
  return {
    type: types.SHOW_VIEW_IS_RENDING
  }
}

export function hideViewIsRending() {
  return {
    type: types.HIDE_VIEW_IS_RENDING
  }
}