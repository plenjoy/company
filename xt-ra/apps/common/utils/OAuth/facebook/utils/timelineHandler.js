import * as apiUrl from '../apiUrl';
import { formatImage, photosFields } from './helper';

/**
 * 获取timeline相册图片总数
 */
export async function getTimeLinePhotosCount() {
  const albums = await this.getAlbums({});
  let imageCount = 0;

  for(const album of albums) {
    if(album.name === 'Timeline Photos' || album.name === 'Mobile Uploads') {
      imageCount += album.count;
    }
  }

  return imageCount;
}

/**
 * 获取Facebook用户timeline相册下的所有图片
 * 
 * @param { timelineName, callback } timeline相册名，回调函数 
 */
export async function getTimeLinePhotos({ timelineName, callback }) {
  // 找到相应的albumId
  const albums = this.albums.length ? this.albums : await this.getAlbums({});
  const timeLineAlbum = albums.find(album => album.name === timelineName);
  const albumId = timeLineAlbum ? timeLineAlbum.id : '';

  // 设置 下一次请求url/相册结果 的初始值
  let nextUrl = '';
  let resultPhotos = [];

  if(albumId) {
    // 设置request的参数
    const params = {
      fields: photosFields,
      type: 'uploaded',
      limit: 30
    };

    this.clearPendingRequest();

    do {
      // 请求数据
      const {data, paging, error} = !nextUrl ? await this.request(apiUrl.GET_ALBUM_IMAGE_URL(albumId), params) : await this.request(nextUrl);
      // 如果有报错，终止请求
      if(error) throw error;
      // 如果没有数据结果或者中断请求
      if(!(data && data.length) || this.isCancelRequest) break;
      // 格式化数据
      const photosData = data.map(photoData => formatImage(photoData));
      // callback每次请求的结果
      callback && callback(photosData);
      // 组装最终结果
      resultPhotos = [...photosData, ...resultPhotos];
      // 设置下一次请求的url
      nextUrl = paging && paging.next;
    } while (nextUrl);
  }

  this.clearPendingRequest();
  return resultPhotos;
}