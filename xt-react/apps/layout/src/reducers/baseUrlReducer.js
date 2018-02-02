import { get, merge } from 'lodash';
import { API_SUCCESS } from '../constants/actionTypes';
import { GET_ENV } from '../constants/apiUrl';


/**
 * cookies的reducer, 把新获取的cookie更新到store.
 * @param state
 * @param action
 */
export const urls = (state = {}, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === GET_ENV) {
        const result = action.response;
        const baseUrl = get(result, 'env.baseUrl');
        const wwwBaseUrl = baseUrl ? baseUrl.replace(/portal/i, 'www') : '';

        return merge({}, result.env, { wwwBaseUrl });
      }
    default:
      return state;
  }
};
