import { SHOW_QUICK_START_MODAL, HIDE_QUICK_START_MODAL } from '../../contants/actionTypes';

export function showQuickStartModal() {
  return {
    type: SHOW_QUICK_START_MODAL
  };
}

export function hideQuickStartModal() {
  return {
    type: HIDE_QUICK_START_MODAL
  };
}
