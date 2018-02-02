import { get, sortBy, merge } from 'lodash';
import { elementTypes, enumPhotoQuantity } from '../../../constants/strings';

export const autoFill = (that, uploadSuccessImages, needSortImage = true) => {
  const { project, settings, boundProjectActions } = that.props;
  if (!uploadSuccessImages.length) return Promise.resolve();
  const pageArray = get(project, 'pageArray');
  const cover = get(project, 'cover');
  const elementIds = [];
  let usedIndex = 0;
  const willUpdateElements = [];

  const sortedImages = merge([], uploadSuccessImages);
  if (needSortImage) {
    sortedImages.sort((prev, next) => {
      return get(prev, 'shotTime') - get(next, 'shotTime');
    });
  }
  const applyImage = sortedImages[usedIndex];
  let firstEmptyPhotoElement = null;
  pageArray.present.some(page => {
    const elements = page.get('elements');
    if (elements && elements.size) {
      elements.forEach(ele => {
        if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
          firstEmptyPhotoElement = ele;
          return false;
        }
      });
    }
  });
  if (!firstEmptyPhotoElement) return Promise.resolve();
  const orientation =
    firstEmptyPhotoElement.get('width') > firstEmptyPhotoElement.get('height')
      ? 'Landscape'
      : 'Portrait';
  const isSwitched = Math.abs((applyImage.orientation / 90) % 2) === 1;

  const w = isSwitched
    ? parseInt(applyImage.height)
    : parseInt(applyImage.width);
  const h = isSwitched
    ? parseInt(applyImage.width)
    : parseInt(applyImage.height);

  const imageOrientation = w >= h ? 'Landscape' : 'Portrait';

  const elements = [];
  const pageElements = pageArray.present.getIn([String(0), 'elements']);

  pageElements.forEach(element => {
    if (
      element.get('type') === elementTypes.photo &&
      !element.get('encImgId')
    ) {
      const theImage = sortedImages.shift();
      if (theImage) {
        elements.push({
          id: element.get('id'),
          imgRot: 0,
          encImgId: theImage.encImgId,
          imageid: theImage.imageid,
          imgRot: theImage.orientation || 0
        });
      }
    }
  });

  if (
    orientation !== imageOrientation &&
    settings.get('photoQuantity') === enumPhotoQuantity.one
  ) {
    boundProjectActions
      .changeProjectSetting({ orientation: imageOrientation })
      .then(() => {
        return boundProjectActions.updateElements(elements);
      });
  } else {
    return boundProjectActions.updateElements(elements);
  }

  // 下方为 多页面处理逻辑的填充，如果需要多页面处理的话还有很多细节需要做，暂时没法使用；
  // boundProjectActions.changeProjectSetting({orientation: orientation}).then(
  //   () =>
  //   {
  //     if (pageArray && pageArray.present.size) {
  //       pageArray.present.forEach((page) => {
  //         const elements = page.get('elements');
  //         if (elements && elements.size) {
  //           elements.forEach((ele) => {
  //             if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
  //               elementIds.push(ele.get('id'));
  //             }
  //           });
  //         }
  //       });
  //     }

  //     elementIds.forEach((eleId) => {
  //       if (sortedImages[usedIndex]) {
  //         const curElement = sortedImages[usedIndex];
  //         willUpdateElements.push({
  //           id: eleId,
  //           encImgId: curElement.encImgId,
  //           imageid: curElement.imageId,
  //           imgRot: 0,
  //           style: {
  //             effectId: 0,
  //             opacity: 100,
  //             brightness: 0
  //           },
  //           imgFlip: false
  //         });
  //         usedIndex += 1;
  //       }
  //     });

  //     return boundProjectActions.updateElements(willUpdateElements);
  // });
};
