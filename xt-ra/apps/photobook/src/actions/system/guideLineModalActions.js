import { SHOW_GUIDE_lINE_MODAL, HIDE_GUIDE_lINE_MODAL } from '../../contants/actionTypes';
export function showGuideLineModal() {
  return {
    type: SHOW_GUIDE_lINE_MODAL
  };
}

export function hideGuideLineModal() {
  return {
    type: HIDE_GUIDE_lINE_MODAL
  };
}
