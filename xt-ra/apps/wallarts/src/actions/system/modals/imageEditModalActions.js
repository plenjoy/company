import { SHOW_IMAGE_EDIT_MODAL, HIDE_IMAGE_EDIT_MODAL } from '../../../constants/actionTypes';

export function showImageEditModal(data) {
  return {
    type: SHOW_IMAGE_EDIT_MODAL,
    data
  };
}

export function hideImageEditModal() {
  return {
    type: HIDE_IMAGE_EDIT_MODAL
  };
}
