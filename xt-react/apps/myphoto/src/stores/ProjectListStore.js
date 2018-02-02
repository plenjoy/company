import {observable, action, computed} from 'mobx';

import ProjectModel from '../models/ProjectModel';
import {loadProjects} from '../services/ProjectService';
import AppStore from '../stores/AppStore';

class ProjectListStore {
  /**
   * requestApi请求参数
   * @type {{start: number, limit: number}}
   */
  requestOption = {
    start: 0,
    limit: 4
  };

  container = null;

  scrollTop = 0;

  constructor() {
    this.showMoreProjects = this.showMoreProjects.bind(this);
  }

  @observable projects = [];
  @observable imageCountInLine = 0;

  /**
   * 计算属性：获取所有projects下面选中的图片
   *
   * @return {Array} Image List
   */
  @computed get selectedImages() {
    let selectedImages = [];

    for (let project of this.projects) {
      const selectedProjectImages = project.images
        .filter(image => image.isSelected);

      selectedImages = [...selectedImages, ...selectedProjectImages];
    }

    return selectedImages;
  }

  @computed get allImages() {
    let allImages = [];

    for(const project of this.projects) {
      allImages = [...allImages, ...project.images];
    }

    return allImages;
  }

  /**
   * Action：浏览器窗口发生时，计算project div宽度
   */
  @action
  setImageCount(event) {
    this.imageCountInLine = (event.offsetWidth + 20) / 190;
  }

  @computed
  get scrollingTip() {
    for (const project of this.projects) {
      if (project.isInView) {
        return project.name;
      }
    }
  }

  @action
  unSelectedAllImages() {
    for (const project of this.projects) {
      for (const image of project.images) {
        image.isSelected = false;
      }
    }
  }

  /**
   * 加载更多TimeLine图片
   * @returns {Promise.<*>}
   * @private
   */
  async _requestMoreProjects() {
    const projects = await loadProjects(this.requestOption);
    this.requestOption.start += this.requestOption.limit;
    return projects;
  }

  /**
   * Action：加载更多的projects
   * @param {Number} length 项目数量
   * @returns {Boolean} isShowMore
   */
  @action
  async showMoreProjects() {
    const length = this.requestOption.limit;
    let isProjectEnd = false;
    let hiddenProjects = [];

    do {
      hiddenProjects = this._findHideProject(length);

      if(hiddenProjects.length < length) {
        const newProjects = await this._requestMoreProjects();
        this.addProjects(newProjects);

        if(newProjects.length === 0) {
          isProjectEnd = true;
        }
      }
    } while(!isProjectEnd && hiddenProjects.length < length);

    for (const project of hiddenProjects) {
      project.show();
    }

    AppStore.syncSelectedImages();
    AppStore.isLoadedFirstData = true;
  }

  /**
   * Action：在ProjectList中添加一个project
   * @param {Object} project
   */
  @action
  addProject(project) {
    this.projects.push(new ProjectModel(project));
  }

  resetAllImagesPosition() {
    for (const project of this.projects) {
      for (const image of project.images) {
        image.initPoints();
      }
    }
  }

  /**
   * Action：在ProjectList中添加多个projects
   * @param {Array} projects
   */
  addProjects(projects = []) {
    for (const project of projects) {
      this.addProject(project);
    }
  }

  /**
   * 找projects中被隐藏的projects
   * @param length
   * @returns {Array}
   * @private
   */
  _findHideProject(length = 1) {
    let hideProjectCount = 0;
    let hideProjects = [];

    for (const project of this.projects) {
      if (hideProjectCount >= length) break;

      if (!project.isShow && project.images.length !== 0) {
        hideProjects.push(project);
        hideProjectCount++;
      }
    }

    return hideProjects;
  }

  /**
   * 记录ProjectList的DOM元素，方便计算DOM尺寸
   * @param {HTMLElement} container
   */
  setContainer(container) {
    this.container = container;
  }

  /**
   * 静态方法：返回ProjectListStore单例
   * @returns {ProjectListStore} ProjectListStore
   */
  static getInstance() {
    if (!ProjectListStore.instance) {
      ProjectListStore.instance = new ProjectListStore();
    }
    return ProjectListStore.instance;
  }
}

export default ProjectListStore.getInstance();
