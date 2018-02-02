import { SWITCH_SHEET, SWITCH_PAGE , SNAP_COVER , UPDATE_COVER_SNAP } from '../contants/actionTypes';
import { toCanvas } from '../../src/utils/snippingHelper';
import { get } from 'lodash';
/**
 * 翻页.
 */
export function switchSheet(sheetIndex) {
  return (dispatch,getState) => {
    if(sheetIndex===1){
      const bookCoverNode = document.querySelector('.box-cover');
      toCanvas(bookCoverNode, 300, null).then(data => {
        if (data) {

          dispatch({
            type: UPDATE_COVER_SNAP,
            coverSnapData:data.replace('data:image/png;base64,', '')
          });
          
        }
      });
    }
    dispatch({
      type: SWITCH_SHEET,
      index: sheetIndex
    });

    return Promise.resolve();
  };
}

/**
 * 翻页.
 */
export function switchPage(pageIndex, pageId) {
  return (dispatch) => {
    dispatch({
      type: SWITCH_PAGE,
      index: pageIndex,
      id: pageId
    });
    return Promise.resolve();
  };
}
