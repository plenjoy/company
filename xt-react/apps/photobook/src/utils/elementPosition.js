import { elementTypes } from '../contants/strings';

export function getNewPosition(elementArray, currentPage) {
  const typeArray = [
    elementTypes.photo,
    elementTypes.text,
    elementTypes.paintedText
  ];

  const currentPhotoElements = elementArray.filter((element) => {
    return typeArray.indexOf(element.get('type') !== -1);
  });

  const defaultPosition = {
    x: 45 + currentPage.getIn(['bleed', 'left']),
    y: 45 + currentPage.getIn(['bleed', 'top'])
  };

  const step = 80;
  const defaultPositionPhotoElements = currentPhotoElements
    .filter((element) => {
      const elementX = element.get('x');
      const elementY = element.get('y');
      const deltaX = Math.round(elementX - defaultPosition.x);
      const deltaY = Math.round(elementY - defaultPosition.y);
      return deltaX % step === 0 && deltaY % step === 0;
    })
    .sort((a, b) => a.get('x') - b.get('x'));

  const newElementPosition = {};

  defaultPositionPhotoElements.forEach((element, i) => {
    const elementX = element.get('x');
    const elementY = element.get('y');
    const nextElement = defaultPositionPhotoElements.get(i + 1);

    if (
      nextElement &&
      Math.round(nextElement.get('x') - elementX) !== step &&
      Math.round(nextElement.get('y') - elementY) !== step
    ) {
      newElementPosition.x = elementX + step;
      newElementPosition.y = elementY + step;

      return false;
    }
  });

  if (!newElementPosition.x && !newElementPosition.y) {
    const lastElement = defaultPositionPhotoElements.last();
    if (lastElement) {
      newElementPosition.x = lastElement.get('x') + step;
      newElementPosition.y = lastElement.get('y') + step;
    } else {
      newElementPosition.x = defaultPosition.x + step;
      newElementPosition.y = defaultPosition.y + step;
    }
  }

  return newElementPosition;
}
