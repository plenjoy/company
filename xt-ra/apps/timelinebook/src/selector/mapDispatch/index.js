import { bindActionCreators } from 'redux';

// system
import * as envActions from '../../actions/system/env/envActions';
import * as oAuthActions from '../../actions/system/oAuth/oAuthActions';
import * as queryStringAction from '../../actions/system/env/queryStringAction';
import * as trackerActions from '../../actions/system/global/trackerActions';
import * as notificationActions from '../../actions/system/notifications/notificationActions';
import * as confirmModalActions from '../../actions/system/modals/confirmModalActions';
import * as orderModalActions from '../../actions/system/modals/orderModalActions';
import * as oAuthPageActions from '../../actions/system/modals/oAuthPageActions';
import * as oAuthLoadingActions from '../../actions/system/modals/oAuthLoadingActions';
import * as incompleteModalActions from '../../actions/system/modals/incompleteModalActions';
import * as previewModalActions from '../../actions/system/modals/previewModalActions';
import * as sidebarActions from '../../actions/system/sidebar/sidebarActions';
import * as photoArrayActions from '../../actions/system/photoArray/photoArrayActions';
import * as materialActions from '../../actions/system/global/materialActions';
import * as ratioActions from '../../actions/system/global/ratioActions';
import * as viewPropertiesActions from '../../actions/system/global/viewPropertiesActions';

// project
import * as projectsActions from '../../actions/project/projectsActions';

// SPEC
import * as specActions from '../../actions/spec/specActions';

export const mapAppDispatchToProps = dispatch => ({
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundQueryStringActions: bindActionCreators(queryStringAction, dispatch),
  boundProjectsActions: bindActionCreators(projectsActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundNotificationActions: bindActionCreators(notificationActions, dispatch),
  boundSpecActions: bindActionCreators(specActions, dispatch),
  boundConfirmModalActions: bindActionCreators(confirmModalActions, dispatch),
  boundOrderModalActions: bindActionCreators(orderModalActions, dispatch),
  boundOAuthPageActions: bindActionCreators(oAuthPageActions, dispatch),
  boundOAuthActions: bindActionCreators(oAuthActions, dispatch),
  boundOAuthLoadingActions: bindActionCreators(oAuthLoadingActions, dispatch),
  boundSidebarActions: bindActionCreators(sidebarActions, dispatch),
  boundPhotoArrayActions: bindActionCreators(photoArrayActions, dispatch),
  boundMaterialActions: bindActionCreators(materialActions, dispatch),
  boundRatioActions: bindActionCreators(ratioActions, dispatch),
  boundViewPropertiesActions: bindActionCreators(viewPropertiesActions, dispatch),
  boundIncompleteModalActions: bindActionCreators(incompleteModalActions, dispatch),
  boundPreviewModalActions: bindActionCreators(previewModalActions, dispatch),
});
