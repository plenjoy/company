import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_PRODUCT_PRICE } from '../../constants/apiUrl';
export function getProductPrice(setting) {
  return (dispatch, getState) => {

    // TODO: price影响的参数需要变更
    const options = [
      setting.size,
      setting.numberOfMonth,
      setting.dateStyle
    ].join(',');
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PRODUCT_PRICE,
          params: {
            baseUrl,
            options,
            product: setting.product
          }
        }
      }
    });
  };
}
