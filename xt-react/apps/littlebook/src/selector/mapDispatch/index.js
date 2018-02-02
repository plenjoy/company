import { bindActionCreators } from 'redux';

// 导入action文件.
import * as todoAction from '../../actions/test/todoAction';
import * as randomAction from '../../actions/test/randomAction';

// spec
import * as specActions from '../../actions/spec/specActions';

// project
import * as projectActions from '../../actions/project/projectActions';

// system
import * as oAuthActions from '../../actions/system/oAuth/oAuthActions';
import * as undoAction from '../../actions/system/global/undoAction';
import * as queryStringAction from '../../actions/system/env/queryStringAction';
import * as ratioAction from '../../actions/system/global/ratioAction';
import * as paginationAction from '../../actions/system/global/paginationAction';
import * as renderActions from '../../actions/system/global/renderActions';
import * as envActions from '../../actions/system/env/envActions';
import * as alertActions from '../../actions/system/modals/alertAction';
import * as confirmModalActions from '../../actions/system/modals/confirmModalActions';
import * as upgradeModalActions from '../../actions/system/modals/upgradeModalActions';
import * as loadingActions from '../../actions/system/modals/loadingActions';
import * as notificationActions from '../../actions/system/notifications/notificationActions';
import * as imageEditModalActions from '../../actions/system/modals/imageEditModalActions';
import * as sidebarAction from '../../actions/system/sidebar/sidebarAction';
import * as togglePanelActions from '../../actions/system/global/togglePanelActions';
import * as imagesActions from '../../actions/system/images/imagesActions';
import * as uploadImageActions from '../../actions/system/images/uploadImageActions';
import * as priceActions from '../../actions/system/Price/priceActions';
import * as bookSettingsModalActions from '../../actions/system/modals/bookSettingsModalActions';
import * as paintedTextModalActions from '../../actions/system/modals/paintedTextModalActions';
import * as textEditModalActions from '../../actions/system/modals/textEditModalActions';
import * as howThisWorksModalActions from '../../actions/system/modals/howThisWorksModalActions';
import * as quickStartModalActions from '../../actions/system/modals/quickStartModalActions';
import * as contactUsModalActions from '../../actions/system/modals/contactUsModalActions';
import * as shareProjectModalActions from '../../actions/system/modals/shareProjectModalActions';
import * as cloneModalActions from '../../actions/system/modals/cloneModalActions';
import * as alertModalActions from '../../actions/system/modals/alertModalActions';
import * as previewModalActions from '../../actions/system/modals/previewModalActions';
import * as pageLoadingModalActions from '../../actions/system/modals/pageLoadingModalActions';
import * as trackerActions from '../../actions/system/global/trackerActions';
import * as snippingActions from '../../actions/system/global/snippingActions';
import * as fontActions from '../../actions/system/fontList/fontActions';
import * as changeBgColorModalActions from '../../actions/system/modals/changeBgColorModalActions';
import * as approvalPageActions from '../../actions/system/modals/approvalPageActions';
import * as capabilitiesActions from '../../actions/system/capabilities/capabilitiesActions';
import * as templateActions from '../../actions/system/template/templateActions';
import * as coverElementsActions from '../../actions/system/coverElements/coverElementsActions';
import * as globalLoadingActions from '../../actions/system/global/globalLoadingActions';
import * as globalStatusActions from '../../actions/system/global/globalStatusActions';
import * as autoUploadAction from '../../actions/system/modals/autoUploadModalActions';
import * as selectModalActions from '../../actions/system/modals/selectModalActions';
/**
 * App container component
 */
