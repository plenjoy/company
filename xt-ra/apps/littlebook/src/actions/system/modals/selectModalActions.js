import { SHOW_SELECT, HIDE_SELECT } from '../../../contants/actionTypes';

export function showSelect(upgradeData) {
  return {
    type: SHOW_SELECT,
    upgradeData
  };
}

export function hideSelect() {
  return {
    type: HIDE_SELECT
  };
}
