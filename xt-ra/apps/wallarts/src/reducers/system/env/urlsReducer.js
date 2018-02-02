import Immutable from 'immutable';
import { get, template } from 'lodash';
import { API_SUCCESS } from '../../../constants/actionTypes';
import { GET_ENV, IMAGES_CROPPER } from '../../../constants/apiUrl';

const initialState = Immutable.Map();
/**
 * cookies的reducer, 把新获取的cookie更新到store.
 * @param state
 * @param action
 */
const urls = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === GET_ENV) {
        const result = action.response;
        const newState = state.merge(result.env, {
          liveUpdateCropImage: template(IMAGES_CROPPER)(get(result, 'env'))
        });

        return newState;
      }
      return state;
    default:
      return state;
  }
};

export default urls;
