import { elementTypes } from '../contants/strings';
import { getRandomInt } from '../../../common/utils/math';

/**
 * 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量.
 * @param  {Array} elements 带计算的所有元素的集合,这里是个Immutable对象.
 * @return {Object} 计算的结果. 结构为: {numberOfElements, numberOfHElements, numberOfVElements}
 */
const computedNumberOfHVElements = elements => {
  let numberOfElements = 0;
  let numberOfHElements = 0;
  let numberOfVElements = 0;

  // 方形.
  let numberOfSElements = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  elements.forEach(element => {
    if (element.get('type') === elementTypes.photo) {
      if (element.get('width') > element.get('height')) {
        numberOfHElements++;
      } else if (element.get('width') === element.get('height')) {
        numberOfSElements++;
      } else {
        numberOfVElements++;
      }
    }
  });

  numberOfElements = numberOfHElements + numberOfVElements + numberOfSElements;

  return {
    numberOfElements,
    numberOfHElements,
    numberOfVElements,
    numberOfSElements
  };
};

/**
 * 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量.
 * @param  {Array} text 带计算的所有元素的集合,这里是个Immutable对象.
 * @return {Object} 计算的结果. 结构为: {numberOfTexts, numberOfHTexts, numberOfVTexts}
 */
const computedNumberOfHVTexts = elements => {
  let numberOfTexts = 0;
  let numberOfHTexts = 0;
  let numberOfVTexts = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  elements.forEach(element => {
    // autolayout 无视textelement空文本
    if (element.get('type') === elementTypes.text && !!element.get('text')) {
      if (element.get('width') > element.get('height')) {
        numberOfHTexts++;
      } else {
        numberOfVTexts++;
      }
    }
  });

  numberOfTexts = numberOfHTexts + numberOfVTexts;

  return {
    numberOfTexts,
    numberOfHTexts,
    numberOfVTexts
  };
};

/**
 * 计算水平方向(高大于宽)和垂直方向(高小于宽)上的图片的数量.
 * @param  {Array} images 带计算的所有元素的集合,这里是个Immutable对象.
 * @return {Object} 计算的结果. 结构为: {numberOfImages, numberOfHImages, numberOfVImages}
 */
const computedNumberOfHVImages = images => {
  let numberOfImages = 0;
  let numberOfHImages = 0;
  let numberOfVImages = 0;

  // 方形.
  let numberOfSImages = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  images.forEach(image => {
    // 旋转角度为90的奇数倍时，宽高进行交换
    const imgRot = image.get('orientation') || 0;
    const isSwitched = Math.abs((imgRot / 90) % 2) === 1;

    const w = isSwitched ? image.get('height') : image.get('width');
    const h = isSwitched ? image.get('width') : image.get('height');

    if (w > h) {
      numberOfHImages++;
    } else if (w === h) {
      numberOfSImages++;
    } else {
      numberOfVImages++;
    }
  });

  numberOfImages = numberOfHImages + numberOfVImages + numberOfSImages;

  return {
    numberOfImages,
    numberOfHImages,
    numberOfVImages,
    numberOfSImages
  };
};

function needSpreadTemplate(pageWidth, pageHeight, imageWidth, imageHeight) {
  const pageRatio = pageWidth / pageHeight;
  const imageRatio = imageWidth / imageHeight;

  const overflowWidthPercent = Math.abs(imageWidth - pageWidth) / pageWidth;
  const overflowHeightPercent = Math.abs(imageHeight - pageHeight) / pageHeight;

  if (
    Math.abs(pageRatio - imageRatio) <= 0.03 &&
    overflowWidthPercent <= 0.05 &&
    overflowHeightPercent <= 0.05
  ) {
    return true;
  }

  return false;
}

/**
 * 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
 * @param  {Array} templates 给定的所有模板集合
 * @param  {Number} numberOfH 水平方向(高大于宽)上元素的个数
 * @param  {Number} numberOfV 垂直方向(高小于宽)上元素的个数
 * @return {Object} 筛选出来的模板对象.
 */
