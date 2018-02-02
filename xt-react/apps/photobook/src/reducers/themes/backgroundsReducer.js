import { fromJS } from 'immutable';
import { merge, get } from 'lodash';
import * as types from '../../contants/actionTypes';
import { GET_BACKGROUNDS_LIST } from '../../contants/apiUrl';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = fromJS([]);

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_BACKGROUNDS_LIST: {
          const { response } = action;
          const status = get(response, 'status');
          const dataObj = get(response, 'data') || [];

          if (status === 'success') {
            const list = convertObjIn(dataObj);

            return fromJS(list);
          }

          return state;
        }
        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
};
