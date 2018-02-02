import Immutable from 'immutable';
import { SET_CAPABILITIES } from '../../contants/actionTypes';
import { getDataFromState } from '../../utils/getDataFromState';

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

  // pageheader
  canShowPageHeaderClone: true,
  canShowPageHeaderHelp: true,
  canShowPageHeaderShare: true,
  canShowPageHeaderOrder: true,

  // layouts
  canShowMyLayouts: true,

  // pageArrange
  canAddSheet: true,

  // show mental Cover
  isShowMetalCover: false,

  // 是否显示删除sheet的图标.
  canShowDeleteSheetIcon: false,

  isDesignerMode: false,
  isProfessionalView: false,

  // isDesignerMode, isProfessionalView其中一种就是高级模式.
  isAdvancedMode: false,

  isUseDefaultTheme: false
});

export function initCapabilities() {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());

    const { queryStringObj } = stateData;

    const isFromFactory = queryStringObj.get('source') === 'factory';
    const isFromDesigner = queryStringObj.get('source') === 'designer';

    // pageheader, page tabs.
    const base = defaultCapabilities.merge({
      canShowPageHeaderClone: !isFromDesigner,
      canShowPageHeaderHelp: !isFromDesigner,
      canShowPageHeaderShare: !isFromDesigner,
      canShowPageHeaderOrder: !isFromDesigner,
      canShowPrice: !isFromDesigner,
      canEditTitle: !isFromDesigner,
      isDisableAutoLayout: isFromDesigner,
      isUseDefaultTheme: !isFromDesigner,

      isDesignerMode: isFromDesigner,
      isAdvancedMode: isFromDesigner
    });

    const editPages = defaultCapabilities.merge({
      // element
      canSelectElement: true,
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

      canShowMyLayouts: !isFromDesigner,
      canShowTakeShot: isFromDesigner,

      // action bar  设计师模式 不能添加
      canInsertPage: !isFromDesigner,
      canAutoFill: !isFromDesigner,
      canSaveLayout: !isFromDesigner,
      canShowChangeColor: !isFromDesigner,

      canUseSafezoneClamp: !isFromDesigner,
      isDesignerMode: isFromDesigner,
      isAdvancedMode: isFromDesigner,
      useMoveLimit: !isFromDesigner
    });

    const previewPages = defaultCapabilities.merge({
      canShowOriginalPhotoLayer: isFromFactory
    });

    const arrangePages = defaultCapabilities.merge({
      canAddSheet: !isFromDesigner,
      canShowDeleteSheetIcon: true
    });

    const navigationPages = defaultCapabilities.merge({});

    const bookOptionPages = defaultCapabilities.merge({
      canShowSizeOption: !isFromDesigner,
      canShowProductOption: !isFromDesigner,
      canSpecDownloadLink: !isFromDesigner,
      isShowMetalCover: isFromDesigner
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
