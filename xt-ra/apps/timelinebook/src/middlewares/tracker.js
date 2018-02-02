import { get } from 'lodash';
import { ADD_TRACKER } from '../constants/actionTypes';
import trackerConfig from '../constants/trackerConfig';
import { clientType } from '../constants/strings';
import { goTracker } from '../../../common/utils/tracker';

export default store => next => (action) => {
  const state = store.getState();
  const qs = get(state, 'system.env.qs');
  const isPreview = qs && qs.get('isPreview');
  const projects = get(state, 'projects');

  const product = projects && projects.data.getIn(['summary', 'product']);
  const ProjectId = projects && projects.data.getIn(['summary', 'projectId']) || '';

  const additionalParam = `${clientType}_${product}`;
  if (!isPreview && product) {
    if (action.type === ADD_TRACKER) {
      goTracker(`${additionalParam},${action.param}`);
    } else if (action.type in trackerConfig) {
      goTracker(`${additionalParam},${trackerConfig[action.type]}`);
    }
  }

  return next(action);
};
