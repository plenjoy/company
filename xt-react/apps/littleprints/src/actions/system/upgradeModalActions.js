import { SHOW_UPGRADE, HIDE_UPGRADE } from '../../constants/actionTypes';

export function showUpgrade(upgradeFun) {
  return {
    type: SHOW_UPGRADE,
    upgradeFun
  };
}

export function hideUpgrade() {
  return {
    type: HIDE_UPGRADE
  };
}
