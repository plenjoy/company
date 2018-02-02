import { get } from 'lodash';
import { ADD_TRACKER } from '../constants/actionTypes';
import { clientType } from '../constants/strings';
import { goTracker } from '../../../common/utils/tracker';

export default store => next => (action) => {
  // const state = store.getState();
  // const qs = get(state, 'system.env.qs');
  // const isPreview = qs && qs.get('isPreview');
  // const project = get(state, 'project.data.present');
  // const product = project && project.getIn(['setting', 'product']);
  // const ProjectId = project && project.get('projectId');

  // const additionalParam = `${clientType}_${product},${ProjectId}`;
  // if (!isPreview && product && ProjectId) {
  //   if (action.type === ADD_TRACKER) {
  //     goTracker(`${additionalParam},${action.param}`);
  //   } else if (action.type in trackerConfig) {
  //     goTracker(`${additionalParam},${trackerConfig[action.type]}`);
  //   }
  // }

  return next(action);
};
