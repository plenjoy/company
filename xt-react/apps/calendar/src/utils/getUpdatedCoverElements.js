import Immutable from 'immutable';
import setElementByType from './setElementByType';

/**
 * 获取书脊百分比的最大和最小x坐标
 *
 * @param      {number}   coverWidth       The cover width
 * @param      {number}   spineWidth       The spine width
 * @param      {number}   baseSpineWidth   The base spine width
 * @param      {boolean}  isBackContainer  Indicates if back container
 * @return     {Array}    The spine minimum maximum percent x.
 */
function getSpineMinMaxPercentX(
  coverWidth,
  spineWidth,
  baseSpineWidth,
  isBackContainer = false
) {
  const halfCoverWidth = coverWidth / 2;
  const halfSpineWidth = spineWidth / 2;
  let minSpinePercentX = (halfCoverWidth - halfSpineWidth) / coverWidth;
  let maxSpinePercentX = (halfCoverWidth + baseSpineWidth / 2) / coverWidth;

  if (!isBackContainer) {
    return [minSpinePercentX, maxSpinePercentX];
  }

  minSpinePercentX = 1 - halfSpineWidth / coverWidth;
  maxSpinePercentX = 1;

  return [minSpinePercentX, maxSpinePercentX];
}

/**
 * 根据元素相对于书脊的位置，对元素的宽高、位置进行修正
 *
 * @param      {<type>}   element           The element
 * @param      {number}   minSpinePercentX  The minimum spine percent x
 * @param      {number}   maxSpinePercentX  The maximum spine percent x
 * @param      {number}   addedSpineWidth   The added spine width
 * @param      {number}   coverWidth        The cover width
 * @param      {<type>}   needReduceX       The need reduce x
 * @param      {boolean}  isFullUpdate      Indicates if full update
 * @return     {<type>}   { description_of_the_return_value }
 */
function updateElementByPosition(
  element,
  minSpinePercentX,
  maxSpinePercentX,
  addedSpineWidth,
  coverWidth,
  needReduceX,
  isFullUpdate
) {
  let updatedElement = element;
  if (!isFullUpdate) {
    updatedElement = Immutable.Map({
      id: element.get('id'),
      type: element.get('type'),
      x: element.get('x'),
      y: element.get('y'),
      width: element.get('width'),
      height: element.get('height'),
      encImgId: element.get('encImgId')
    });
  }

  const elementPercentX = element.get('px');
  const elementPercentRightX = element.get('px') + element.get('pw');
  const halfAddedSpineWidth = addedSpineWidth / 2;

  // 元素在书脊左侧
  if (needReduceX && elementPercentRightX < minSpinePercentX) {
    updatedElement = updatedElement.merge({
      x: element.get('x') - halfAddedSpineWidth
    });
  } else if (
    // 元素在左侧，并且部分压住了书脊
    (elementPercentRightX > minSpinePercentX &&
      elementPercentRightX < maxSpinePercentX) ||
    // 元素在右侧，并且部分压住了书脊
    (elementPercentX > minSpinePercentX &&
      elementPercentX < maxSpinePercentX) ||
    // 元素从左至右，覆盖了整个书脊
    (elementPercentX < minSpinePercentX &&
      elementPercentRightX > maxSpinePercentX)
  ) {
    updatedElement = updatedElement.merge({
      x: element.get('px') * coverWidth,
      width: element.get('pw') * coverWidth
    });
  } else if (elementPercentX > maxSpinePercentX) {
    // 元素在右侧
    updatedElement = updatedElement.merge({
      x:
        element.get('x') +
        (isFullUpdate ? halfAddedSpineWidth : addedSpineWidth)
    });
  }

  return updatedElement;
}

/**
 * sheet页数改变时，更新cover上元素的位置、宽高
 *
 * @param      {<type>}  cover            The cover
 * @param      {<type>}  imageArray       The image array
 * @param      {<type>}  parameterMap     The parameter map
 * @param      {number}  addedSpineWidth  The added spine width
 * @return     {Array}   The updated cover elements on sheet number change.
 */
