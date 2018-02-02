import Immutable from 'immutable';
import { merge, min, get } from 'lodash';

import { supportedImagesTypes } from '../../../../../common/utils/strings';
import {
  ADD_IMAGES,
  UPLOAD_COMPLETE,
  AUTO_ADD_PHOTO_TO_CANVAS,
  CREATE_ELEMENT,
  RETRY_IMAGE,
  CLEAR_IMAGES,
  UPLOAD_ALL_COMPLETED
} from '../../../contants/actionTypes';
import { pageTypes } from '../../../contants/strings';
import { getCropOptions } from '../../../utils/crop';

import { checkIsImageCover } from '../../../utils/sizeCalculator';

import { createPhotoElement, createCoverPagePhotoElement, updateElementByTemplate } from '../../../utils/elementHelper';

import { getTemplateIdOnCreate } from '../../../utils/customeTemplate';

const getPageElements = (page, elementArray) => {
  const elements = [];

  const ids = page.get('elements');
  if (ids && ids.size) {
    ids.forEach((id) => {
      const element = elementArray.find(ele => ele.get('id') === id);
      if (element) {
        elements.push(element);
      }
    });
  }
  return elements;
};

const getPageAndElementAlign = (state) => {
  let page;
  let isLeft = true;
  const pageArray = state.project.data.present.get('pageArray');
  const elementArray = state.project.data.present.get('elementArray');

  if (pageArray && pageArray.size) {
    const sheetPages = pageArray.filter(p => p.get('type') === pageTypes.sheet);

    if (sheetPages && sheetPages.size) {
      for (let i = 0; i < sheetPages.size; i++) {
        const elements = getPageElements(sheetPages.get(i), elementArray);

        // 如果当前的page上的elements为空.那么就添加到该page的左侧.
        if (elements.length === 0) {
          page = sheetPages.get(i);
          isLeft = true;
          break;
        } else if (elements.length === 1) {
          // 判断已有的元素是在左侧还是右侧.
          isLeft = !(elements[0].get('px') < 0.5);
          page = sheetPages.get(i);
          break;
        }
      }
    }
  }

  return { page, isLeft };
};

/**
 * 从state中, 获取封面的fullpage, spinepage和书脊的正面压线.
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
const getPageOptions = (state) => {
  let fullPage;
  let spinePage;
  let coverThickness;
  let expandingOverFrontcover = 0;

  const project = state.project.data.present;
  const containers = project.getIn(['cover', 'containers']);

  if (containers && containers.size) {
    fullPage = containers.find(page => page.get('type') === pageTypes.full && page.getIn(['backend', 'isPrint']));
    spinePage = containers.find(page => page.get('type') === pageTypes.spine);
  }

  expandingOverFrontcover = project.getIn(['parameterMap', 'spineExpanding', 'expandingOverFrontcover']);
  coverThickness = project.getIn(['parameterMap', 'coverThickness']);

  return { fullPage, spinePage, expandingOverFrontcover, coverThickness };
};

/**
 * [description]
 * @param  {[type]} state         [description]
 * @param  {[type]} elementWidth  [description]
 * @param  {[type]} elementHeight [description]
 * @return {[type]}               [description]
 */
const getSuitableImage = (state, elementWidth, elementHeight) => {
  let image;

  const project = state.project.data.present;
  const imageArray = project.get('imageArray');

  const findBestSizeImage = (images, elementRatio) => {
    let img = null;

    if (images && images.size) {
      const newImageArray = images.map((m) => {
        const imageRatio = parseInt(m.get('width')) / parseInt(m.get('height'));

        return m.merge({
          ratioStep: Math.abs(elementRatio - imageRatio)
        });
      });

      img = newImageArray.minBy((m) => {
        return m.ratioStep;
      });
    }

    return img;
  };

  if (imageArray && imageArray.size) {
    const elementRatio = elementWidth / elementHeight;

    const horizontalImages = imageArray.filter(m => parseInt(m.get('width')) >= parseInt(m.get('height')));
    const verticalImages = imageArray.filter(m => parseInt(m.get('width')) < parseInt(m.get('height')));

    // 先选择横版的图片.
    image = findBestSizeImage(horizontalImages, elementRatio);

    if (!image) {
      // 如果没有找到, 就选择一张竖版的图片.
      image = findBestSizeImage(verticalImages, elementRatio);
    }
  }

  return image;
};

/**
 * 获取元素的encimageId
 * @param  {[type]} elements  [description]
 * @param  {[type]} elementId [description]
 * @return {[type]}           [description]
 */
const getEncImageId = (elements, elementId) => {
  const element = elements.find((ele) => {
    return ele.get('id') === elementId;
  });
  return element ? element.get('encImgId') : '';
};

export function addImages(files) {
  return (dispatch, getState) => {
    const state = getState();
    const { system } = state;

    // 未登录不上传
    if (!system.env.userInfo) {
      return false;
    }


    // 将格式不对的图片排到前面
    files.sort((item) => {
      return supportedImagesTypes.indexOf(item.type) !== -1;
    });

    dispatch({ type: ADD_IMAGES, files });
    window.__ADD_IMAGES_TIME = new Date().getTime();
    return true;
  };
}

export function uploadComplete(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: UPLOAD_COMPLETE,
      fields
    });

    return Promise.resolve();
  };
}

/**
 * 所有的图片上传完成时, 触发的action.
 * @return {[type]} [description]
 */
export function uploadAllCompleted() {
  return (dispatch, getState) => {
    dispatch({
      type: UPLOAD_ALL_COMPLETED
    });

    return Promise.resolve();
  };
}

export function retryImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: RETRY_IMAGE,
      guid
    });
  };
}

/*
 * 用于设置, 在图片上传完成后, 自动添加到画布中去.
 * @param {boolean} status true: 自动添加到画布, false: 不需要添加
 * @param {string} spreadId
 * @param targetWidth 当前容器, 或画布的宽, 用于图片裁剪
 * @param targetHeight 当前容器, 或画布的高, 用于图片裁剪
 * @returns {{type, status: *, spreadId: *, targetWidth: *, targetHeight: *}}
 */
export function autoAddPhotoToCanvas(params) {
  return {
    type: AUTO_ADD_PHOTO_TO_CANVAS,
    params
  };
}

export function clearAllImages() {
  return {
    type: CLEAR_IMAGES
  };
}

