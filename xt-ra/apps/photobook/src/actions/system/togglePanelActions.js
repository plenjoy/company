import { TOGGLE_PANEL, CHANGE_BOTTOM_PANEL_TAB } from '../../contants/actionTypes';

export function changePanelStep(step = 0) {
  return {
    type: TOGGLE_PANEL,
    step
  };
}

export function changePanelTab(tabIndex = 0) {
  return {
    type: CHANGE_BOTTOM_PANEL_TAB,
    tabIndex
  };
}

