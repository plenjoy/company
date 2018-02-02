import { webClientId } from '../constants/string';
import { getRandomNum } from '../../../common/utils/math';
import securityString from '../../../common/utils/securityString';
import qs from 'qs'
// 获取网络请求环境
export const GET_ENV = () =>
  `/userid/getEnv?webClientId=${webClientId}&autoRandomNum=${getRandomNum()}`;

// 获取用户信息
export const GET_USERINFO = ({baseUrl}) =>
  `${baseUrl}BigPhotoBookServlet/getSessionUserInfo?webClientId=${webClientId}&autoRandomNum=${getRandomNum()}`;

// 获取TimeLine图片
export const GET_TIMELINE_IMAGES = ({baseUrl, userId, start, limit, orderType}) =>
  `${baseUrl}web-api/customerId/${userId}/getCustomerImage.ep?webClientId=${webClientId}&start=${start}&limit=${limit}&autoRandomNum=${getRandomNum()}&orderType=1`;

// 获取project图片
export const GET_PROJECT_IMAGES = ({baseUrl, userId, start, limit, orderType}) =>
  `${baseUrl}web-api/customerId/${userId}/getCustomerImage.ep?webClientId=${webClientId}&start=${start}&limit=${limit}&autoRandomNum=${getRandomNum()}&orderType=2`;

// 生成图片地址
export const GET_IMAGE_SRC = ({baseUrl, qualityLevel = '0', pUid, renderSize = 'fit350'}) =>
  `${baseUrl}upload/UploadServer/PicRender?qaulityLevel=${qualityLevel}&puid=${pUid}&rendersize=${renderSize}&${qs.stringify(securityString)}`;

export const SAVE_PHOTO_INFO = ({baseUrl, customerId}) =>
  `${baseUrl}web-api/customer/updateMyPhotosInfo`;
