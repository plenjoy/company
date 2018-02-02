import {observable, computed, action} from 'mobx';

import AppStore from './AppStore';
import ProjectListStore from './ProjectListStore';
import TimeLineStore from './TimeLineStore';

import { viewTypes } from '../constants/string';

const selectionIgnoreClasses = [
  'top-tip',
  'icon-close',
  'ImageGrid__cover',
  'ImageGrid__image',
  'ImageGrid__loading',
  'ImageGrid__imageContainer',
  'ShowMore',
  'ShowMore__text',
  'ShowMore__icon',
  'Header__menus--item',
  'Header__menus--item-text',
  'SideBar__item',
  'SideBar__item--link',
  'SideBar__item--input'
];

class Selection {

  isUnselectedAll = false;

  constructor() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  @observable selectedItem = [];
  @observable isSelectReady = false;
  @observable isDragSelecting = false;
  @observable startPoint = null;
  @observable endPoint = null;
  @observable p1 = null;
  @observable p2 = null;

  @computed get container() {
    switch(AppStore.viewMode) {
      case viewTypes.TIMELINE:
        return TimeLineStore.container;
      case viewTypes.PROJECT:
        return ProjectListStore.container;
      default:
        return null;
    }
  }

  @computed get style() {
    let style = {};

    if(!this.p1 || !this.p2) return style;

    if (this.p2.x > this.p1.x) {
      style.left = this.p1.x;
      style.width = this.p2.x - this.p1.x;
    } else {
      style.left = this.p2.x;
      style.width = this.p1.x - this.p2.x;
    }

    if (this.p2.y > this.p1.y) {
      style.top = this.p1.y;
      style.height = this.p2.y - this.p1.y;
    } else {
      style.top = this.p2.y;
      style.height =  this.p1.y - this.p2.y;
    }

    style.area = style.height * style.width;

    return style;
  }

  @action
  onMouseDown(e) {
    if(e.pageY < 50 || e.pageX > document.body.clientWidth) return;

    if(!this.container) return;

    const offsetLeft = this.container.getBoundingClientRect().left;

    if (
      e.pageY < this.container.offsetTop ||
      e.pageX > (offsetLeft + this.container.offsetWidth) ||
      e.pageY > (this.container.offsetTop + this.container.offsetHeight)) return;

    const classList = [].slice.call(e.target.classList);

    if(!(classList.some((item) => selectionIgnoreClasses.indexOf(item) !== -1)) && !(e.ctrlKey || e.metaKey)) {
        AppStore.unSelectedAllImages();
    }

    this.onSelectReady(e);
  }

  onMouseMove(e) {
    if(e.pageY < 50 )return;

    if(!this.isSelectReady) return;

    this.onSelect(e);

    if(this.style.area > 4 && !(e.ctrlKey || e.metaKey) && !this.isUnselectedAll) {
      AppStore.unSelectedAllImages();
      this.isUnselectedAll = true;
    }
  }

  onMouseUp(e) {
    this.onSelectStop();
  }

  @action
  onSelectReady(e) {
    this.isSelectReady = true;
    this.p1 = {
      x: e.pageX - this.container.offsetLeft,
      y: e.pageY - this.container.offsetTop
    };
  }

  @action
  onSelect(e) {
    this.isDragSelecting = true;
    this.p2 = {
      x: e.pageX - this.container.offsetLeft,
      y: e.pageY - this.container.offsetTop
    };

    this.startPoint = {
      x: this.p1.x > this.p2.x ? this.p2.x : this.p1.x,
      y: this.p1.y > this.p2.y ? this.p2.y : this.p1.y
    };

    this.endPoint = {
      x: this.p1.x > this.p2.x ? this.p1.x : this.p2.x,
      y: this.p1.y > this.p2.y ? this.p1.y : this.p2.y
    };
  }

  @action
  onSelectStop() {
    this.isDragSelecting = false;
    this.isSelectReady = false;
    this.p1 = null;
    this.p2 = null;
    this.startPoint = null;
    this.endPoint = null;
    this.isUnselectedAll = false;
  }

  bindWindowEvents() {
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  removeWindowEvents() {
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  static getInstance() {
    if(!Selection.instance) {
      Selection.instance = new Selection();
    }
    return Selection.instance;
  }
}

export default Selection.getInstance();
