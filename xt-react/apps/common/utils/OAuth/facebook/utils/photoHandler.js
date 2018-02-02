import * as apiUrl from '../apiUrl';
import {formatImage} from './helper';
import * as albumHandler from './albumHandler';

export async function getAllImageCount() {
  const albums = await albumHandler.getAlbums({});
  let imageCount = 0;

  for(const album of albums) {
    imageCount += album.count;
  }

  return imageCount;
}

export function getImages() {
  return new Promise((resolve, reject) => {

    const url = !nextUrl ? apiUrl.GET_USER_PHOTOS_URL() : nextUrl;

    FB.api(url, 'GET', {}, async ({data, paging}) => {
      const resultPhotos = [];

      for(const photo of data) {
        resultPhotos.push(formatImage(photo));
      }

      resolve({
        data: resultPhotos,
        nextUrl: paging && paging.next
      });
    });
  });
}

export function getImageById(id) {
  return new Promise((resolve, reject) => {
    FB.api(apiUrl.GET_IMAGE_BY_ID(id), 'GET', {}, photo => {
      resolve(formatImage(photo));
    });
  });
}
