import * as types from '../../../contants/actionTypes';


export function showPaintedTextModal(data) {
  return {
    type: types.SHOW_PAINTED_TEXT_MODAL,
    data
  };
}

export function hidePaintedTextModal() {
  return {
    type: types.HIDE_PAINTED_TEXT_MODAL
  };
}

export function savePaintedTextModalInput(data) {
  return {
    type: types.SAVE_PAINTED_TEXT_MODAL_INPUT,
    data
  };
}

export function clearPaintedTextForm() {
  return {
    type: types.CLEAR_PAINTED_TEXT_FORM
  };
}
