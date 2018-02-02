import { get } from 'lodash';
import { elementTypes, pageTypes } from '../contants/strings';

export function getNewPosition(elementArray, currentPage, elementWidth, elementHeight) {
  const currentElementIds = get(currentPage, 'elements');

  const typeArray = [elementTypes.photo, elementTypes.text, elementTypes.paintedText, elementTypes.dvd];

  const currentPhotoElements = elementArray.filter((element) => {
    return currentElementIds.indexOf(get(element, 'id')) !== -1 &&
      typeArray.indexOf(get(element, 'type')) !== -1;
  });

  const bleedWidth = get(currentPage, 'bleed.left') + get(currentPage, 'bleed.right');
  const wrapSizeWidth = get(currentPage, 'wrapSize.left') + get(currentPage, 'wrapSize.right');

  const defaultPosition = {
    x: (get(currentPage, 'width') - bleedWidth - wrapSizeWidth - elementWidth) / 2 + get(currentPage, 'bleed.left') + get(currentPage, 'wrapSize.left'),
    // x: 45 + get(currentPage, 'bleed.left') + get(currentPage, 'wrapSize.left'),
    y: get(currentPage, 'type') === pageTypes.back
      ? get(currentPage, 'height') - (45 + get(currentPage, 'bleed.top') + get(currentPage, 'wrapSize.top')) - elementHeight
      : 45 + get(currentPage, 'bleed.top') + get(currentPage, 'wrapSize.top')
  };

  const step = get(currentPage, 'type') === pageTypes.back ? -80 : 80;
  const defaultPositionPhotoElements =
    currentPhotoElements.filter((element) => {
      const elementX = get(element, 'x');
      const elementY = get(element, 'y');
      const deltaX = elementX - defaultPosition.x;
      const deltaY = elementY - defaultPosition.y;
      // return deltaX % step === 0 && deltaY % step === 0;
      return (Math.abs(deltaX % step) <= 10 || Math.abs(deltaX % step) >= 70) && (Math.abs(deltaY % step) <= 10 || Math.abs(deltaY % step) >= 70);
    }).sort((a, b) => get(a, 'x') - get(b, 'x'));

  const newElementPosition = {};

  defaultPositionPhotoElements.forEach((element, i) => {
    const elementX = get(element, 'x');
    const elementY = get(element, 'y');
    const nextElement = get(defaultPositionPhotoElements, i + 1);

    if (nextElement &&
      // 解决80.000000011不等于80的问题
      Math.round(get(nextElement, 'x') - elementX) !== step &&
      Math.round(get(nextElement, 'y') - elementY) !== step) {
      newElementPosition.x = elementX + step;
      newElementPosition.y = elementY + step;

      return false;
    }
  });

  if (!newElementPosition.x && !newElementPosition.y) {
    const lastElement = defaultPositionPhotoElements.pop();
    if (lastElement) {
      newElementPosition.x = get(lastElement, 'x') + Math.abs(step);
      newElementPosition.y = get(lastElement, 'y') + step;
    } else {
      newElementPosition.x = defaultPosition.x;
      newElementPosition.y = defaultPosition.y + step;
    }
  }

  return newElementPosition;
}
