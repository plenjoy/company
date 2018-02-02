import { Map } from 'immutable';
import {
  API_SUCCESS,
  CHANGE_PROJECT_SETTING
} from '../../../contants/actionTypes';
import { convertObjIn } from '../../../../../common/utils/typeConverter';
import { GET_COUPON_DETAIL } from '../../../contants/apiUrl';

const initialState = Map({});

const coupon = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_COUPON_DETAIL:
          const { response } = action;
          if (response) {
            return state.merge(convertObjIn(response.data));
          }
          return state;
        default:
          return state;
      }
    default:
      return state;
  }
};

export default coupon;
