import { CALL_API } from '../middlewares/api';
import { API_BASE, GET_ENV } from '../constants/apiUrl';
import { webClientId } from '../../../common/utils/strings';
import { getRandomNum } from '../../../common/utils/math';

/**
 * action, 获取环境变量, 如各种api的根路径
 */
export function getEnv() {
  return (dispatch) => {
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_ENV,
          params: {
            webClientId,
            baseUrl: API_BASE,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}
