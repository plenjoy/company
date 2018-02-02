import { SHOW_USE_SPEC_MODAL, HIDE_USE_SPEC_MODAL } from '../../contants/actionTypes';

export function showUseSpecModal(url) {
  return {
    type: SHOW_USE_SPEC_MODAL,
    url
  };
}

export function hideUseSpecModal() {
  return {
    type: HIDE_USE_SPEC_MODAL
  };
}
