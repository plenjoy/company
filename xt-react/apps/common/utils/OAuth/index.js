import interfaces from './interfaces';

class OAuth {
  constructor(props) {
    this.authType = Object.keys(interfaces)[0];

    // 账号服务
    this.login = this.login.bind(this);
    this.getUser = this.getUser.bind(this);

    // 相册服务
    this.getAlbums = this.getAlbums.bind(this);
    this.getAlbumImages = this.getAlbumImages.bind(this);

    // 图片服务
    this.getImages = this.getImages.bind(this);
    this.getImageById = this.getImageById.bind(this);
    this.getAllImages = this.getAllImages.bind(this);
    this.getAllImageCount = this.getAllImageCount.bind(this);

    // 时间线服务
    this.getTimeLinePhotos = this.getTimeLinePhotos.bind(this);
    this.getTimeLinePhotosCount = this.getTimeLinePhotosCount.bind(this);

    this.cancelRequest = this.cancelRequest.bind(this);

    this._initAllAuth();
  }

  /**
   * 设置网站BaseUrl
   * @param {*} baseUrl 
   */
  setBaseUrl(baseUrl) {
    for(const oAuthName of Object.keys(interfaces)) {
      this[oAuthName].baseUrl = baseUrl.replace(/\.d\/*$/, '.dd/').replace(/\.t\/*$/, '.dd/');
      this[oAuthName].initPreLogin();
    }
  }

  /**
   * 设置OAuthType类型
   * 
   * @param {*} authType ['facebook'|'instagram'|'google']
   */
  setOAuthType(authType) {
    this.authType = authType;
  }

  /**
   * 授权登录
   * 
   * @return Promise(user)
   */
  login() {
    return this[this.authType].login();
  }

  /**
   * 获取登录用户信息
   * 
   * @return Promise(user)
   */
  getUser() {
    return this[this.authType].getUser();
  }

  /**
   * 获取所有照片
   * 
   * @return Promise(Array.photos)
   */
  getAllImages(callback) {
    return this[this.authType].getAllImages({callback});
  }

  /**
   * 获取相册信息
   * 
   * @param {*} options 
   * @return Promise(Array.albums)
   */
  getAlbums(callback) {
    return this[this.authType].getAlbums({callback});
  }

  /**
   * 根据相册ID来获取相册图片
   * 
   * @param {*} albumId 
   * @param {*} callback 
   */
  getAlbumImages(albumId, callback) {
    return this[this.authType].getAlbumImages({albumId, callback});
  }

  /**
   * 获取用户所有图片数量
   */
  getAllImageCount() {
    return this[this.authType].getAllImageCount();
  }

  /**
   * 获取用户所有timeline图片总数
   */
  getTimeLinePhotosCount() {
    return this[this.authType].getTimeLinePhotosCount();
  }

  /**
   * 获取用户所有timeline图片
   * @param {*} param0 
   */
  getTimeLinePhotos(timelineName, callback) {
    return this[this.authType].getTimeLinePhotos({timelineName, callback});
  }

  cancelRequest() {
    return this[this.authType].cancelRequest();
  }

  // getTimeLinePhotos(callback) {
  //   return this[this.authType].getTimeLinePhotos({callback});
  // }

  getImages(nextUrl) {
    return this[this.authType].getImages(nextUrl);
  }

  getImageById(id) {
    return this[this.authType].getImageById(id);
  }

  /**
   * 初始化所有第三方登录
   * @private 
   */
  _initAllAuth() {
    for(const oAuthName of Object.keys(interfaces)) {
      this[oAuthName] = new interfaces[oAuthName]();
    }
  }
}

export default new OAuth();
