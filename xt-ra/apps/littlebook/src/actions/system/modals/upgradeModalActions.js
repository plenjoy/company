import { SHOW_UPGRADE, HIDE_UPGRADE } from '../../../contants/actionTypes';

export function showUpgrade(upgradeData) {
  return {
    type: SHOW_UPGRADE,
    upgradeData
  };
}

export function hideUpgrade() {
  return {
    type: HIDE_UPGRADE
  };
}