export const mapAppDispatchToProps = dispatch => ({
  // system
  boundQueryStringActions: bindActionCreators(queryStringAction, dispatch),
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundRatioActions: bindActionCreators(ratioAction, dispatch),
  boundAlertActions: bindActionCreators(alertActions, dispatch),
  boundLoadingActions: bindActionCreators(loadingActions, dispatch),
  boundNotificationActions: bindActionCreators(notificationActions, dispatch),
  boundImageEditModalActions: bindActionCreators(
    imageEditModalActions,
    dispatch
  ),
  boundSidebarActions: bindActionCreators(sidebarAction, dispatch),
  boundImagesActions: bindActionCreators(imagesActions, dispatch),
  boundUploadImagesActions: bindActionCreators(uploadImageActions, dispatch),
  boundPriceActions: bindActionCreators(priceActions, dispatch),
  boundBookSettingsModalActions: bindActionCreators(
    bookSettingsModalActions,
    dispatch
  ),
  boundPaintedTextModalActions: bindActionCreators(
    paintedTextModalActions,
    dispatch
  ),
  boundimageEditModalActions: bindActionCreators(
    imageEditModalActions,
    dispatch
  ),
  boundTextEditModalActions: bindActionCreators(textEditModalActions, dispatch),
  boundConfirmModalActions: bindActionCreators(confirmModalActions, dispatch),
  boundUpgradeModalActions: bindActionCreators(upgradeModalActions, dispatch),
  boundHowThisWorksActions: bindActionCreators(
    howThisWorksModalActions,
    dispatch
  ),
  boundQuickStartActions: bindActionCreators(quickStartModalActions, dispatch),
  boundContactUsActions: bindActionCreators(contactUsModalActions, dispatch),
  boundShareProjectActions: bindActionCreators(
    shareProjectModalActions,
    dispatch
  ),
  boundRenderActions: bindActionCreators(renderActions, dispatch),
  boundCloneModalActions: bindActionCreators(cloneModalActions, dispatch),
  boundAlertModalActions: bindActionCreators(alertModalActions, dispatch),
  boundPreviewModalActions: bindActionCreators(previewModalActions, dispatch),
  boundPageLoadingModalActions: bindActionCreators(
    pageLoadingModalActions,
    dispatch
  ),
  boundPaginationActions: bindActionCreators(paginationAction, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundFontActions: bindActionCreators(fontActions, dispatch),
  boundChangeBgColorModalActions: bindActionCreators(
    changeBgColorModalActions,
    dispatch
  ),
  // facebook oR instagram
  boundOAuthActions: bindActionCreators(oAuthActions, dispatch),
  boundAutoUploadActions: bindActionCreators(
    autoUploadAction,
    dispatch
  ),

  boundApprovalPageActions: bindActionCreators(approvalPageActions, dispatch),
  boundSnippingActions: bindActionCreators(snippingActions, dispatch),
  boundCapabilitiesActions: bindActionCreators(capabilitiesActions, dispatch),
  boundTemplateActions: bindActionCreators(templateActions, dispatch),

  // spec
  boundSpecActions: bindActionCreators(specActions, dispatch),

  // project
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundGlobalLoadingActions: bindActionCreators(globalLoadingActions, dispatch),
  boundGlobalStatusActions: bindActionCreators(globalStatusActions, dispatch),
  boundSelectModalActions: bindActionCreators(selectModalActions, dispatch),
});

/**
 * ArragePages container component
 */
export const mapArragePagesDispatchToProps = dispatch => ({
  // project
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundTemplateActions: bindActionCreators(templateActions, dispatch),
  boundPaginationActions: bindActionCreators(paginationAction, dispatch)
});

/**
 * EditPage container component
 */
export const mapEditPageDispatchToProps = dispatch => ({
  // undo.
  boundUndoActions: bindActionCreators(undoAction, dispatch),

  // system
  boundRatioActions: bindActionCreators(ratioAction, dispatch),
  boundPaginationActions: bindActionCreators(paginationAction, dispatch),
  boundRenderActions: bindActionCreators(renderActions, dispatch),
  boundAlertActions: bindActionCreators(alertActions, dispatch),
  boundConfirmModalActions: bindActionCreators(confirmModalActions, dispatch),
  boundLoadingActions: bindActionCreators(loadingActions, dispatch),
  boundNotificationActions: bindActionCreators(notificationActions, dispatch),
  boundImageEditModalActions: bindActionCreators(
    imageEditModalActions,
    dispatch
  ),
  boundBookSettingsModalActions: bindActionCreators(
    bookSettingsModalActions,
    dispatch
  ),
  boundPaintedTextModalActions: bindActionCreators(
    paintedTextModalActions,
    dispatch
  ),
  boundTextEditModalActions: bindActionCreators(textEditModalActions, dispatch),
  boundImagesActions: bindActionCreators(imagesActions, dispatch),
  boundUploadImagesActions: bindActionCreators(uploadImageActions, dispatch),
  boundSnippingActions: bindActionCreators(snippingActions, dispatch),
  boundPageLoadingModalActions: bindActionCreators(
    pageLoadingModalActions,
    dispatch
  ),
  boundAlertModalActions: bindActionCreators(alertModalActions, dispatch),
  boundChangeBgColorModalActions: bindActionCreators(
    changeBgColorModalActions,
    dispatch
  ),
  boundTogglePanelActions: bindActionCreators(togglePanelActions, dispatch),
  // project
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundTemplateActions: bindActionCreators(templateActions, dispatch),
  boundCoverElementsActions: bindActionCreators(coverElementsActions, dispatch),
  boundGlobalLoadingActions: bindActionCreators(globalLoadingActions, dispatch)
});

/**
 * photoGrouping container component
 */
export const mapPhotoGroupingDispatchToProps = dispatch => ({});

/**
 * previewModel container component
 */
export const mapPreviewModelDispatchToProps = dispatch => ({});

/**
 * selectThemes container component
 */
export const mapSelectThemesDispatchToProps = dispatch => ({});
