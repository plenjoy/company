import Immutable from 'immutable';

import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = Immutable.Map({
  isOrdered: false,
  isCheckFailed: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.GET_PROJECT_ORDERED_STATUS: {
          const { response } = action;
          const { resultData } = response;

          const fixedResult = convertObjIn(resultData);
          return state.merge({
            isOrdered: fixedResult.ordered,
            isCheckFailed: fixedResult.checkFailed
          });
        }
        default:
          return state;
      }
    }
    case types.CLEAR_ORDER_INFO: {
      return initialState;
    }
    default:
      return state;
  }
};
