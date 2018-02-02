import { fromJS } from 'immutable';
import { merge, get } from 'lodash';
import * as types from '../../contants/actionTypes';
import { GET_THEME_TYPES_LIST, CHOSE_THEME_ITEM } from '../../contants/apiUrl';
import { convertObjIn } from '../../../../common/utils/typeConverter';

const initialState = fromJS({});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_THEME_TYPE: {
      return state.merge({
        currentThemeType: action.themeType
      });
    }
    case types.CHOSE_THEME_ITEM: {
      return state.merge({
        choseThemeItemCode: action.choseThemeItemCode
      });
    }
    default: {
      return state;
    }
  }
};
