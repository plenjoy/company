import { get, sortBy, merge } from 'lodash';
import Immutable from 'immutable';
import { getInnerPageSize } from '../../../utils/sizeCalculator';
import { elementTypes } from '../../../constants/strings';

import { getCropOptions } from '../../../utils/crop';

let saveProjectTimer = null;

export const handleReplaceImage = (that, sortedImages, replacePageId) => {
  const {
    project,
    parameters,
    boundProjectActions,
    boundImagesActions
  } = that.props;
  const { baseSize, pageBleed } = parameters.toJS();
  const pageArray = get(project, 'pageArray');
  const useImage = sortedImages[0];
  let oldImageId = '';
  let newPageArray = Immutable.List();
  pageArray.some((page, index) => {
    if (page.get('id') === replacePageId) {
      let newElement = Immutable.Map();
      const elements = page.get('elements');
      const ele = elements.get('0');
      oldImageId = ele.get('encImgId');
      const isRotatedImage = Math.abs(useImage.orientation || 0) / 90 % 2 === 1;
      const pageRotate = isRotatedImage
        ? parseInt(useImage.width) <= parseInt(useImage.height)
        : parseInt(useImage.width) > parseInt(useImage.height);
      const pageSize = getInnerPageSize(baseSize, pageBleed);
      const pageWidth = pageRotate
        ? pageSize.height
        : pageSize.width;
      const pageHeight = pageRotate
        ? pageSize.width
        : pageSize.height;

      const { cropLUX, cropLUY, cropRLX, cropRLY } = getCropOptions(
        useImage.width,
        useImage.height,
        pageWidth,
        pageHeight,
        useImage.orientation || 0
      );

      newElement = ele.merge({
        encImgId: useImage.encImgId,
        imageid: useImage.imageId,
        imgRot: useImage.orientation || 0,
        width: pageWidth,
        height: pageHeight,
        cropLUX,
        cropLUY,
        cropRLX,
        cropRLY
      });

      const newPage = page.merge({
        width: pageWidth,
        height: pageHeight,
        elements: Immutable.List().push(newElement)
      });
      newPageArray = pageArray.set(
        String(index),
        newPage
      );
    }
  });

  boundProjectActions.deleteProjectImage(oldImageId);
  boundImagesActions.autoAddPhotoToCanvas({
    status: false,
    pageId: '',
    elementId: '',
    elementWidth: 0,
    elementHeight: 0
  });
  boundProjectActions.setPageArray(newPageArray);
  saveProjectTimer && clearTimeout(saveProjectTimer);
  saveProjectTimer = setTimeout(() => {that.onSaveProject(() => {}, null, true);}, 30);
  return Promise.resolve();
}

export const autoFill = (that, uploadSuccessImages, needSortImage = true) => {
  const {
    project,
    parameters,
    boundProjectActions,
    autoAddPhotoToCanvas
  } = that.props;
  if (!uploadSuccessImages.length) return Promise.resolve();
  const pageArray = get(project, 'pageArray');
  const cover = get(project, 'cover');
  const containers = cover.get('containers');
  const elementIds = [];
  let usedIndex = 0;
  const willUpdateElements = [];
  let newPageArray = Immutable.List();
  const replacePageId = get(autoAddPhotoToCanvas, 'pageId');

  const sortedImages = merge([], uploadSuccessImages);
  if (needSortImage) {
    sortedImages.sort((prev, next) => {
      return get(prev, 'shotTime') - get(next, 'shotTime');
    });
  }

  if (replacePageId) {
    return handleReplaceImage(that, sortedImages, replacePageId);
  };

  const { baseSize, pageBleed } = parameters.toJS();
  if (pageArray && pageArray.size) {
    pageArray.forEach((page, index) => {
      let newPage = page;
      const elements = page.get('elements');
      if (elements && elements.size) {
        const ele = elements.get('0');
        if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
          const useImage = sortedImages[usedIndex];
          if (useImage) {
            usedIndex += 1;
            let newElement = Immutable.Map();
            const isRotatedImage = Math.abs(useImage.orientation || 0) / 90 % 2 === 1;
            const pageRotate = isRotatedImage
              ? parseInt(useImage.width) <= parseInt(useImage.height)
              : parseInt(useImage.width) > parseInt(useImage.height);
            const pageSize = getInnerPageSize(baseSize, pageBleed);
            const pageWidth = pageRotate
              ? pageSize.height
              : pageSize.width;
            const pageHeight = pageRotate
              ? pageSize.width
              : pageSize.height;

            const { cropLUX, cropLUY, cropRLX, cropRLY } = getCropOptions(
              useImage.width,
              useImage.height,
              pageWidth,
              pageHeight,
              useImage.orientation || 0
            );

            newElement = ele.merge({
              encImgId: useImage.encImgId,
              imageid: useImage.imageId,
              imgRot: useImage.orientation || 0,
              width: pageWidth,
              height: pageHeight,
              cropLUX,
              cropLUY,
              cropRLX,
              cropRLY
            });

            newPage = newPage.merge({
              width: pageWidth,
              height: pageHeight,
              elements: Immutable.List().push(newElement)
            });
          }
        }
      }
      newPageArray = newPageArray.set(
        String(index),
        newPage
      );
    });
  }

  boundProjectActions.setPageArray(newPageArray);
  saveProjectTimer && clearTimeout(saveProjectTimer);
  saveProjectTimer = setTimeout(() => {that.onSaveProject(() => {}, null, true);}, 30);
  return Promise.resolve();

};
