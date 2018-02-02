import { template } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import {
  API_BASE,
  GET_ENV,
  GET_SESSION_USER_INFO,
  GET_USER_ALBUM_ID,
  GET_USER_ALBUM_ID_BY_THEME_CDOE,
  HEART_BEAT,
  ADD_ALBUM,
  CHECK_TITLE
} from '../../contants/apiUrl';
import { combine, getUrl } from '../../../../common/utils/url';
import { webClientId } from '../../../../common/utils/strings';
import { getRandomNum } from '../../../../common/utils/math';
import { title } from '../../../../common/utils/querystring';

/**
 * action, 获取环境变量, 如各种api的根路径
 */
export function getEnv() {
  return dispatch => {
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_ENV,
          params: {
            webClientId,
            baseUrl: API_BASE,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

/**
 * action, 获取用户的会话信息
 */
export function getUserInfo() {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SESSION_USER_INFO,
          params: {
            baseUrl,
            webClientId,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

/**
 * action, 获取用户的Album id
 */
export function getAlbumId(userId, projectId) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_USER_ALBUM_ID,
          params: {
            baseUrl,
            userId,
            projectId
          }
        }
      }
    });
  };
}

export function getAlbumIdByThemeCode(userId, themeCode) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_USER_ALBUM_ID_BY_THEME_CDOE,
          params: {
            baseUrl,
            userId,
            albumName: themeCode
          }
        }
      }
    });
  };
}

export function addAlbum(userId, projectTitle, projectId) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: ADD_ALBUM,
          params: {
            baseUrl,
            userId,
            webClientId,
            projectId,
            albumName: projectTitle,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

export function isProjectTitleExists(userId, albumId, projectTitle) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: CHECK_TITLE,
          params: {
            baseUrl,
            userId,
            albumId,
            webClientId,
            albumName: projectTitle,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

export function keepAlive(userId) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: HEART_BEAT,
          params: {
            baseUrl,
            userId
          }
        }
      }
    });
  };
}
