import { fromJS } from 'immutable';
import { get } from 'lodash';
import * as types from '../../contants/actionTypes';
import { GET_THEMES_LIST } from '../../contants/apiUrl';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = fromJS([]);

const getThemeListKey = ({ themeType, product, size }) => {
  return `${themeType}-${product}-${size}`;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_THEMES_LIST: {
          const { response } = action;
          const status = get(response, 'status');
          const dataObj = get(response, 'data') || [];

          if (status === 'success') {
            const list = convertObjIn(dataObj);

            // 根据ordering从小到大排序.
            const newList = fromJS(list).sort((first, second) => first.get('ordering') - second.get('ordering'));

            return fromJS(newList);
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
