import { combineReducers } from 'redux';
import { merge } from 'lodash';
import { CHANGE_WORKSPACE_SPREAD, AUTO_ADD_PHOTO_TO_CANVAS, TOGGLE_OPERATION_PNAEL, UPDATE_WORKSPACE_SPREADS, IN_PREVIEW_WORKSPACE, UPDATE_WORKSPACE_RATIO } from '../contants/actionTypes';

const currentSpread = (state = {}, action) => {
  switch (action.type) {
    // 更改workspace中活动的spread
    case CHANGE_WORKSPACE_SPREAD: {
      return action.spread;
    }
    default:
      return state;
  }
};

const allSpreads = (state = {}, action) => {
  switch (action.type) {
    // 更改workspace中活动的spread
    case UPDATE_WORKSPACE_SPREADS: {
      return action.spreads;
    }
    default:
      return state;
  }
};
const autoAddPhotoToCanvas = (state = { status: false }, action) => {
  switch (action.type) {
    case AUTO_ADD_PHOTO_TO_CANVAS: {
      const { status, elementId, targetWidth, targetHeight } = action;
      return merge({}, state, {
        status,
        elementId,
        targetWidth,
        targetHeight
      });
    }
    default:
      return state;
  }
};

const operationPanel = (state = { status: false, offset: { top: 150, left: 500 } }, action) => {
  switch (action.type) {
    case TOGGLE_OPERATION_PNAEL: {
      const { status, offset } = action;
      return merge({}, state, {
        status,
        offset
      });
    }
    default:
      return state;
  }
};

const inPreviewWorkspace = (state = false, action) => {
  switch (action.type) {
    case IN_PREVIEW_WORKSPACE:
      return action.status;
    default:
      return state;
  }
};

const workspaceRatio = (state = 1, action) => {
  switch (action.type) {
    case UPDATE_WORKSPACE_RATIO:
      return action.ratio;
    default:
      return state;
  }
};

export default combineReducers({
  currentSpread,
  autoAddPhotoToCanvas,
  operationPanel,
  inPreviewWorkspace,
  allSpreads,
  workspaceRatio
});
