import { observable, computed, action, reaction } from 'mobx';

import { actions, viewTypes, errorTypes } from '../constants/string';
import { loadDomainUrls, loadSessionUserInfo } from '../services/AppService';
import TimeLineStore from '../stores/TimeLineStore';
import ProjectListStore from '../stores/ProjectListStore';
import securityString from '../../../common/utils/securityString';

class AppStore {

  /**
   * App中存储DOM的容器
   * @type {null}
   */
  container = null;

  /**
   * 是否第一次加载过数据
   * @type {Boolean}
   */
  @observable isLoadedFirstData = false;

  @observable isFirstOnLoad = true;

  /**
   * PageHeader中的action按钮
   * @type {Array}
   */
  @observable actions = actions;

  /**
   * App中的阅览模式，timeline模式和project模式
   * @type {string}
   */
  @observable viewMode = viewTypes.TIMELINE;

  /**
   * App数据是否加载完成
   * @type {boolean}
   */
  @observable isInitialFinished = false;

  /**
   * App中用户的基本信息
   * @type {Object}
   */
  @observable userInfo = {};

  /**
   * App的运行环境url
   * @type {Object}
   */
  @observable env = {};

  @observable confirmModal = {
    isShow: false,
    onOkClick: () => {},
    confirmMessage: '',
    confirmTitle: '',
    onCancelClick: () => {}
  };

  @observable isLogin = null;
  @observable isPreviewPhotoModalShow = false;
  @observable selectPreviewPhotoInfo = {};
  @observable isTopTipShow = false;
  @observable isScrolling = false;
  @observable scrollingTipTop = 0;
  @observable imageCountInLine = 0;
  @observable ctrlKey = false;

  constructor() {
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.changeViewMode = this.changeViewMode.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.togglePreviewModal = this.togglePreviewModal.bind(this);
    this.changePreviewPhoto = this.changePreviewPhoto.bind(this);
    this.toggleTopTipVisibility = this.toggleTopTipVisibility.bind(this);
  }

  /**
   * 计算属性：获取projects和timeLine所有选中的图片
   * @return {Array} Image List
   */
  @computed get selectedImages() {
    const selectedImages = [
      ...ProjectListStore.selectedImages,
      ...TimeLineStore.selectedImages
    ];

    const filterImages = [];

    for(const selectedImage of selectedImages) {

      const hasDuplicatedImage = filterImages.some(
        filterImage => filterImage.id === selectedImage.id
      );

      if(!hasDuplicatedImage) {
        filterImages.push(selectedImage);
      }
    }

    return filterImages;
  }

  /**
   * 计算属性：根据viewMode来选择当前视图的滚动值
   * @returns {*}
   */
  @computed get scrollTop() {
    switch(this.viewMode) {
      case viewTypes.TIMELINE:
        return TimeLineStore.scrollTop;
      case viewTypes.PROJECT:
        return ProjectListStore.scrollTop;
      default:
        return 0;
    }
  }

  /**
   * 计算属性：设置scrollTop直接根据当前视图来设定滚动值
   * @param value
   */
  set scrollTop(value) {
    switch(this.viewMode) {
      case viewTypes.TIMELINE:
        TimeLineStore.scrollTop = value;
        break;
      case viewTypes.PROJECT:
        ProjectListStore.scrollTop = value;
        break;
    }
  }

  /**
   * 计算属性：获取projects和timeLine中所有图片的集合
   * @return {Array} allImages List
   */
  @computed get allImages() {
    switch (this.viewMode) {
      case viewTypes.TIMELINE: {
        return TimeLineStore.allImages;
      }
      case viewTypes.PROJECT: {
        return ProjectListStore.allImages;
      }
    }
  }

  /**
   * 获取滚动条提示语
   * @returns {String}
   */
  @computed get scrollingTip() {
    switch(this.viewMode) {
      case viewTypes.TIMELINE:
        return TimeLineStore.scrollingTip;
      case viewTypes.PROJECT:
        return ProjectListStore.scrollingTip;
      default:
        return '';
    }
  }

  /**
   * Action：改变登陆状态
   * @param {Boolean} isLogin
   */
  @action
  changeLoginStatus(isLogin) {
    this.isLogin = isLogin;
    this.isShowLoginModal = !isLogin;
  }

  closeConfirmModal() {
    this.confirmModal.isShow = false;
  }

  @action
  unSelectedAllImages(options = {}) {
    const excludeImage = options.exclude;

    const allImages = [...TimeLineStore.allImages, ...ProjectListStore.allImages];

    for(const image of allImages) {
      if(excludeImage != image) {
        image.isSelected = false;
      }
    }
  }

  toggleTopTipVisibility(isShow){
    this.isTopTipShow = isShow;
  }
  /**
   * Action：切换视图模式
   * @param {String} view ['TimeLine', 'ProjectList']
   */
  @action
  changeViewMode(view) {
    this.viewMode = view;
    window.scrollTo(0, this.scrollTop);
    this.syncSelectedImages();
  }

