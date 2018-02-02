import Immutable from 'immutable';
import setElementByType from '../../utils/setElementByType';
import { guid } from '../../../../common/utils/math';
import { elementTypes } from '../../constants/strings';

function swap(a, b) {
  return [b, a];
}

function getAspectRatio(element) {
  let width = element.get('width');
  let height = element.get('height');

  const image = element.get('image');
  const imgRot = element.get('imgRot');
  if (image) {
    width = image.get('width');
    height = image.get('height');

    // 旋转角度为90的奇数倍时，宽高进行交换
    if (imgRot % 90 === 0 && imgRot % 180) {
      [width, height] = swap(width, height);
    }
  }

  return width / height;
}

function getMinDiffAspectRatioElementIndex(elements, aspectRatio) {
  let outElementIndex = -1;
  let minDiff = Infinity;

  elements.forEach((element, index) => {
    const diff = Math.abs(element.get('aspectRatio') - aspectRatio);
    if (diff < minDiff) {
      minDiff = diff;
      outElementIndex = index;
    }
  });

  return outElementIndex;
}

export function mergeTemplateElements(page, templateElements, imageArray) {
  if (
    !Immutable.Map.isMap(page) ||
    !Immutable.List.isList(templateElements) ||
    !Immutable.List.isList(imageArray)
  ) {
    return null;
  }

  const pageElements = page
    .get('elements')
    .filter((element) => {
      return element.get('encImgId');
    })
    .map((element) => {
      const image = imageArray.find((o) => {
        return o.get('encImgId') === element.get('encImgId');
      });

      const elementWithImage = element.set('image', image);

      const aspectRatio = getAspectRatio(elementWithImage);
      return element.set('aspectRatio', aspectRatio);
    });

  let templatePhotoElements = templateElements
    .filter((o) => {
      return o.get('type') === elementTypes.photo;
    })
    .map((element) => {
      const aspectRatio = getAspectRatio(element);
      return element.set('aspectRatio', aspectRatio);
    });

  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  let newElements = Immutable.List();
  pageElements.forEach((element) => {
    const aspectRatio = element.get('aspectRatio');
    const elementIndex = getMinDiffAspectRatioElementIndex(
      templatePhotoElements,
      aspectRatio
    );

    const templateElement = templatePhotoElements.get(elementIndex);
    templatePhotoElements = templatePhotoElements.delete(elementIndex);

    const newElement = Immutable.Map({
      id: guid(),
      type: templateElement.get('type'),
      x: templateElement.get('px') * pageWidth,
      y: templateElement.get('py') * pageHeight,
      width: templateElement.get('pw') * pageWidth,
      height: templateElement.get('ph') * pageHeight,
      dep: templateElement.get('dep'),
      rot: templateElement.get('rot'),
      encImgId: element.get('encImgId'),

      imgRot: element.get('imgRot'),
      imgFlip: element.get('imgFlip'),
      border: element.get('border'),
      style: element.get('style')
    });

    newElements = newElements.push(
      setElementByType(newElement, page, imageArray)
    );
  });

  newElements = newElements.concat(
    templatePhotoElements.map((templateElement) => {
      const newBlankElement = Immutable.Map({
        id: guid(),
        type: templateElement.get('type'),
        x: templateElement.get('px') * pageWidth,
        y: templateElement.get('py') * pageHeight,
        width: templateElement.get('pw') * pageWidth,
        height: templateElement.get('ph') * pageHeight,
        dep: templateElement.get('dep'),
        rot: templateElement.get('rot'),
        encImgId: ''
      });
      return setElementByType(newBlankElement, page, imageArray);
    })
  );

  return newElements.concat(
    templateElements.filter((o) => {
      return o.get('type') !== elementTypes.photo;
    })
  );
}
