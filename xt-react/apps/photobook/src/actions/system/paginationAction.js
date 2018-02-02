import { SWITCH_SHEET, SWITCH_PAGE, CLEAR_HISTORY } from '../../contants/actionTypes';

/**
 * 翻页.
 */
export function switchSheet(sheetIndex) {
  return (dispatch, getState) => {
    dispatch({
      type: SWITCH_SHEET,
      index: sheetIndex
    });

    // 清空redo/undo的历史记录.
    dispatch({
      type: CLEAR_HISTORY
    });

    return Promise.resolve();
  };
}

/**
 * 翻页.
 */
export function switchPage(pageIndex, pageId) {
  return (dispatch, getState) => {
    dispatch({
      type: SWITCH_PAGE,
      index: pageIndex,
      id: pageId
    });
    return Promise.resolve();
  };
}
