import qs from 'qs';
import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import {
  GET_THEME_TYPES_LIST,
  GET_THEMES_LIST,
  GET_TYPECODE_BY_THEMEID,
  GET_BACKGROUNDS_LIST,
  GET_BOOKTHEME_STATUS,
  GET_RELATED_BOOKTHEME
} from '../../contants/apiUrl';
import * as types from '../../contants/actionTypes';
import { getDataFromState } from '../../utils/getDataFromState';

export const getThemeCategories = () => {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_THEME_TYPES_LIST,
          params: {
            baseUrl,
            autoRandomNum: new Date().getTime()
          }
        }
      }
    });
  };
};

export const getBackgrounds = ({
  themeGuid,
  pageNumber = 1,
  pageSize = 100
}) => {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_BACKGROUNDS_LIST,
          params: {
            baseUrl,
            themeGuid,
            pageNumber,
            pageSize,
            autoRandomNum: new Date().getTime()
          }
        }
      }
    });
  };
};

export const getThemes = ({
  themeType,
  product,
  size,
  pageNumber = 1,
  pageSize = 100
}) => {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_THEMES_LIST,
          params: {
            baseUrl,
            themeType,
            product,
            size,
            pageNumber,
            pageSize,
            autoRandomNum: new Date().getTime()
          }
        }
      }
    });
  };
};

export const setThemeType = themeType => {
  return (dispatch, getState) => {
    return dispatch({
      type: types.SET_THEME_TYPE,
      themeType
    });
  };
};

export const getTypecodeByThemeid = themeId => {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TYPECODE_BY_THEMEID,
          params: {
            baseUrl,
            themeId
          }
        }
      }
    });
  };
};

export const choseThemeItem = choseThemeItemCode => {
  return (dispatch, getState) => {
    return dispatch({
      type: types.CHOSE_THEME_ITEM,
      choseThemeItemCode
    });
  };
};

export const getBookThemeStatus = () => {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_BOOKTHEME_STATUS,
          params: {
            baseUrl
          }
        }
      }
    });
  };
};

export const getRelatedBooktheme = () => {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, setting } = stateData;
    const baseUrl = urls.get('baseUrl');

    const guid = property.get('applyBookThemeId');
    const size = setting.get('size');
    const product = setting.get('product');

    if (guid && size && product) {
      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_RELATED_BOOKTHEME,
            params: {
              baseUrl,
              guid,
              size,
              product
            }
          }
        }
      });
    }

    return Promise.resolve();
  };
};
