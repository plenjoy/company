import { bindActionCreators } from 'redux';

// system
import * as envActions from '../../actions/system/env/envActions';
import * as ratioAction from '../../actions/system/global/ratioAction';
import * as queryStringAction from '../../actions/system/env/queryStringAction';
import * as trackerActions from '../../actions/system/global/trackerActions';
import * as fontActions from '../../actions/system/fontList/fontActions';
import * as capabilitiesActions from '../../actions/system/capabilities/capabilitiesAction';
import * as notificationActions from '../../actions/system/notifications/notificationActions';
import * as imagesActions from '../../actions/system/imagesActions';
import * as uploadImageActions from '../../actions/system/uploadImageActions';
import * as contactUsModalActions from '../../actions/system/contactUsModalActions';
import * as paginationAction from '../../actions/system/global/paginationAction';
import * as materialActions from '../../actions/system/global/materialActions';
import * as confirmModalActions from '../../actions/system/confirmModalActions';
import * as alertModalActions from '../../actions/system/alertModalActions';
import * as imageEditModalActions from '../../actions/system/modals/imageEditModalActions';
import * as cloneModalActions from '../../actions/system/cloneModalActions';
import * as previewModalActions from '../../actions/system/modals/previewModalActions';
import * as priceAction from '../../actions/system/priceActions';
import * as snippingActions from '../../actions/system/global/snippingActions';
import * as loadingModalActions from '../../actions/system/modals/loadingModalActions';

// project
import projectActions from '../../actions/project';

// SPEC
import * as specActions from '../../actions/spec/specActions';

export const mapAppDispatchToProps = dispatch => ({
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundRatioActions: bindActionCreators(ratioAction, dispatch),
  boundQueryStringActions: bindActionCreators(queryStringAction, dispatch),
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundNotificationActions: bindActionCreators(notificationActions, dispatch),
  boundFontActions: bindActionCreators(fontActions, dispatch),
  boundSpecActions: bindActionCreators(specActions, dispatch),
  boundMaterialActions: bindActionCreators(materialActions, dispatch),
  boundPaginationActions: bindActionCreators(paginationAction, dispatch),
  boundCapabilitiesActions: bindActionCreators(capabilitiesActions, dispatch),
  boundImagesActions: bindActionCreators(imagesActions, dispatch),
  boundUploadImagesActions: bindActionCreators(uploadImageActions, dispatch),
  boundContactUsActions: bindActionCreators(contactUsModalActions, dispatch),
  boundConfirmModalActions: bindActionCreators(confirmModalActions, dispatch),
  boundAlertModalActions: bindActionCreators(alertModalActions, dispatch),
  boundImageEditModalActions: bindActionCreators(imageEditModalActions, dispatch),
  boundPriceActions: bindActionCreators(priceAction, dispatch),
  boundCloneModalActions: bindActionCreators(cloneModalActions, dispatch),
  boundPreviewModalActions: bindActionCreators(previewModalActions, dispatch),
  boundSnippingActions: bindActionCreators(snippingActions, dispatch),
  boundLoadingModalAction: bindActionCreators(loadingModalActions, dispatch)
});
