import Immutable from 'immutable';
import { get } from 'lodash';
import { elementTypes } from '../contants/strings';
import {
  PhotoElement,
  TextElement,
  StickerElement,
  BackgroundElement
} from '../../../common/struct/photobook/Element';

let timer = null;

function checkElementArray(
  elementArray,
  imageArray,
  stickerArray,
  backgroundArray
) {
  elementArray.forEach(element => {
    switch (element.get('type')) {
      case elementTypes.photo: {
        const imageData = imageArray.find(
          o => o.get('encImgId') === element.get('encImgId')
        );

        PhotoElement(element.toJS(), imageData && imageData.toJS());
        break;
      }
      case elementTypes.text: {
        TextElement(element.toJS());
        break;
      }
      case elementTypes.sticker: {
        // const stickerData = stickerArray.find(
        //   o => o.get('code') === element.get('decorationId')
        // );

        // StickerElement(element.toJS(), stickerData && stickerData.toJS());
        break;
      }

      case elementTypes.background: {
        // const backgroundData = stickerArray.find(
        //   o => o.get('code') === element.get('backgroundId')
        // );

        // BackgroundElement(
        //   element.toJS(),
        //   backgroundData && backgroundData.toJS()
        // );
        break;
      }

      default:
    }
  });
}

function checkImageArray(imageArray) {
  if (imageArray.size) {
    const encImgIdArray = imageArray.map(o => o.get('encImgId'));

    const distinctEncImgIdSet = encImgIdArray.toSet();

    if (distinctEncImgIdSet.size !== encImgIdArray.size) {
      const error = new Error(`ImageArray has repeat item.`);

      throw error;
    }
  }
}

export function getDataFromState(state) {
  const setting = get(state, 'project.data.setting');
  const pageArray = get(state, 'project.data.pageArray.present');
  const cover = get(state, 'project.data.cover.present');
  const containers = cover.get('containers');
  const imageArray = get(state, 'project.data.imageArray');
  const backgroundArray = get(state, 'project.data.backgroundArray');
  const stickerArray = get(state, 'project.data.stickerArray');
  const property = get(state, 'project.data.property');
  const bookSetting = get(state, 'project.data.bookSetting');
  const parameterMap = get(state, 'project.data.parameterMap');
  const variableMap = get(state, 'project.data.variableMap');

  const configurableOptionArray = get(
    state,
    'spec.data.configurableOptionArray'
  );
  const allOptionMap = get(state, 'spec.data.allOptionMap');
  const parameterArray = get(state, 'spec.data.parameterArray');
  const variableArray = get(state, 'spec.data.variableArray');

  const urls = get(state, 'system.env.urls');
  const queryStringObj = get(state, 'system.env.qs');
  const capabilities = get(state, 'system.capabilities');

  const currentPageId = get(state, 'system.global.pagination').get('pageId');
  const snipping = get(state, 'system.global.snipping');
  const ratioMap = get(state, 'system.global.ratio');

  let thePage = null;
  let theContainer = null;
  let elementArray = Immutable.List();
  let elementPageIdMap = Immutable.Map();

  if (pageArray && pageArray.size) {
    pageArray.forEach(page => {
      if (page.get('id') === currentPageId) {
        thePage = page;
      }

      page.get('elements').forEach(element => {
        elementPageIdMap = elementPageIdMap.set(
          element.get('id'),
          page.get('id')
        );
      });

      elementArray = elementArray.concat(page.get('elements'));
    });
  }

  if (containers && containers.size) {
    containers.forEach(container => {
      if (container.get('id') === currentPageId) {
        theContainer = container;
      }

      container.get('elements').forEach(element => {
        elementPageIdMap = elementPageIdMap.set(
          element.get('id'),
          container.get('id')
        );
      });

      elementArray = elementArray.concat(container.get('elements'));
    });
  }

  const currentPage = thePage || theContainer;

  const userId = get(state, 'system.env.userInfo').get('id');
  const fontList = get(state, 'system.fontList');

  const isTestEnv = /^.*\.com\.t.*$/.test(urls.get('baseUrl'));

  if (__DEVELOPMENT__ || isTestEnv) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      checkImageArray(imageArray);
      checkElementArray(
        elementArray,
        imageArray,
        stickerArray,
        backgroundArray
      );
    }, 500);
  }

  return {
    setting,
    bookSetting,
    cover,
    containers,
    elementArray,
    pageArray,
    imageArray,
    backgroundArray,
    stickerArray,
    property,
    parameterMap,
    variableMap,
    elementPageIdMap,

    configurableOptionArray,
    allOptionMap,
    parameterArray,
    variableArray,

    queryStringObj,
    capabilities,
    urls,
    currentPage,
    snipping,
    ratioMap,

    userId,
    fontList
  };
}
