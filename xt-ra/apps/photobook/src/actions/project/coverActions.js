import qs from 'qs';
import { get, merge } from 'lodash';
import * as apiUrl from '../../contants/apiUrl';
import { CALL_API } from '../../middlewares/api';
import { getDataFromState } from '../../utils/getDataFromState';
import securityString from '../../../../common/utils/securityString';

export function uploadCoverImage(encodeImage) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, setting, snipping, system } = stateData;
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
            ...securityString
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
