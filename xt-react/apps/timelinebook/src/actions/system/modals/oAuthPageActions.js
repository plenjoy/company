import {
  SHOW_OAUTH_PAGE,
  HIDE_OAUTH_PAGE
} from '../../../constants/actionTypes';

export function showOAuthPage() {
  return {
    type: SHOW_OAUTH_PAGE
  };
}

export function hideOAuthPage(){
  return {
    type: HIDE_OAUTH_PAGE
  };
}
