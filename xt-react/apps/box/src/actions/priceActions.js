import { get } from 'lodash';
import { CALL_API } from '../middlewares/api';
import { GET_PRODUCT_PRICE } from '../contants/apiUrl';

export function getProductPrice(setting) {
  return (dispatch, getState) => {
    let options = [
      setting.size,
      setting.type,
      setting.cover,
      setting.leatherColor,
      setting.spineThickness,
      setting.finish,
      setting.dvdType,
      setting.dvdPrinted,
      setting.usbCapacities,
      setting.usbColor,
      setting.cameo,
      setting.cameoShape,
      setting.paper,
    ];

    options = options.filter(option => option && option !== 'none');

    options = options.join(',');
    
    const baseUrl = get(getState(), 'system.env.urls.baseUrl');
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
