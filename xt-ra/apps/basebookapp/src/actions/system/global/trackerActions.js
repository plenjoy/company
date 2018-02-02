import { ADD_TRACKER } from '../../../constants/actionTypes';


export function addTracker(paramString) {
  return {
    type: ADD_TRACKER,
    param: paramString
  };
}