const filterTemplate = (
  isAutoFill,
  boundTrackerActions,
  templates,
  numberOfH,
  numberOfV,
  numberOfS = 0,
  numberOfHTexts = 0,
  numberOfVTexts = 0,
  { size, isCover }
) => {
  // 存放选择好的符合要求的模板.
  let template;

  // 图片元素的总数量.
  const total = numberOfH + numberOfV + numberOfS;

  // text元素总数量.
  const totalText = numberOfHTexts + numberOfVTexts;

  // 如果AutoFill, 当前Sheet（Page）被分配的照片张数为1，则优先选择isFullSpread为True的模板
  if (isAutoFill && total === 1) {
    template = templates.find(t => {
      return t.imageNum === 1 && t.isFullCover;
    });

    if (template) {
      return template;
    }
  }

  const matchedTemplates = templates.filter(t => {
    return (
      t.imageNum === total &&
      t.horizontalNum === numberOfH &&
      t.verticalNum === numberOfV &&
      t.squareNum === numberOfS &&
      t.textFrameNum === totalText
    );
  });

  const trackerString = isAutoFill ? 'AutoFill' : 'AutoLayout';

  if (matchedTemplates.length) {
    template = matchedTemplates[getRandomInt(0, matchedTemplates.length - 1)];
  } else {
    boundTrackerActions.addTracker(
      `MatchLayoutSetFailed,${size},${!!isCover},${trackerString},${numberOfH},${numberOfV},${numberOfS},${totalText}`
    );

    const elementNumEqualTemplates = templates.filter(t => {
      return t.imageNum === total && t.textFrameNum === totalText;
    });

    if (elementNumEqualTemplates.length) {
      const defaultTemplates = elementNumEqualTemplates.filter(t => {
        return t.isCoverDefault;
      });

      if (defaultTemplates.length) {
        template =
          defaultTemplates[getRandomInt(0, defaultTemplates.length - 1)];
      } else {
        template =
          elementNumEqualTemplates[
            getRandomInt(0, elementNumEqualTemplates.length - 1)
          ];
      }
    } else {
      boundTrackerActions.addTracker(
        `MatchLayoutFailed,${size},${!!isCover},${trackerString},${total},${totalText}`
      );
    }
  }

  return template;
};

/**
 * 根据页面上的元素, 和当前产品可用的所有模板, 自动的选择一个模板为到当前的页面.
 * @param  {Array} pageElements 页面上的所有元素的集合, 这里是个Immutable对象.
 * @param  {Array} templates   当前产品可用的所有模板的集合.
 * @return {Object}  自动的选择到的一个模板信息.
 */
export const autoLayoutByElements = (
  page,
  pageElements,
  addedElements,
  images,
  templates,
  boundTrackerActions,
  trackerParam
) => {
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfElements = computedNumberOfHVElements(pageElements);

  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfText = computedNumberOfHVTexts(pageElements);

  const isAutoFill = false;

  if (addedElements.size === 1) {
    const firstElement = addedElements.first();
    const theImage = images.get(firstElement.get('encImgId'));
    const isNeedSpread = needSpreadTemplate(
      page.get('width'),
      page.get('height'),
      theImage.get('width'),
      theImage.get('height')
    );

    if (isNeedSpread) {
      const spreadTemplate = templates.find(o => {
        return o.imageNum === 1 && o.isFullCover;
      });

      if (spreadTemplate) {
        return spreadTemplate;
      }
    }
  }

  // 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
  const template = filterTemplate(
    isAutoFill,
    boundTrackerActions,
    templates,
    countObjectOfElements.numberOfHElements,
    countObjectOfElements.numberOfVElements,
    countObjectOfElements.numberOfSElements,
    countObjectOfText.numberOfHTexts,
    countObjectOfText.numberOfVTexts,
    trackerParam
  );

  return template;
};

/**
 * 根据待渲染的图片集合, 和当前产品可用的所有模板, 自动的选择一个模板为到当前的页面.
 * @param  {Array} images 待渲染的图片集合, 这里是个Immutable对象.
 * @param  {Array} templates   当前产品可用的所有模板的集合.
 * @param  {Func} boundTrackerActions   埋点方法.
 * @param  {Object} {size, isCover}   埋点的参数.
 * @return {Object}  自动的选择到的一个模板信息.
 */
export const autoLayoutByImages = (
  images,
  templates,
  boundTrackerActions,
  trackerParam
) => {
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfImages = computedNumberOfHVImages(images);

  const isAutoFill = true;

  // 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
  const template = filterTemplate(
    isAutoFill,
    boundTrackerActions,
    templates,
    countObjectOfImages.numberOfHImages,
    countObjectOfImages.numberOfVImages,
    countObjectOfImages.numberOfSImages,
    0,
    0,
    trackerParam
  );

  return template;
};
