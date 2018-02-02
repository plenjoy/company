import {
  SHOW_GLOBAL_LOADING,
  HIDE_GLOBAL_LOADING
}
from '../../../contants/actionTypes.js';

let timer = null;

export function show() {
  return {
    type: SHOW_GLOBAL_LOADING
  };
}

export function showAsync(timeout = 1000) {
  clearTimeout(timer);

  return (dispatch, getState) => {
    timer = setTimeout(() => {
      dispatch({
        type: SHOW_GLOBAL_LOADING
      });
    }, timeout);

    return Promise.resolve();
  };
}

export function hide() {
  clearTimeout(timer);

  return {
    type: HIDE_GLOBAL_LOADING
  };
}