export function getUpdatedCoverElementsOnSheetNumChange(
  cover,
  imageArray,
  parameterMap,
  addedSpineWidth
) {
  const coverWidth = cover.get('width');
  const containers = cover.get('containers');

  let fullContainer = null;
  let spineContainer = null;
  let backContainer = null;

  containers.forEach((container) => {
    const containerType = container.get('type');
    switch (containerType) {
      case 'Full':
        fullContainer = container;
        break;
      case 'Spine':
        spineContainer = container;
        break;
      case 'Back':
        backContainer = container;
        break;
      default:
    }
  });

  const spineBleed = spineContainer.get('bleed');
  const baseSpineWidth = parameterMap.getIn(['spineWidth', 'baseValue']);

  const realSpineWidth =
    spineContainer.get('width') -
    (spineBleed.get('left') + spineBleed.get('right'));

  const isBackContainer = Boolean(backContainer);
  const [minSpinePercentX, maxSpinePercentX] = getSpineMinMaxPercentX(
    coverWidth,
    realSpineWidth,
    baseSpineWidth,
    isBackContainer
  );

  let updatedElements = Immutable.List();
  let elements = Immutable.List();
  if (fullContainer) {
    elements = elements.concat(fullContainer.get('elements'));
  }
  if (backContainer) {
    elements = elements.concat(backContainer.get('elements'));
  }

  const needReduceX = Boolean(backContainer);
  const isFullUpdate = false;
  elements.forEach((element) => {
    const updatedElement = updateElementByPosition(
      element,
      minSpinePercentX,
      maxSpinePercentX,
      addedSpineWidth,
      coverWidth,
      needReduceX,
      isFullUpdate
    );

    updatedElements = updatedElements.push(
      setElementByType(
        updatedElement,
        fullContainer || backContainer,
        imageArray
      )
    );
  });

  return updatedElements;
}

/**
 * 应用模板时，更新cover上元素的位置、宽高
 *
 * @param      {<type>}  cover             The cover
 * @param      {<type>}  imageArray        The image array
 * @param      {<type>}  parameterMap      The parameter map
 * @param      {<type>}  optionalElements  The optional elements
 * @return     {Array}   The updated cover elements on apply template.
 */
export function getUpdatedCoverElementsOnApplyTemplate(
  cover,
  imageArray,
  parameterMap,
  optionalElements
) {
  const coverWidth = cover.get('width');
  const containers = cover.get('containers');

  let fullContainer = null;
  let spineContainer = null;

  containers.forEach((container) => {
    const containerType = container.get('type');
    switch (containerType) {
      case 'cover':
        fullContainer = container;
        break;
      default:
    }
  });

  const currentSpineWidth =
    spineContainer.get('width') -
    (spineBleed.get('left') + spineBleed.get('right'));
  const baseSpineWidth = parameterMap.getIn(['spineWidth', 'baseValue']);
  const addedSpineWidth = currentSpineWidth - baseSpineWidth;

  const originalCoverWidth = coverWidth - addedSpineWidth;

  const realSpineWidth = baseSpineWidth;

  const [minSpinePercentX, maxSpinePercentX] = getSpineMinMaxPercentX(
    originalCoverWidth,
    realSpineWidth,
    baseSpineWidth
  );

  let updatedElements = Immutable.List();

  const needReduceX = true;
  const isFullUpdate = true;
  optionalElements.forEach((element) => {
    const updatedElement = updateElementByPosition(
      element,
      minSpinePercentX,
      maxSpinePercentX,
      addedSpineWidth,
      coverWidth,
      needReduceX,
      isFullUpdate
    );

    updatedElements = updatedElements.push(
      setElementByType(updatedElement, fullContainer, imageArray)
    );
  });

  return updatedElements;
}
