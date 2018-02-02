import * as apiUrl from '../apiUrl';
import {getValidString, formatImage} from './helper';

export async function getAllImageCount() {
  const params = { access_token: this.accessToken };
  const response = await this.request(apiUrl.GET_USER_URL(), params);
  const {data: user} = await response.json();

  return user.counts.media;
}

export async function getAllImages({callback}) {
  // 设置 下一次请求url/图片结果 的初始值
  let nextUrl = '';
  let resultPhotos = [];

  // 设置request的参数
  const params = {
    access_token: this.accessToken,
    count: 100
  };

  do {
    // 发送请求
    const response = !nextUrl ? await this.request(apiUrl.GET_MEIDAS_URL(), params) : await this.request(nextUrl);
    const {data, pagination} = await response.json();
    let photosData = [];

    // 格式化图片数据
    for(const photoData of data) {
      // 设置图片组初始值
      let carouselPhotos = [];

      // 图片组为走马灯图片
      if(photoData.carousel_media) {
        carouselPhotos = photoData.carousel_media.map((carouselPhoto, index) => {
          const caption = index === 0 ? photoData.caption : null;
          return formatImage({...photoData, ...carouselPhoto, id: `${photoData.id}_carousel_${index}`, caption});
        });
      }
      // 图片组为单张图片
      else if(photoData.type === 'image') {
        carouselPhotos = [formatImage(photoData)];
      }

      // 图片组从新到旧排列
      carouselPhotos.reverse();
      photosData = [...photosData, ...carouselPhotos];
    }
    // 组装最终结果
    resultPhotos = [...photosData, ...resultPhotos];
    // callback每次请求的结果
    callback && callback(photosData);
    // 设置下一次请求的url
    nextUrl = pagination && pagination.next_url;
  } while(nextUrl);
}

export async function getImages(mediasUrl) {
  // 请求media信息
  const response = await jsonp(mediasUrl || apiUrl.GET_MEIDAS_URL(this.accessToken, 100));
  const {data, pagination} = await response.json();
  const resultPhotos = [];

  for(const photo of data) {
    // 如果是走马灯图片，分别存入result
    if(photo.carousel_media) {
      photo.carousel_media.forEach((carouselMedia, index) => {
        const caption = index === 0 ? photo.caption : null;
        resultPhotos.push(formatImage({...photo, ...carouselMedia, id: `${photo.id}_carousel_${index}`, caption}));
      });
      //不是走马灯图片，直接存入result
    } else {
      resultPhotos.push(formatImage(photo));
    }
  }

  return {
    data: resultPhotos,
    nextUrl: pagination && pagination.next_url
  }
}
