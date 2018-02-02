import { CALL_API } from '../middlewares/api';
import { LOGIN } from '../contants/apiUrl';
import { LOGIN_SUCCESS,  LOGIN_FAIL } from '../contants/actionTypes';
import { combine, getUrl } from '../../common/utils/url';

/**
 * action, 用户登录
 * @param username
 * @param password
 * @returns {function(*)}
 */
export function login(username, password) {
  return (dispatch, getState) => {
    const baseUrl = getUrl(getState(), 'system.env.urls.baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: LOGIN,
          params: { baseUrl, username, password }
        },
        options: {
          method: 'POST',
          body: JSON.stringify({
            username
          })
        }
      }
    });
  };
}

/*
 * action创建函数, 用于定义创建一个登录成功的action
 * @param {string} text 登录成功的描述信息
 */
export function loginSuccess(text) {
  return {
    type: LOGIN_SUCCESS,
    text
  };
}

/*
 * action创建函数, 用于定义创建一个登录成功的action
 * @param {string} text 登录失败的描述信息
 */
export function loginFail(text) {
  return {
    type: LOGIN_FAIL,
    text
  };
}
