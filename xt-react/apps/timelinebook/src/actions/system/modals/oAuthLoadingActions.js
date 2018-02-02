import {
  SHOW_OAUTH_LOADING,
  HIDE_OAUTH_LOADING
} from '../../../constants/actionTypes';

export function showOAuthLoading() {
  return {
    type: SHOW_OAUTH_LOADING
  };
}

export function hideOAuthLoading(){
  return {
    type: HIDE_OAUTH_LOADING
  };
}
