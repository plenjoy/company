import { request } from '../middlewares/api';
import { GET_TIMELINE_IMAGES } from '../constants/apiUrls';
import AppStore from '../stores/AppStore';
import { formatImagesInfo } from '../utils';

import getImageData from '../../test/data/timeLine';

export function loadImages(options) {
  const { start, limit } = options;

  return request(GET_TIMELINE_IMAGES({
    baseUrl: AppStore.env.baseUrl,
    userId: AppStore.userInfo.id,
    start,
    limit
  }), 'POST')
    .then(res => {
      let images = [];

      try {
        const orgImageList = JSON.parse(res.data);
        images = formatImagesInfo(orgImageList);
      } catch (e) {
      }

      return images;
    })
}