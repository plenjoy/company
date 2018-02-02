import * as types from '../../contants/actionTypes';


export function showPropertyModal(data) {
  return {
    type: types.SHOW_PROPERTY_MODAL,
    data
  };
}

export function hidePropertyModal() {
  return {
    type: types.HIDE_PROPERTY_MODAL
  };
}
