import Immutable from 'immutable';
import { SET_CAPABILITIES } from '../../../contants/actionTypes';
import { getQueryStingObj } from '../../../utils/url';

const defaultCapabilities = Immutable.fromJS({
  // element
  canSelectElement: false,
  canMoveElement: false,
  canResizeElement: false,
  canRotateElement: false,
  canShowOriginalPhotoLayer: false,
  canShowSnackBar: false,
  canShowTextTooltip: false,
  canDragCrop: false,

  canEditElement: false,
  canCreateElement: false,
  canDeleteElement: false,

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
  canUseGlobalActionBar: false
});

export function initCapabilities() {
  return (dispatch, getState) => {
    const queryStringObj = getQueryStingObj();

    const isFromFactory = queryStringObj.source === 'factory';
    const isFromDesigner = queryStringObj.source === 'designer';

    // pageheader, page tabs.
    const base = defaultCapabilities.merge({

    });

    const editPages = defaultCapabilities.merge({
      // element
      canSelectElement: false,
      canMoveElement: true,
      canResizeElement: true,
      canRotateElement: true,

      canEditElement: true,
      canCreateElement: true,
      canDeleteElement: true,

      // image
      canSwapImage: true,

      // page
      canDragImageInPage: true,
      canDropImageInPage: true,

      // sheet
      canSwapSheet: true,
      canNavigateSheet: true,

      // action bar
      canUseElementActionBar: true,
      canUseGlobalActionBar: true,

      canShowSnackBar: true,
      canShowTextTooltip: true,
      canDragCrop: true
    });

    const previewPages = defaultCapabilities.merge({
      canShowOriginalPhotoLayer: isFromFactory
    });

    const arrangePages = defaultCapabilities.merge({

    });

    const navigationPages = defaultCapabilities.merge({

    });

    const bookOptionPages = defaultCapabilities.merge({
      canShowSizeOption: !isFromDesigner,
      canShowProductOption: !isFromDesigner,
      canSpecDownloadLink: !isFromDesigner
    });

    const capabilities = Immutable.Map({
      base,
      editPages,
      previewPages,
      arrangePages,
      navigationPages,
      bookOptionPages
    });

    dispatch({
      type: SET_CAPABILITIES,
      capabilities
    });
  };
}
