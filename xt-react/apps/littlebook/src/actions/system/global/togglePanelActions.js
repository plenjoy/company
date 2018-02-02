import { TOGGLE_PANEL } from '../../../contants/actionTypes';

export function changePanelStep(step = 0) {
  return {
    type: TOGGLE_PANEL,
    step
  };
}

