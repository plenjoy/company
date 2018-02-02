import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_THEME_STICKER_LIST } from '../../contants/apiUrl';
import { SET_CURRENT_THEME_TYPE } from '../../contants/actionTypes';

export function getThemeStickerList(themeType, themeGuid) {
  return (dispatch, getState) => {
    const productBaseURL = get(getState(), 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_THEME_STICKER_LIST,
          params: {
            productBaseURL,
            pageNumber: 1,
            pageSize:1000,
            themeType,
            themeGuid
          }
        }
      }
    });
  };
}

export function setCurrentThemeType(themeType) {
 return {
    type: SET_CURRENT_THEME_TYPE,
    themeType
  };
}
