import { Map } from 'immutable';
import { API_SUCCESS } from '../../../constants/actionTypes';
import { convertObjIn } from '../../../../../common/utils/typeConverter';
import { GET_PRODUCT_PRICE } from '../../../constants/apiUrl';

const initialState = Map({});

const price = (state=initialState, action) => {
  switch (action.type){
    case API_SUCCESS:
      switch (action.apiPattern.name){
        case GET_PRODUCT_PRICE:
          const { response } = action;
          return state.merge(convertObjIn(response.data));
        default:
          return state;
      }
    default:
      return state;
  }
}

export default price;
