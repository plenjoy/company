import qs from 'qs';
import { CALL_API } from '../../middlewares/api';
import { CONTACT_US } from '../../contants/apiUrl';
import { getUrl } from '../../../../common/utils/url';
import { webClientId } from '../../../../common/utils/strings';
import { getRandomNum } from '../../../../common/utils/math';
import { SHOW_CONTACT_US_MODAL, HIDE_CONTACT_US_MODAL } from '../../contants/actionTypes';

export function showContactUsModal() {
  return {
    type: SHOW_CONTACT_US_MODAL
  };
}

export function hideContactUsModal() {
  return {
    type: HIDE_CONTACT_US_MODAL
  };
}

export function handleSubmit(params) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');
    const {
      userId,
      userName,
      userEmail,
      projectName,
      projectId,
      os,
      browser,
      question,
      featureRequest,
      bug
    } = params;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: CONTACT_US,
          params: { baseUrl }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: qs.stringify({
            userId,
            userName,
            userEmail,
            sku: '',
            projectName,
            projectId,
            autoRandomNum: getRandomNum().toString(),
            webClientId: '1',
            os,
            browser,
            question,
            featureRequest,
            bug
          })
        }
      }
    });
  };
}
