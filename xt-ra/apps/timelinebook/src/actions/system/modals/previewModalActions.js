import {
  SHOW_PREVIEW_MODAL,
  HIDE_PREVIEW_MODAL
} from '../../../constants/actionTypes';

export function showPreviewModal() {
  return {
    type: SHOW_PREVIEW_MODAL
  };
}

export function hidePreviewModal(){
  return {
    type: HIDE_PREVIEW_MODAL
  };
}
