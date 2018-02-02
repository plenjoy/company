import { merge } from 'lodash';
import { SWITCH_SHEET, SWITCH_PAGE} from '../contants/actionTypes';

const initialState = {
  sheetIndex: 0,
  pageIndex: 0,
  pageId: ''
};

/**
 * 翻页.
 */
const pagination = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_SHEET: {
      const oldSheetIndex = state.sheetIndex;
      if (oldSheetIndex !== action.index) {
        return merge({}, state, {
          sheetIndex: action.index
        });
      }
      return state;
    }
    case SWITCH_PAGE: {
      return merge({}, state, {
        pageIndex: action.index,
        pageId: action.id
      });
    }
    default:
      return state;
  }
};

export default pagination;
