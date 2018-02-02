import { get } from 'lodash';
import { CALL_API } from '../../middlewares/api';
import { GET_PRODUCT_PRICE, GET_COUPON_DETAIL } from '../../contants/apiUrl';
export function getProductPrice(setting) {
  return (dispatch, getState) => {

    // TODO: price影响的参数需要变更
    const options = [
      setting.paperThickness,
      setting.paper,
      setting.cover,
      setting.size
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

export function getCouponDetail(couponId) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls').get('baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_COUPON_DETAIL,
          params: {
            baseUrl,
            couponId
          }
        }
      }
    });
  };
}
