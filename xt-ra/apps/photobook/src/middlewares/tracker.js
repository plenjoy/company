import { get } from 'lodash';
import trackerConfig from '../contants/trackerConfig';
import { ADD_TRACKER } from '../contants/actionTypes';
import { clientType } from '../contants/strings';
import { goTracker } from '../../../common/utils/tracker';
import { getDataFromState } from '../utils/getDataFromState';

export default store => next => action => {
  const stateData = getDataFromState(store.getState());
  const { queryStringObj, property, setting } = stateData;
  const isPreview = queryStringObj.get('isPreview');

  const product = setting.get('product');
  const projectId = property.get('projectId');
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
