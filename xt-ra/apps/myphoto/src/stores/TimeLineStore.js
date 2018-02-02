import {
  observable,
  computed,
  action,
  runInAction
} from 'mobx';
import DateLineModel from '../models/DateLineModel';
import { loadImages } from '../services/ImageService';
import { getDateTitle } from '../utils';
import { timeLineOrderType } from '../constants/string';
import AppStore from '../stores/AppStore';

class TimeLineStore {
  /**
   * requestApi请求参数
   * @type {{start: number, limit: number}}
   */
  requestOption = {
    start: 0,
    limit: 50
  };

  /**
   * TimeLine中已请求得到的image数据列表
   * @type {Array}
   */
  imageArray = [];

  /**
   * TimeLine中存储DOM的容器
   * @type {null}
   */
  container = null;

  /**
   * TimeLine中DOM的滚动值
   * @type {number}
   */
  scrollTop = 0;

  /**
   * 显示数据：dateLine列表
   * @type {Array}
   */
  @observable dateLines = [];

  /**
   * 计算属性：dateLine的选中图片
   * @returns {Array}
   */
  @computed
  get selectedImages() {
    let selectedImages = [];

    for(let dateLine of this.dateLines) {
      const selectedDateImages = dateLine.images
        .filter(image => image.isSelected);

      selectedImages = [...selectedImages, ...selectedDateImages];
    }

    return selectedImages;
  }

  @computed get allImages() {
    let allImages = [];

    for(const dateLine of this.dateLines) {
      allImages = [...allImages, ...dateLine.images];
    }

    return allImages;
  }

  @computed
  get scrollingTip() {
    for(const dateLine of this.dateLines) {
      if(dateLine.isInView) {
        return dateLine.date;
      }
    }
  }

  @action
  unSelectedAllImages() {
    for(const dateLine of this.dateLines) {
      for(const image of dateLine.images) {
        image.isSelected = false;
      }
    }
  }

  resetAllImagesPosition() {
    for(const dateLine of this.dateLines) {
      for(const image of dateLine.images) {
        image.initPoints();
      }
    }
  }

  // 私有方法
  //
  //

  /**
   * 在TimeLine中添加多张图片
   * @param images
   * @private
   */
  _addImages(images = []) {
    // 先对请求的图片进行排序
    images.sort(
      (preImage, nextImage) => nextImage[timeLineOrderType] - preImage[timeLineOrderType]
    );

    // 把排序完的图片存进imageArray备份，此时存的image是源数据
    this.imageArray = [...this.imageArray, ...images];

    // 再把单张图片push分组存进DateLine
    for(let image of images) {
      this._addImage(image);
    }
  }

  /**
   * 查找dateLine并存入单张Image
   * @param image
   * @private
   */
  @action
  _addImage(image) {
    // 查找有没有已经存在的dateLine
    const dateLine = this.dateLines.find(
      dateLine => dateLine.date === getDateTitle(image[timeLineOrderType])
    );

    if(dateLine) {
      // 把图片加入dateLine
      dateLine.addImage(image);
    } else {
      // 创建新的dateLine, 并且加入图片
      const newDateLine = new DateLineModel({date: image[timeLineOrderType]});
      this.dateLines.push(newDateLine);

      newDateLine.addImage(image);
    }
  }

  /**
   * 加载更多TimeLine图片
   * @returns {Promise.<*>}
   * @private
   */
  async _requestMoreImages() {
    const images = await loadImages(this.requestOption);
    this.requestOption.start += this.requestOption.limit;

    return images;
  }

  // 公共方法
  //
  //

  /**
   * 返回TimeLineStore单例
   * @returns {TimeLineStore} TimeLineStore
   * @public
   */
  static getInstance() {
    if(!TimeLineStore.instance) {
      TimeLineStore.instance = new TimeLineStore();
    }
    return TimeLineStore.instance;
  }

  /**
   * 显示更多图片
   * @returns {Promise.<void>}
   * @public
   */
  @action
  async showMoreImages() {

    !AppStore.isLoadedFirstData ? AppStore.isFirstOnLoad = true : AppStore.isFirstOnLoad = false
    const newImages = await this._requestMoreImages();
    this._addImages(newImages);

    AppStore.syncSelectedImages();
    AppStore.isLoadedFirstData = true;
    AppStore.isFirstOnLoad = false
  }

  /**
   * 保存DOM容器
   * @param container
   * @public
   */
  setContainer(container) {
    this.container = container;
  }
}

export default TimeLineStore.getInstance();
