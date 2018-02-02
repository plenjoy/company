import { GET_ALBUMS_URL, GET_ALBUM_IMAGE_URL } from '../apiUrl';
import { formatAlbum, formatImage } from './helper';

const paginationLength = 100;

/**
 * 获取相册数据
 */
export async function getAlbums() {
  // 获取basicUrl
  const userId = this.GoogleUser.getBasicProfile().getId();
  const basicUrl = GET_ALBUMS_URL(userId);

  // 设置 总数/起始页/结果 初始值
  let totalCount = 0;
  let currentIndex = 1;
  let resultAlbums = [];

  // 循环执行
  do {
    const params = {
      'kind': 'album',
      'max-results': paginationLength,
      'start-index': currentIndex
    };

    // 向googleAPI请求数据
    let response = JSON.parse(await (await this.request(basicUrl, params)).text());
    let albumsData = response.feed.entry;
    totalCount = response.feed['openSearch$totalResults'].$t;

    // 防止没有数据无限循环
    if(!albumsData || this.isCancelRequest) break;

    // 格式化数据
    albumsData = albumsData.map(albumData => formatAlbum(albumData));
    // 组合请求结果
    resultAlbums = resultAlbums.concat(albumsData);
    // 分页结果累加
    currentIndex += paginationLength;

  } while(resultAlbums.length < totalCount);

  // 清除中断标记
  if(this.isCancelRequest) {
    this.clearPendingRequest();
  }

  return resultAlbums;
}

/**
 * 获取相册图片
 * @param {albumId, callback} options
 */
export async function getAlbumImages({albumId, callback}) {
  // 获取basicUrl
  const userId = this.GoogleUser.getBasicProfile().getId();
  const basicUrl = GET_ALBUM_IMAGE_URL(userId, albumId);

  this.GoogleAuth = gapi.auth2.getAuthInstance();
  this.GoogleUser = this.GoogleAuth.currentUser.get();
  this.accessToken = this.GoogleUser.getAuthResponse().access_token;

  // 设置 总数/起始页/结果 初始值
  let totalCount = 0;
  let currentIndex = 1;
  let resultPhotos = [];

  // 循环执行
  do {
    const params = {
      'kind': 'photo',
      'max-results': paginationLength,
      'start-index': currentIndex,
      'imgmax': 'd'
    };

    let response = null;
    let photosData = [];

    try {
      // 向googleAPI请求数据
      response = JSON.parse(await (await this.request(basicUrl, params)).text());
      photosData = response.feed.entry;
      totalCount = response.feed['openSearch$totalResults'].$t;
    } catch(e) {
      throw {code: 190};
    }

    // 防止没有数据无限循环
    if(!photosData || this.isCancelRequest) break;

    // 去掉video和gif
    photosData = photosData.filter(photoData => !(/*photoData['gphoto$videostatus'] || */ photoData['content']['type'] === 'image/gif'));
    // 格式化数据
    photosData = photosData.map(photoData => formatImage(photoData));
    // 组合请求结果
    resultPhotos = resultPhotos.concat(photosData);
    // 回调中间结果
    callback && callback(photosData);
    // 分页结果累加
    currentIndex += paginationLength;

  } while(resultPhotos.length < totalCount);

  // 清除中断标记
  if(this.isCancelRequest) {
    this.clearPendingRequest();
  }

  return resultPhotos;
}
