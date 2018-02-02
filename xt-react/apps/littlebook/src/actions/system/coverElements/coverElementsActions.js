import { SAVE_COVER_ELEMENTS } from '../../../contants/actionTypes';


export function saveCoverElements(elements) {
  return {
    type: SAVE_COVER_ELEMENTS,
    elements
  };
}
