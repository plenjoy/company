import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const initialState = fromJS({
  width: 355,
  count: 4,
  isViewRending: false
});


const viewProperties = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_VIEW_PROPERTIES_OF_BOOK_SHEET: {
      const { width, count } = action;

      return state.merge({ width, count });
    }
    case types.SHOW_VIEW_IS_RENDING: {
      return state.merge({
        isViewRending: true
      });
    }

    case types.HIDE_VIEW_IS_RENDING: {
      return state.merge({
        isViewRending: false
      });
    }
    default:
      return state;
  }
};

export default viewProperties;
