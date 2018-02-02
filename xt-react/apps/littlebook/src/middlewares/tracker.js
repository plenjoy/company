import { get } from 'lodash';
import trackerConfig from '../contants/trackerConfig';
import { ADD_TRACKER } from '../contants/actionTypes';
import { clientType } from '../contants/strings';
import { goTracker } from '../../../common/utils/tracker';

export default store => next => (action) => {
  const state = store.getState();
  const qs = get(state, 'system.env.qs');
  const isPreview = qs && qs.get('isPreview');
  const project = get(state, 'project.data.present');
  const product = project && project.getIn(['setting', 'product']);
  const projectId = project && project.get('projectId');
  const additionalParam = `${clientType}_${product},${projectId}`;

  if (!isPreview && product && projectId !== -1) {
    if (action.type === ADD_TRACKER) {
      goTracker(`${additionalParam},${action.param}`);
    } else if (action.type in trackerConfig) {
      goTracker(`${additionalParam},${trackerConfig[action.type]}`);
    }
  }

  return next(action);
};
