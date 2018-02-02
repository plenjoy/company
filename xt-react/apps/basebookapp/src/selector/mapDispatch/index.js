import { bindActionCreators } from 'redux';

// system
import * as envActions from '../../actions/system/env/envActions';
import * as queryStringAction from '../../actions/system/env/queryStringAction';
import * as trackerActions from '../../actions/system/global/trackerActions';
import * as notificationActions from '../../actions/system/notifications/notificationActions';

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
});
