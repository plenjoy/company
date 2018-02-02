import { CALL_API } from '../../middlewares/api';
import {
  GET_SPEC
} from '../../constants/apiUrl';
import { getUrl } from '../../../../common/utils/url';
import { getRandomNum } from '../../../../common/utils/math';

/**
 * action, 获取用户的会话信息
 */
export function getSpec(cover, size) {
  return (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const productBaseURL = urls.get('productBaseURL');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SPEC,
          params: {
            productBaseURL,
            cover,
            size,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}
