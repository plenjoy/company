import * as authHandler from './utils/authHandler';
import * as photoHandler from './utils/photoHandler';
import * as requestHandler from './utils/requestHandler';
import * as timelineHandler from './utils/timelineHandler';

class Instagram {

  // 声明变量
  baseUrl = '';
  accessToken = '';
  isInitialized = false;
  isCancelRequest = false;

  constructor() {
    // 账号服务
    this.login = authHandler.login.bind(this);
    this.getUser = authHandler.getUser.bind(this);
    this.initPreLogin = authHandler.initPreLogin.bind(this);
    this.preLoginCallback = new Function();

    // 相册服务
    this.getAlbums = new Function();
    this.getAlbumImages = new Function();

    // 图片服务
    this.getImages = photoHandler.getImages.bind(this);
    this.getAllImages = photoHandler.getAllImages.bind(this);
    this.getAllImageCount = photoHandler.getAllImageCount.bind(this);

    // 时间线服务
    this.getTimeLinePhotos = timelineHandler.getTimeLinePhotos.bind(this);
    this.getTimeLinePhotosCount = timelineHandler.getTimeLinePhotosCount.bind(this);

    this.request = requestHandler.request.bind(this);
    this.cancelRequest = requestHandler.cancelRequest.bind(this);
    this.clearPendingRequest = requestHandler.clearPendingRequest.bind(this);
  }
}

export default Instagram;
