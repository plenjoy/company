import { merge, get, set, pick, forEach, isEmpty } from 'lodash';
import qs from 'qs';
import { API_SUCCESS, CHANGE_PROJECT_SETTING } from '../contants/actionTypes';
import { GET_PRODUCT_PRICE } from '../contants/apiUrl';

const price = (state={},action) => {
  switch (action.type){
    case API_SUCCESS:
      switch (action.apiPattern.name){
        case GET_PRODUCT_PRICE:
          const jsRes = action.response.data;
          return merge({},state,jsRes);
        default:
          return state;
      }
    default:
      return state;
  }
}

export default price;
