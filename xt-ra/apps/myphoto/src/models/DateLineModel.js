import {observable, computed, action} from 'mobx';

import ImageModel from './ImageModel';
import { viewTypes } from '../constants/string';
import { getDateTitle } from '../utils';

class DateLine {
  @observable date = '';
  @observable images = [];
  @observable topPosition = null;
  @observable bottomPosition = null;

  constructor(dateLine) {
    this.date = getDateTitle(dateLine.date);

    this.addImage.bind(this);
    this.addImages.bind(this);
  }

  @computed
  get isInView() {
    return this.topPosition === 'inside' ||
      this.bottomPosition === 'inside' ||
      (this.topPosition === 'above' && this.bottomPosition === 'below');
  }

  @action
  addImage(image) {
    image.type = viewTypes.TIMELINE;
    this.images.push(new ImageModel(image));
  }

  @action
  addImages(images) {
    for(const image of images) {
      this.addImage(image);
    }
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

export default DateLine;
