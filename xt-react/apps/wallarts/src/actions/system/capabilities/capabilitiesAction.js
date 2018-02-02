import Immutable from 'immutable';
import { SET_CAPABILITIES } from '../../../constants/actionTypes';
// import { getDataFromState } from '../../../utils/getDataFromState';

const defaultCapabilities = Immutable.fromJS({
  // element
  canSelectElement: false,
  canMoveElement: false,
  canResizeElement: false,
  canRotateElement: false,
  canShowOriginalPhotoLayer: false,

  canEditElement: false,
  canCreateElement: false,
  canDeleteElement: false,
  canShowSnackBar: false,

  // image
  canSwapImage: false,

  // page
  canDragImageInPage: false,
  canDropImageInPage: false,

  // sheet
  canSwapSheet: false,
  canNavigateSheet: false,

  // action bar
  canUseElementActionBar: false,
  canUseGlobalActionBar: false,
  canScaleImageByMouseWheel: false
});

export function initCapabilities() {
  return (dispatch, getState) => {
    // pageheader, page tabs.
    const base = defaultCapabilities.merge({

    });

    const editPages = defaultCapabilities.merge({
      // element
      canSelectElement: true,
      canMoveElement: true,
      canResizeElement: true,
      canRotateElement: false,

      canEditElement: true,
      canCreateElement: true,
      canDeleteElement: true,
      canShowSnackBar: true,

      // image
      canSwapImage: true,

      // page
      canDragImageInPage: true,
      canDropImageInPage: true,

      // action bar
      canUseElementActionBar: true,
      canUseGlobalActionBar: true,

      canShowTextTooltip: true,
      canDragCrop: true,
      canScaleImageByMouseWheel: true
    });

    const previewPages = defaultCapabilities.merge({
      canShowOriginalPhotoLayer: false
    });

    const allPages = defaultCapabilities.merge({

    });

    const capabilities = Immutable.Map({
      editPages,
      previewPages,
      allPages
    });

    dispatch({
      type: SET_CAPABILITIES,
      capabilities
    });
  };
}
