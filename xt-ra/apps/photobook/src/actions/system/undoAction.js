import * as types from '../../contants/actionTypes';

import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap, getStickerUsedMap } from '../../utils/countUsed';

function countUsedObject(dispatch, getState) {
  const newElementArray = getDataFromState(getState()).elementArray;

  dispatch({
    type: types.SET_IMAGE_USED_MAP,
    imageUsedMap: getImageUsedMap(newElementArray)
  });
}

export function redo() {
  return (dispatch, getState) => {
    dispatch({ type: types.REDO });

    countUsedObject(dispatch, getState);
  };
}

export function undo() {
  return (dispatch, getState) => {
    dispatch({ type: types.UNDO });

    countUsedObject(dispatch, getState);
  };
}

export function clearHistory() {
  return (dispatch, getState) => {
    dispatch({ type: types.CLEAR_HISTORY });
  };
}

export function startUndo() {
  return {
    type: types.START_UNDO
  };
}

export function stopUndo() {
  return {
    type: types.STOP_UNDO
  };
}
