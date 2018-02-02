import { SHOW_HOW_THIS_WORKS_MODAL, HIDE_HOW_THIS_WORKS_MODAL } from '../../contants/actionTypes';

export function showHowThisWorksModal() {
  return {
    type: SHOW_HOW_THIS_WORKS_MODAL
  };
}

export function hideHowThisWorksModal() {
  return {
    type: HIDE_HOW_THIS_WORKS_MODAL
  };
}
