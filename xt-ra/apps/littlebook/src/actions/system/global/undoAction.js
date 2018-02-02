import { REDO, UNDO, CLEAR_HISTORY } from '../../../contants/actionTypes';

export function redo() {
  return {
    type: REDO
  };
}

export function undo() {
  return {
    type: UNDO
  };
}

export function clearHistory() {
  return {
    type: CLEAR_HISTORY
  };
}
