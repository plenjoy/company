import { get } from 'lodash';
import { ADD_TRACKER } from '../contants/actionTypes';
import { clientType } from '../contants/strings';
import { goTracker } from '../../../common/utils/tracker';

export default store => next => (action) => {
  const state = store.getState();
  const project = get(state, 'project');
  const product = project && get(project, 'setting.product');
  const ProjectId = project && get(project, 'projectId');
  const additionalParam = `${clientType}_${product},${ProjectId}`;

  if (product && ProjectId) {
    if (action.type === ADD_TRACKER) {
      goTracker(`${additionalParam},${action.param}`);
    }
  }

  return next(action);
};
