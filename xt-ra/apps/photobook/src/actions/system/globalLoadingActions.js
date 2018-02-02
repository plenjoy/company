import { CALL_API } from '../../middlewares/api';
import { GET_SHARE_URLS } from '../../contants/apiUrl';
import {
  SHOW_GLOBAL_LOADING,
  HIDE_GLOBAL_LOADING
} from '../../contants/actionTypes.js';

export function showGlobalLoading() {
  return {
    type: SHOW_GLOBAL_LOADING
  };
}

export function hideGlobalLoading() {
  return {
    type: HIDE_GLOBAL_LOADING
  };
}
