import * as apiUrl from '../apiUrl';
import {
  formatImage,
  formatAlbum,
  albumsFields,
  photosFields
} from './helper';

/**
 * 获取Facebook用户账户下所有相册
 * 
 * @param {callback} Object 回调函数
 */
export async function getAlbums({callback}) {
  // 设置 下一次请求url/相册结果 的初始值
  let nextUrl = '';
  let resultAlbums = [];

  // 设置request的参数
  const params = {
    fields: albumsFields,
    limit: 100
  };

  this.clearPendingRequest();
  
  do {
    // 请求数据
    const {data, paging, error} = !nextUrl ? await this.request(apiUrl.GET_ALBUMS_URL(), params) : await this.request(nextUrl);
    // 如果有报错，终止请求
    if(error) throw error;
    // 如果没有数据结果或者中断请求
    if(!(data && data.length) || this.isCancelRequest) break;
    // 格式化数据
    const albumsData = data.map(albumData => formatAlbum(albumData));
    // 组装最终结果
    resultAlbums = [...albumsData, ...resultAlbums];
    // callback每次请求的结果
    callback && callback(albumsData);
    // 设置下一次请求的url
    nextUrl = paging && paging.next;
  } while(nextUrl);

  this.clearPendingRequest();
  return this.albums = resultAlbums;
}

/**
 * 获取Facebook用户某个相册下的所有图片
 * 
 * @param {*} param0 
 */
export async function getAlbumImages({ albumId, callback }) {
  // 设置 下一次请求url/相册结果 的初始值
  let nextUrl = '';
  let resultPhotos = [];

  // 设置request的参数
  const params = {
    fields: photosFields,
    type: 'uploaded',
    limit: 100
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
  } while(nextUrl);

  this.clearPendingRequest();
  return resultPhotos;
}
