import { fromJS } from 'immutable';
import { merge, get } from 'lodash';
import * as types from '../../contants/actionTypes';
import { GET_THEME_TYPES_LIST } from '../../contants/apiUrl';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = fromJS([]);

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_THEME_TYPES_LIST: {
          const { response } = action;
          const status = get(response, 'status');
          const dataObj = get(response, 'data') || [];

          if (status === 'success') {
            const list = convertObjIn(dataObj);

            const newState = state.merge(fromJS(list));

            // 根据ordering从小到大排序.
            return newState.sort(
              (first, second) => first.get('ordering') - second.get('ordering')
            );
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
