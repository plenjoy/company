import { SHOW_PREVIEW, HIDE_PREVIEW } from '../../constants/actionTypes';

export function show(data) {
  return {
    type: SHOW_PREVIEW,
    data
  };
}

export function hide() {
  return {
    type: HIDE_PREVIEW
  };
}
