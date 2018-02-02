import * as types from '../../contants/actionTypes';


export function show(data) {
  return {
    type: types.SHOW_SCREENSHOT_MODAL,
    data
  };
}

export function hide() {
  return {
    type: types.HIDE_SCREENSHOT_MODAL
  };
}
