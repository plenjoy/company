import {
  bindActionCreators
} from 'redux';

// system
import * as envActions from '../../actions/system/env/envActions';
import * as queryStringAction from '../../actions/system/env/queryStringAction';
import * as trackerActions from '../../actions/system/global/trackerActions';
import * as notificationActions from '../../actions/system/notifications/notificationActions';
import * as upgradeModalActions from '../../actions/system/upgradeModalActions';
import * as imagesActions from '../../actions/system/imagesActions';
import * as sidebarAction from '../../actions/system/sidebarAction';
import * as ratioAction from '../../actions/system/global/ratioAction';
import * as uploadImageActions from '../../actions/system/uploadImageActions';
import * as contactUsModalActions from '../../actions/system/contactUsModalActions';
import * as paginationAction from '../../actions/system/global/paginationAction';
import * as capabilitiesActions from '../../actions/system/capabilitiesAction';
import * as imageEditModalActions from '../../actions/system/imageEditModalActions';
import * as templateAction from '../../actions/system/templateActions';
import * as styleAction from '../../actions/system/styleActions';
import * as confirmModalActions from '../../actions/system/confirmModalActions';
import * as alertModalActions from '../../actions/system/alertModalActions';
import * as priceAction from '../../actions/system/priceActions';
import * as cloneModalActions from '../../actions/system/cloneModalActions';
import * as previewModalActions from '../../actions/system/previewModalActions';
import * as fontActions from '../../actions/system/fontActions';
import * as textEditModalActions from '../../actions/system/textEditModalActions';
// project
import projectActions from '../../actions/project';

// SPEC
import * as specActions from '../../actions/spec/specActions';

export const mapAppDispatchToProps = dispatch => ({
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundQueryStringActions: bindActionCreators(queryStringAction, dispatch),
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundNotificationActions: bindActionCreators(notificationActions, dispatch),
  boundSpecActions: bindActionCreators(specActions, dispatch),
  boundImagesActions: bindActionCreators(imagesActions, dispatch),
  boundSidebarActions: bindActionCreators(sidebarAction, dispatch),
  boundUploadImagesActions: bindActionCreators(uploadImageActions, dispatch),
  boundContactUsActions: bindActionCreators(contactUsModalActions, dispatch),
  boundRatioActions: bindActionCreators(ratioAction, dispatch),
  boundUpgradeModalActions: bindActionCreators(upgradeModalActions, dispatch),
  boundPaginationActions: bindActionCreators(paginationAction, dispatch),
  boundCapabilitiesActions: bindActionCreators(capabilitiesActions, dispatch),
  boundImageEditModalActions: bindActionCreators(imageEditModalActions, dispatch),
  boundTemplateActions: bindActionCreators(templateAction, dispatch),
  boundConfirmModalActions: bindActionCreators(confirmModalActions, dispatch),
  boundStyleActions: bindActionCreators(styleAction, dispatch),
  boundAlertModalActions: bindActionCreators(alertModalActions, dispatch),
  boundPriceActions: bindActionCreators(priceAction, dispatch),
  boundCloneModalActions: bindActionCreators(cloneModalActions, dispatch),
  boundFontActions: bindActionCreators(fontActions, dispatch),
  boundTextEditModalActions: bindActionCreators(textEditModalActions, dispatch),
  boundPreviewModalActions: bindActionCreators(previewModalActions, dispatch)
});
