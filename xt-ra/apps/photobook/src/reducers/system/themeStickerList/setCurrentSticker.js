import { merge } from 'lodash';

import { API_SUCCESS, SET_CURRENT_THEME_TYPE } from '../../../contants/actionTypes';
import { GET_THEME_STICKER_LIST } from '../../../contants/apiUrl';
import { convertObjIn } from '../../../../../common/utils/typeConverter';


const setCurrentSticker = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_THEME_TYPE:
      const { themeType } = action;
      return merge({}, state, { currentThemeType: themeType });

    default:
      return state;
  }
};


export default setCurrentSticker;
