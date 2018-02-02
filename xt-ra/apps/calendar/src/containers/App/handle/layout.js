import { get, sortBy, merge } from 'lodash';
import { elementTypes } from '../../../constants/strings';

export const autoFill = (that, uploadSuccessImages, needSortImage = true) => {
  const { project, boundProjectActions } = that.props;
  const pageArray = get(project, 'pageArray');
  const cover = get(project, 'cover');
  const containers = cover.get('containers');
  const elementIds = [];
  let usedIndex = 0;
  const willUpdateElements = [];

  const sortedImages = merge([], uploadSuccessImages);
  if (needSortImage) {
    sortedImages.sort((prev, next) => {
      return get(prev, 'shotTime') - get(next, 'shotTime');
    });
  }

  if (containers && containers.size) {
    containers.forEach(container => {
      const elements = container.get('elements');
      if (elements && elements.size) {
        elements.forEach(ele => {
          if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
            elementIds.push(ele.get('id'));
          }
        });
      }
    });
  }

  if (pageArray && pageArray.size) {
    pageArray.forEach(page => {
      const elements = page.get('elements');
      if (elements && elements.size) {
        elements.forEach(ele => {
          if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
            elementIds.push(ele.get('id'));
          }
        });
      }
    });
  }

  elementIds.forEach(eleId => {
    if (sortedImages[usedIndex]) {
      const curElement = sortedImages[usedIndex];

      willUpdateElements.push({
        id: eleId,
        encImgId: curElement.encImgId,
        imageid: curElement.imageId,
        imgRot: curElement.orientation ? curElement.orientation : 0,
        style: {
          effectId: 0,
          opacity: 100,
          brightness: 0
        },
        imgFlip: false
      });
      usedIndex += 1;
    }
  });

  return boundProjectActions.updateElements(willUpdateElements);
};
