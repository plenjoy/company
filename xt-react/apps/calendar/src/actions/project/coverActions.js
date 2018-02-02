import qs from 'qs';

import { get } from 'lodash';
import Immutable from 'immutable';
import * as apiUrl from '../../constants/apiUrl';
import {
  SET_COVER,
  CHANGE_PROJECT_PROPERTY
} from '../../constants/actionTypes';
import { defaultBorder, elementTypes } from '../../constants/strings';
import { CALL_API } from '../../middlewares/api';
import { getDataFromState } from '../../utils/getDataFromState';
import { updateElementsByTemplate } from '../../utils/autoLayoutHepler';

export function uploadCoverImage(encodeImage) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, setting, snipping } = stateData;

    const userInfo = get(getState(), 'system.env.userInfo');
    const userInfoObj = userInfo.toJS();
    const timestamp = userInfoObj.timestamp;
    const token = userInfoObj.authToken;
    const customerId = userInfoObj.id;

    const uploadBaseUrl = urls.get('uploadBaseUrl');

    const projectId = property.get('projectId');
    const projectType = setting.get('product');

    if (
      !encodeImage ||
      (typeof encodeImage === 'string' &&
        encodeImage.substring(0, 50).length < 50)
    ) {
      return Promise.resolve();
    }

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.UPLOAD_COVER_IMAGE,
          params: {
            uploadBaseUrl,
            timestamp,
            token,
            customerId
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            projectid: projectId,
            encodeimage: encodeImage,
            projectType
          })
        }
      }
    });
  };
}

export function applyDefaultTemplateToCover(template) {
  return (dispatch, getState) => {
    let coverSpread = get(getState(), 'project.data.cover');
    let containers = coverSpread.get('containers');
    let coverPage = containers.get('0');

    coverPage = coverPage.setIn(['template', 'tplGuid'], template.id);

    let newElements = updateElementsByTemplate(
      coverPage,
      Immutable.List(),
      Immutable.List(),
      template
    );

    if (newElements && newElements.size) {
      newElements = newElements.map(element => {
        if (element.get('type') === elementTypes.photo) {
          return element.get('border') ? element.delete('border') : element;
        }
        return element;
      });
    }

    coverPage = coverPage.set('elements', newElements);
    containers = containers.set('0', coverPage);
    coverSpread = coverSpread.set('containers', containers);

    dispatch({
      type: CHANGE_PROJECT_PROPERTY,
      data: { isCoverDefaultTemplateUsed: true }
    });

    return dispatch({
      type: SET_COVER,
      cover: coverSpread
    });
  };
}
