import {
  SHOW_THEME_OVERLAY_MODAL,
  HIDE_THEME_OVERLAY_MODAL
}
from '../../contants/actionTypes.js';

export function showThemeOverlayModal(params) {
  return {
    type: SHOW_THEME_OVERLAY_MODAL,
    params
  };
}

export function hideThemeOverlayModal() {
  return {
    type: HIDE_THEME_OVERLAY_MODAL
  };
}
