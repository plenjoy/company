import * as types from '../../../constants/actionTypes';

export function setOAuthUser(user) {
  return {
    type: types.SET_OAUTH_USER,
    user
  };
}

export function setOAuthToken(token) {
  return {
    type: types.SET_OAUTH_TOKEN,
    token
  };
}