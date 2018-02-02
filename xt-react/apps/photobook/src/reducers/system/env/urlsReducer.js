import { Map } from 'immutable';
import {get,template} from 'lodash';
import { API_SUCCESS } from '../../../contants/actionTypes';
import { GET_ENV, IMAGES_CROPPER } from '../../../contants/apiUrl';

const initialState = Map({});
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
        return state.merge(result.env, {
          templateThumbnailPrefx: `${result.env.layoutTemplateServerBaseUrl}TemplateThumbnail/`,
          stickerThumbnailPrefix: `${result.env.baseUrl}artwork/png/700/`,
          liveUpdateCropImage:template(IMAGES_CROPPER)(get(result, 'env'))
        });
      }
      return state;
    default:
      return state;
  }
};

export default urls;
