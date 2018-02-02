import { SHOW_AUTO_UPGRADE_MODAL, HIDE_AUTO_UPGRADE_MODAL } from '../../../contants/actionTypes';

export function showAutoUploadModal() {
  return {
    type: SHOW_AUTO_UPGRADE_MODAL
  };
}

export function hideAutoUploadModal() {
  return {
    type: HIDE_AUTO_UPGRADE_MODAL
  };
}
