import { SHOW_PAGE_LOADING_MODAL, HIDE_PAGE_LOADING_MODAL } from '../../contants/actionTypes';

export function showPageLoadingModal(text) {
  return {
    type: SHOW_PAGE_LOADING_MODAL,
    text
  };
}

export function hidePageLoadingModal() {
  return {
    type: HIDE_PAGE_LOADING_MODAL
  };
}
