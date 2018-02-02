import { SHOW_CLONE_MODAL, HIDE_CLONE_MODAL } from '../../constants/actionTypes';

export function showCloneModal() {
  return {
    type: SHOW_CLONE_MODAL
  };
}

export function hideCloneModal() {
  return {
    type: HIDE_CLONE_MODAL
  };
}
