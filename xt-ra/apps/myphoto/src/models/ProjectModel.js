import {action, observable, computed} from 'mobx';

import { viewTypes } from '../constants/string';
import ImageModel from './ImageModel';

class Project {
  @observable isShowMore = false;
  @observable images = [];
  @observable isShow = false;
  @observable topPosition = null;
  @observable bottomPosition = null;

  constructor(project = {}) {
    this.id = project.id;
    this.guid = project.guid;
    this.name = project.name;
    this.product = project.product;
    this.size = project.size;
    this.photoNum = project.photoNum;
    this.description = project.description;
    this.createTime = project.createTime;

    this.addImages(project.images);
  }

  @computed
  get isInView() {
    return this.topPosition === 'inside' ||
      this.bottomPosition === 'inside' ||
      (this.topPosition === 'above' && this.bottomPosition === 'below');
  }

  @action
  addImage(image) {
    image.type = viewTypes.PROJECT;
    this.images.push(new ImageModel(image));
  }

  @action
  addImages(images = []) {
    images.map(image => this.addImage(image));
  }

  @action
  show() {
    this.isShow = true;
  }

  @action
  changeTopPosition(event) {
    this.topPosition = event.currentPosition;
  }

  @action
  changeBottomPosition(event) {
    this.bottomPosition = event.currentPosition;
  }
}

export default Project
