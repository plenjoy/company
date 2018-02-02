import { Map } from 'immutable';
import { SWITCH_SHEET, SWITCH_PAGE } from '../../../contants/actionTypes';

const initialState = Map({
  prevSheetIndex: -1,
  prevPageIndex: -1,
  sheetIndex: 0,
  pageIndex: 0,
  pageId: ''
});

/**
 * 翻页.
 */
const pagination = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_SHEET: {
      const oldSheetIndex = state.get('sheetIndex');
      if(oldSheetIndex !== action.index){
        return state.merge({
          prevSheetIndex: oldSheetIndex,
          sheetIndex: action.index
        });
      }
      return state;
    }
    case SWITCH_PAGE: {
      return state.merge({
        prevPageIndex: state.get('pageIndex'),
        pageIndex: action.index,
        pageId: action.id
      });
    }
    default:
      return state;
  }
};

export default pagination;
