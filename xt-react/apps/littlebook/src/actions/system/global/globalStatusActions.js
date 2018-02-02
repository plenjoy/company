import {
  ON_CHANGE_SETTING,
  COMPLETE_CHANGE_SETTING
}
from '../../../contants/actionTypes.js';



export function isOnChangeSetting() {
  return {
    type: ON_CHANGE_SETTING
  };
}



export function completeChangeSetting() {
  return {
    type: COMPLETE_CHANGE_SETTING
  };
}

