import { SHOW_MAIN_LOADING, HIDE_MAIN_LOADING } from '../../../constants/actionTypes';

export function show(data) {
  return {
    type: SHOW_MAIN_LOADING,
    data
  };
}

export function hide() {
  return {
    type: HIDE_MAIN_LOADING
  };
}