  syncSelectedImages() {
    for(let image of this.allImages) {
      const selectedImage = this.selectedImages.find(selectedImage => image.id === selectedImage.id);

      image.isSelected = !!selectedImage;
    }
  }

  /**
   * Action：切换 图片预览页面到前一页
   * @param {number} changeValue [-1, 1]
   */
  @action
  changePreviewPhoto(changeValue) {
    const currentIndex = this.selectPreviewPhotoInfo.index;
    const targetIndex = currentIndex + changeValue > 0
      ? ((currentIndex + changeValue) < (this.allImages.length -1)
          ? currentIndex + changeValue
          : this.allImages.length -1
        )
      : 0;
    this.selectPreviewPhotoInfo = {
      name: this.allImages[targetIndex].name,
      thumbnailUrl: this.allImages[targetIndex].thumbnailUrl,
      previewUrl: this.allImages[targetIndex].previewUrl,
      height: this.allImages[targetIndex].height,
      width: this.allImages[targetIndex].width,
      isSelected: this.allImages[targetIndex].isSelected,
      index: targetIndex,
      isLastImage: targetIndex == this.allImages.length -1
    };

    if(this.allImages.length - targetIndex <= 5) {
      this.loadMoreImages();
    }
  }

  loadMoreImages() {
    switch(this.viewMode) {
      case viewTypes.TIMELINE:
        return TimeLineStore.showMoreImages();
      case viewTypes.PROJECT:
        return ProjectListStore.showMoreProjects();
    }
  }

  /**
   * Action： 显示与隐藏 图片预览界面
   * @param {object} image 显示图片信息，关闭窗口时不传参。
   */
  @action
  togglePreviewModal(image) {
    this.isPreviewPhotoModalShow = !this.isPreviewPhotoModalShow;

    // 如果显示 预览页面的时候 不显示 滚动条。
    if (this.isPreviewPhotoModalShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    if(image) {
      let selectedIndex = -1;

      this.allImages.forEach((item, index) => {
        if(item.id === image.id) {
          selectedIndex = index;
        }
      });

      this.selectPreviewPhotoInfo = {
        name: image.name,
        thumbnailUrl: image.thumbnailUrl,
        previewUrl: image.previewUrl,
        height: image.height,
        width: image.width,
        index: selectedIndex,
        isSelected: image.isSelected,
        isLastImage: selectedIndex === this.allImages.length -1
      }
    }
  }

  @action
  onScroll() {
    if(!this.isScrolling) {
      setTimeout(() => {
        this.isScrolling = false;
      }, 1000);
    }

    const documentHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    this.isScrolling = true;

    this.scrollingTipTop =
      (windowHeight * windowHeight) / (2 * documentHeight) +
      (windowHeight / documentHeight) * scrollTop;

    this.scrollTop = scrollTop;
  }

  /**
   * 保存DOM容器
   * @param container
   */
  setContainer(container) {
    this.container = container;
  }

  @action
  onResize() {
    const paddingLeft = +window.getComputedStyle(this.container).paddingLeft.replace('px', '');
    this.imageCountInLine = Math.floor((this.container.offsetWidth - paddingLeft - 30 - 180 - 20) / 210);
  }

  @action
  resetAllImagesPosition() {
    for(const image of this.allImages) {
      image.initPoints();
    }
  }

  bindWindowEvents() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  removeWindowEvents() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  /**
   * 静态方法：返回AppStore单例
   * @returns {AppStore} AppStore
   */
  static getInstance() {
    if(!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  async requestAppData() {
    this.env = await loadDomainUrls();
    this.userInfo = await loadSessionUserInfo(this.env);
    securityString.customerId =this.userInfo.id;
    securityString.token = this.userInfo.authToken;
    securityString.timestamp = this.userInfo.timestamp;
  }

  @action
  showConfirmModal(options) {
    this.confirmModal = {
      ...this.confirmModal,
      ...options,
      isShow: true
    }
  }

  /**
   * 初始化AppStore数据
   */
  init() {
    this.isInitialFinished = false;

    this.requestAppData()
      .then(() => {
        this.isInitialFinished = true;
      })
      .catch(error => {
        this.isInitialFinished = true;

        switch (error) {
          case errorTypes.NETWORK_ERROR:
            this.showConfirmModal({
              confirmTitle: 'ERROR',
              confirmMessage: 'Your network is offline!',
              cancelButtonText: 'Cancel',
              onOkClick: () => {
                this.closeConfirmModal();
              }
            });
            break;

          case errorTypes.LOGIN_FAIL:
            this.showConfirmModal({
              confirmTitle: 'ERROR',
              confirmMessage: 'Please Log in!',
              cancelButtonText: 'Cancel',
              onOkClick: () => {
                window.location = '/sign-in.html';
                this.closeConfirmModal();
              }
            });
            break;

          default:
            break;
        }
      })
  }
}

export default AppStore.getInstance();
