import { fromJS } from 'immutable';
import {
  elementTypes,
  imageCountPerSheet,
  templateGroupTypes
} from '../contants/strings';
import { getRandomInt } from '../../../common/utils/math';

/**
 * 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量.
 * @param  {Array} elements 带计算的所有元素的集合,这里是个Immutable对象.
 * @return {Object} 计算的结果. 结构为: {numberOfElements, numberOfHElements, numberOfVElements}
 */
export const computedNumberOfHVElements = (elements) => {
  let numberOfElements = 0;
  let numberOfHElements = 0;
  let numberOfVElements = 0;

  // 方形.
  let numberOfSElements = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  elements.forEach((element) => {
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
const computedNumberOfHVTexts = (elements) => {
  let numberOfTexts = 0;
  let numberOfHTexts = 0;
  let numberOfVTexts = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  elements.forEach((element) => {
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
const computedNumberOfHVImages = (images) => {
  let numberOfImages = 0;
  let numberOfHImages = 0;
  let numberOfVImages = 0;

  // 方形.
  let numberOfSImages = 0;

  // 循环每一个元素.
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的Photo元素的数量
  images.forEach((image) => {
    if (image.get('width') > image.get('height')) {
      numberOfHImages++;
    } else if (image.get('width') === image.get('height')) {
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

/**
 * 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
 * @param  {Array} templates 给定的所有模板集合
 * @param  {Number} numberOfH 水平方向(高大于宽)上元素的个数
 * @param  {Number} numberOfV 垂直方向(高小于宽)上元素的个数
 * @return {Object} 筛选出来的模板对象.
 */
const filterTemplate = (
  templates,
  numberOfH,
  numberOfV,
  numberOfS = 0,
  numberOfHTexts = 0,
  numberOfVTexts = 0,
  isCover = false
) => {
  // 存放选择好的符合要求的模板.
  let template;

  // 存放水平方向或垂直方向上的元素数量等于指定的水平和垂直数量的所有模板的集合.
  const fitTemplates = [];

  // 存放总的元素数量等于指定的水平和垂直数量的和的所有模板的集合.
  const optionalTemplates = [];

  // 总的元素数量大于指定的水平和垂直数量的和的所有模板的集合.
  const greatThanTotalTemplates = [];
  const lessThanTotalTemplates = [];

  // 图片元素的总数量.
  const total = numberOfH + numberOfV + numberOfS;

  // text元素总数量.
  const totalText = numberOfHTexts + numberOfVTexts;

  if (isCover && templates.length) {
    template = templates.find((tmpl) => {
      return tmpl.isCoverDefault;
    });

    if (!template) {
      template = templates.find((tmpl) => {
        return tmpl.imageNum;
      });
    }

    return template;
  }

  // 优先查找完全匹配的
  let matchedTemplates = templates.filter((t) => {
    return (
      t.imageNum === total &&
      t.horizontalNum === numberOfH &&
      t.verticalNum === numberOfV &&
      t.squareNum === numberOfS &&
      t.textFrameNum === totalText
    );
  });

  // 查找左右边元素一致的模板
  if (!matchedTemplates.length) {
    matchedTemplates = templates.filter((t) => {
      return (
        (numberOfH && t.horizontalNum === imageCountPerSheet * numberOfH) ||
        (numberOfV && t.verticalNum === imageCountPerSheet * numberOfV) ||
        (numberOfS && t.squareNum === imageCountPerSheet * numberOfS)
      );
    });
  }

  if (matchedTemplates.length) {
    template = matchedTemplates[getRandomInt(0, matchedTemplates.length - 1)];
  } else {
    const elementNumEqualTemplates = templates.filter((t) => {
      return t.imageNum === total && t.textFrameNum === totalText;
    });

    if (elementNumEqualTemplates.length) {
      const defaultTemplates = elementNumEqualTemplates.filter((t) => {
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
export const autoLayoutByElements = (pageElements, templates) => {
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfElements = computedNumberOfHVElements(pageElements);

  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfText = computedNumberOfHVTexts(pageElements);

  // 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
  const template = filterTemplate(
    templates,
    countObjectOfElements.numberOfHElements,
    countObjectOfElements.numberOfVElements,
    countObjectOfElements.numberOfSElements,
    countObjectOfText.numberOfHTexts,
    countObjectOfText.numberOfVTexts
  );

  return template;
};

/**
 * 根据待渲染的图片集合, 和当前产品可用的所有模板, 自动的选择一个模板为到当前的页面.
 * @param  {Array} images 待渲染的图片集合, 这里是个Immutable对象.
 * @param  {Array} templates   当前产品可用的所有模板的集合.
 * @return {Object}  自动的选择到的一个模板信息.
 */
export const autoLayoutByImages = (images, templates) => {
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfImages = computedNumberOfHVImages(images);

  // 根据水平方向和垂直方向上的元素数量, 在给定的所有模板中, 选择一个符合要求的模板.
  const template = filterTemplate(
    templates,
    countObjectOfImages.numberOfHImages,
    countObjectOfImages.numberOfVImages,
    countObjectOfImages.numberOfSImages
  );

  return template;
};

export const autoLayoutByCoverImages = (images, templates) => {
  // 计算水平方向(高大于宽)和垂直方向(高小于宽)上的元素的数量, 以及总个数.
  const countObjectOfImages = computedNumberOfHVImages(images);

  const template = filterTemplate(
    templates,
    countObjectOfImages.numberOfHImages,
    countObjectOfImages.numberOfVImages,
    countObjectOfImages.numberOfSImages,
    0,
    0,
    true
  );

  return template;
};

/**
 * 对给定的内页图片, 旋转合适的模板.
 * @param  {array} images
 * @param  {array} templates [{PS: [<template object>]}]
 */
export const autoLayoutByInnerImages = (
  images,
  templates,
  productSize = '6X6'
) => {
  let template;

  if (!images || !images.length || !templates) {
    return template;
  }

  let type;

  // 5x7的内页没有isDefault设置, 它需要根据当前图片的宽高比动态的旋转一张合适的模板.
  if (productSize.toUpperCase() === '5X7') {
    type = templateGroupTypes.GROUP_5X7;
    const list = templates[type];

    if (list && list.length) {
      template = autoLayoutByImages(images, list);
    }
  } else {
    // 6x6
    // 默认使用LL的template group.
    let firstChar = '';
    let secondChar = '';

    const newImages = fromJS(images);
    const firstImage = newImages.get(0);
    const secondImage = newImages.get(1);

    if (firstImage) {
      const fw = firstImage.get('width');
      const fh = firstImage.get('height');

      firstChar = fw === fh ? 'S' : fw > fh ? 'L' : 'P';
      secondChar = firstChar;
    }

    // 如果包含两张图片, 就根据图片的大小, 选择合适的template group.
    if (secondImage) {
      const sw = secondImage.get('width');
      const sh = secondImage.get('height');

      secondChar = sw === sh ? 'S' : sw > sh ? 'L' : 'P';
      firstChar = firstChar || secondChar;
    }

    // PL, SS等.
    if (firstChar && secondChar) {
      type = templateGroupTypes[`${firstChar}${secondChar}`];
    }

    if (type) {
      let list = templates[type];

      // 找出默认的模板.
      if (list && list.length) {
        list = list.sort((a, b) => a.ordering - b.ordering);
        const defaultTemplates = list.filter(t => t.isDefault);
        const randomIndex = getRandomInt(0, defaultTemplates.length - 1);

        return defaultTemplates[randomIndex];
      }
    }
  }

  return template;
};

export const selectedDefaultCoverTemplate = (templates) => {
  let template;

  if (templates && templates.length) {
    template = templates.find(t => t.isDefault);
  }

  return template;
};

/**
 * 对给定的内页图片, 旋转合适的模板.
 * @param  {array} elements
 * @param  {array} templates [{PS: [<template object>]}]
 */
export const autoLayoutByInnerElements = (
  elements,
  templates,
  productSize = '6X6'
) => {
  let template;

  if (!elements || !templates) {
    return template;
  }

  let type;

  // 5x7的内页没有isDefault设置, 它需要根据当前图片的宽高比动态的旋转一张合适的模板.
  if (productSize.toUpperCase() === '5X7') {
    type = templateGroupTypes.GROUP_5X7;
    const list = templates[type];

    if (list && list.length) {
      template = autoLayoutByElements(elements, list);
    }
  } else {
    // 6x6
    // 默认使用LL的template group.
    let firstChar = 'L';
    let secondChar = 'L';

    const newElements = fromJS(elements);
    const firstElement = newElements.get(0);
    const secondElement = newElements.get(1);

    if (firstElement) {
      const fw = firstElement.get('width');
      const fh = firstElement.get('height');

      firstChar = fw === fh ? 'S' : fw > fh ? 'L' : 'P';
      secondChar = firstChar;
    }

    // 如果包含两张图片, 就根据图片的大小, 选择合适的template group.
    if (secondElement) {
      const sw = secondElement.get('width');
      const sh = secondElement.get('height');

      secondChar = sw === sh ? 'S' : sw > sh ? 'L' : 'P';
    }

    // PL, SS等.
    type = templateGroupTypes[`${firstChar}${secondChar}`];

    if (type) {
      let list = templates[type];

      // 找出默认的模板.
      if (list && list.length) {
        list = list.sort((a, b) => a.ordering - b.ordering);
        template = list.find(t => t.isDefault);
      }
    }
  }

  return template;
};
