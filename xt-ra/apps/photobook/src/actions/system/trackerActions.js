import { ADD_TRACKER } from '../../contants/actionTypes';

export function addTracker(paramString) {
  return {
    type: ADD_TRACKER,
    param: paramString
  };
}
