import * as authHandler from './utils/authHandler';
import * as albumHandler from './utils/albumHandler';
// import * as photoHandler from './utils/photoHandler';
import * as requestHandler from './utils/requestHandler';
// import * as timelineHandler from './utils/timelineHandler';

class Google {

  // 声明变量
  baseUrl = '';
  accessToken = '';
  isInitialized = false;
  isCancelRequest = false;
  pendingRequestCount = 0;

  GoogleAuth = null;
  GoogleUser = null;

  constructor() {
    // 账号服务
    this.login = authHandler.login.bind(this);
    this.getUser = authHandler.getUser.bind(this);
    this.initPreLogin = new Function();
    this.preLoginCallback = new Function();

    // 相册服务
    this.getAlbums = albumHandler.getAlbums.bind(this);
    this.getAlbumImages = albumHandler.getAlbumImages.bind(this);

    // // 图片服务
    // this.getImages = photoHandler.getImages.bind(this);
    // this.getAllImages = photoHandler.getAllImages.bind(this);
    // this.getAllImageCount = photoHandler.getAllImageCount.bind(this);

    // // 时间线服务
    // this.getTimeLinePhotos = timelineHandler.getTimeLinePhotos.bind(this);
    // this.getTimeLinePhotosCount = timelineHandler.getTimeLinePhotosCount.bind(this);

    this.request = requestHandler.request.bind(this);
    this.cancelRequest = requestHandler.cancelRequest.bind(this);
    this.addRequestToPending = requestHandler.addRequestToPending.bind(this);
    this.clearPendingRequest = requestHandler.clearPendingRequest.bind(this);

    this.init = authHandler.init.bind(this);
    this.loadSDK = authHandler.loadSDK.bind(this);

    // google的初始化流程：加载sdk => 设置回调
    this.loadSDK().then(() => gapi.load('client:auth2', this.init));
  }
}

export default Google;
