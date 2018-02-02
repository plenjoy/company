import qs from 'qs';
import { request } from '../middlewares/api';
import {GET_ENV, GET_USERINFO, SAVE_PHOTO_INFO} from '../constants/apiUrls';
import {errorTypes} from '../constants/string';
import AppStore from '../stores/AppStore';
import {formatSavedImagesData} from '../utils';

export function loadDomainUrls() {
  return request(GET_ENV())
    .then(res => res.env)
    .catch(res => {
      throw errorTypes.NETWORK_ERROR;
    });
}

export function loadSessionUserInfo() {
  return request(GET_USERINFO({
    baseUrl: AppStore.env.baseUrl
  }))
    .then(({userSessionData: res}) => {
      switch (+res.status.code) {
        case 200:
          return res.user;
        default:
          throw errorTypes.LOGIN_FAIL;
      }
    })
}

export function createProduct(images = []) {
  const formattedImages = formatSavedImagesData(images);

  const headers = {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  const data = qs.stringify({
    customerId: AppStore.userInfo.id,
    data: JSON.stringify(formattedImages)
  });

  return request(SAVE_PHOTO_INFO({
    baseUrl: AppStore.env.baseUrl
  }), 'POST', headers, data);
}