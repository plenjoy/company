import {observable, computed, autorun, action} from 'mobx';
import {isCollision} from '../utils';

import AppStore from '../stores/AppStore';
import TimeLineStore from '../stores/TimeLineStore';
import ProjectListStore from '../stores/ProjectListStore';
import { viewTypes } from '../constants/string';

class Image {
  @observable name = '';
  @observable isLoaded = false;
  @observable isPreSelected = false;
  @observable isDragSelected = false;
  container = null;
  points = {};

  constructor(image) {
    this.id = image.id;
    this.guid = image.guid;
    this.encImgId = image.encImgId;
    this.name = image.name;
    this.shortName = image.shortName;
    this.width = image.width;
    this.height = image.height;
    this.size = image.size;
    this.imageType = image.imageType;
    this.imageVersion = image.imageVersion;
    this.regionCode = image.regionCode;
    this.status = image.status;
    this.createTime = image.createTime;
    this.uploadTime = image.uploadTime;
    this.shotTime = image.shotTime;
    this.url = image.url;
    this.type = image.type;
    this.thumbnailUrl = image.thumbnailUrl;
    this.previewUrl = image.previewUrl;
    this.orientation = image.orientation;

    this.toggleSelect = this.toggleSelect.bind(this);
    this.loadComplete = this.loadComplete.bind(this);

    autorun(() => {
      const {default: SelectionStore} = require('../stores/SelectionStore');
      const {isDragSelecting, startPoint, endPoint, style} = SelectionStore;
      const {viewMode} = AppStore;

      if(viewMode !== this.type || style.area < 4) return;

      // 框选状态时初始化isDragSelected表示为false，非框选状态不处理
      if(isDragSelecting) {
        this.isDragSelected = false;
      }

      // 检查有没有在框选范围内
      if(this.container && startPoint && endPoint && this.points.topLeft && this.points.bottomRight) {
        if(isCollision(this.points.topLeft, this.points.bottomRight, startPoint, endPoint)) {
          this.isDragSelected = true;
        }
      }

      // 非框选状态时，查看图片有没有被框选选中，选中的就真的选中
      if(!isDragSelecting) {
        if(this.isDragSelected) {
          this.isPreSelected = true;
        }

        this.isDragSelected = false;
      }
    })
  }

  @computed get isSelected() {
    const {default: SelectionStore} = require('../stores/SelectionStore');
    const {isDragSelecting} = SelectionStore;

    if(isDragSelecting) {
      return this.isPreSelected || this.isDragSelected;
    } else {
      return this.isPreSelected;
    }
  }

  set isSelected(value) {
    this.isPreSelected = value;
    this.isDragSelected = value;
  }

  @action
  loadComplete(e) {
    this.isLoaded = true;
  }

  @action
  toggleSelect(e) {
    if(!(e.ctrlKey || e.metaKey)) {
      AppStore.unSelectedAllImages({exclude: this});
    }

    this.isPreSelected = !this.isPreSelected;
  }

  @action
  setImageSelected(value) {
    this.isPreSelected = true;
  }

  @action
  setDragSelected(value) {
    this.isDragSelected = value;
  }

  setContainer(container) {
    this.container = container;
    setTimeout(() => this.initPoints(), 1000);
  }

  checkPoint(point, p1, p2) {
    return point.x > p1.x && point.x < p2.x &&
      point.y > p1.y && point.y < p2.y;
  }

  initPoints() {
    if(!this.container) return;

    const {
      top: containerOffsetTop,
      left: containerOffsetLeft,
      width: containerOffsetWidth,
      height: containerOffsetHeight
    } = this.container.getBoundingClientRect();

    this.points = {
      topLeft: {
        x: containerOffsetLeft,
        y: this.container.offsetTop + 50
      },
      bottomRight: {
        x: containerOffsetLeft + containerOffsetWidth,
        y: this.container.offsetTop + containerOffsetHeight + 50
      }
    }
  }
}

export default Image
