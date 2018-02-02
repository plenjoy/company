import { get, set } from 'lodash';
import { API_SUCCESS } from '../contants/actionTypes';
import {
  LOGIN,
  GET_SESSION_USER_INFO,
  GET_USER_ALBUM_ID,
  ADD_ALBUM
} from '../contants/apiUrl';
import securityString from '../../../common/utils/securityString';
import { convertObjIn } from '../../common/utils/typeConverter';

const sKey = 'COOKIES_IN_STORAGE';
const uKey = 'USERINFO_IN_STORAGE';

/**
 * 设置cookie
 * @param data
 */
const setCookie = data => {
  document.cookie = data;
};

/**
 * 把cookie数组保存到localstorage
 * @param data
 */
const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));

  // 设置cookie
  // if (data && data.length) {
  //   setCookie(data[data.length - 1]['Set-Cookie']);
  // }
};

/**
 * 从localstorage中获取上次的cookie
 * @returns {Array}
 */
const getInitCookies = () => {
  const result = localStorage.getItem(sKey);

  if (result) {
    const data = JSON.parse(result);
    data.forEach(v => setCookie(v['Set-Cookie']));

    return data;
  }

  return [];
};

/**
 * 从localstorage中获取上次的cookie
 * @returns {Array}
 */
const getInitUserInfo = () => {
  const result = localStorage.getItem(uKey);

  return result ? JSON.parse(result) : { id: -1 };
};

// 获取cookie的默认值.
const defaultCookies = getInitCookies();
const defaultUserInfo = getInitUserInfo();

/**
 * cookies的reducer, 把新获取的cookie更新到store.
 * @param state
 * @param action
 */
export const cookies = (state = defaultCookies, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === LOGIN) {
        const myCookies = get(action.response, 'cookies');

        setToStorage(sKey, myCookies);
        myCookies.forEach(v => setCookie(v['Set-Cookie']));

        return myCookies || [];
      }
      return state;
    default:
      return state;
  }
};

/**
 * userInfo的reducer, 把获取到的userInfo更新到store
 * @param state
 * @param action
 */
export const userInfo = (state = defaultUserInfo, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === LOGIN) {
        const data = convertObjIn(get(action.response, 'userInfo'));
        const userInfoObj = {
          id: data.userId,
          email: data.email,
          authToken: data.authToken,
          isProCustomer: data.isPro,
          timestamp: data.timestamp
        };

        setToStorage(uKey, userInfoObj);

        return userInfoObj;
      } else if (action.apiPattern.name === GET_SESSION_USER_INFO) {
        const user = get(action.response, 'userSessionData.user');
        if (user.id) {
          securityString.customerId = user.id;
          securityString.token = user.authToken;
          securityString.timestamp = user.timestamp;
        }
        return convertObjIn(user);
      }
      return state;
    default:
      return state;
  }
};

/**
 * 获取album id.
 * @param state
 * @param action
 */
export const albumId = (state = -1, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_USER_ALBUM_ID:
        case ADD_ALBUM:
          return +get(action.response, 'resultData.albumId') || -1;
        default:
          return state;
      }
    default:
      return state;
  }
};
