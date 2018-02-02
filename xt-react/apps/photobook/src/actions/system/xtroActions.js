import { SHOW_XTRO_MODAL, HIDE_XTRO_MODAL, GOTO_INTRO_STEP } from '../../contants/actionTypes';

export function show(data) {
  return {
    type: SHOW_XTRO_MODAL,
    data
  };
}

export function hide() {
  return {
    type: HIDE_XTRO_MODAL
  };
}

export function gotoStep(stepIndex) {
  return {
    type: GOTO_INTRO_STEP,
    stepIndex
  };
}
