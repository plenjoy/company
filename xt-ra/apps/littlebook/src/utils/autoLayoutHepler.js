import { Map, List, fromJS, is } from 'immutable';
import { merge, isEqual, template, get, isArray, isNumber } from 'lodash';

import { getCropOptions } from './crop';
import {
  elementTypes,
  pageTypes,
  imageCountPerSheet
} from '../contants/strings';
import { guid, getPtByPx } from '../../../common/utils/math';
import { numberToHex } from '../../../common/utils/colorConverter';

import Element from './entries/element';

const minPxValue = 0.4;

/**
 * 获取当前element下的image的宽高信息.
 */
const getImage = (element, images) => {
  let image = null;

  const encImgId = element.get('encImgId');

  if (images.length && encImgId) {
    image = images.find(img => img.encImgId === encImgId);
    image.imgRot = element.get('imgRot');
  }
  return image;
};

/**
 * 校正crystal, metal封面模板上的元素的px.
 * @param  {number} px 元素的原始px
 */
const correctPxPw = (x, px, width, pw) => {
  let newPx = px;
  let newPw = pw;

  if (px > minPxValue) {
    const pageWidth = x / px;
    const halfPageWidth = pageWidth / 2;

    newPx = (x - halfPageWidth) / halfPageWidth;

    // element width
    newPw = width / halfPageWidth;
  }

  return {
    px: newPx,
    pw: newPw
  };
};

/**
 * 获取元素集合中, 获取px最小的值.
 * @param  {[type]} elements [description]
 * @return {[type]}          [description]
 */
const getElementsMinPx = (elements) => {
  let px = 0;

  if (elements && elements.size) {
    const element = elements.min(ele => ele.get('px'));

    if (element) {
      px = element.get('px');
    }
  }

  return px;
};

/**
 * 根据模板上图片元素信息, 更新页面上图片元素.
 */
export const recomputedElementOptionsWithImage = (
  image,
  templateElement,
  page,
  pageElement
) => {
  // 获取页面的宽高.
  const pageWidth = page.get('width');
  const pageHeight = page.get('height');
  const elementWidth = pageWidth * templateElement.pw;
  const elementHeight = pageHeight * templateElement.ph;

  // 获取展开后图片裁剪的参数.
  let imgCropOptions = {
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 0,
    cropRLY: 0
  };

  let imgRot = 0;
  let imgFlip = false;

  if (pageElement) {
    imgRot = pageElement.get('imgRot');
    imgFlip = pageElement.get('imgFlip');
  }

  if (image) {
    imgCropOptions = getCropOptions(
      get(image, 'width'),
      get(image, 'height'),
      elementWidth,
      elementHeight,
      imgRot
    );
  }

  const { cropLUX, cropLUY, cropRLX, cropRLY } = imgCropOptions;

  return {
    x: pageWidth * templateElement.px,
    y: pageHeight * templateElement.py,
    dep: templateElement.dep,
    rot: isNumber(templateElement.rot) ? templateElement.rot : 0,
    px: templateElement.px,
    py: templateElement.py,
    pw: templateElement.pw,
    ph: templateElement.ph,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    imgRot,
    imgFlip,
    width: pageWidth * templateElement.pw,
    height: pageHeight * templateElement.ph
  };
};

/**
 * 根据模板上图片元素信息, 更新页面上图片元素.
 * @param  {Array} allImages 所有的图片集合.
 * @param  {Immutable.Map} pageElement  页面上的元素对象, 是Immutable对象
 * @param  {Immutable.Map} templateElement 模板上的元素对象, 是Immutable对象
 * @param  {Immutable.Map} page 页面对象, 是Immutable对象
 */
export const recomputedElementOptions = (
  allImages,
  pageElement,
  templateElement,
  page
) => {
  // 获取图片的原始大小.
  const image = getImage(pageElement, allImages);

  return recomputedElementOptionsWithImage(
    image,
    templateElement,
    page,
    pageElement
  );
};

/**
 * 根据模板上文本元素信息, 更新页面上文本元素.
 * @param  {Immutable.Map} templateElement 模板上的元素对象, 是Immutable对象
 * @param  {Immutable.Map} page 页面对象, 是Immutable对象
 */
export const recomputedTextElementOptions = (templateElement, page) => {
  // 获取页面的宽高.
  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  return {
    type: elementTypes.text,
    elType: 'text',
    x: pageWidth * templateElement.px,
    y: pageHeight * templateElement.py,
    dep: templateElement.dep,
    rot: templateElement.rot,
    px: templateElement.px,
    py: templateElement.py,
    pw: templateElement.pw,
    ph: templateElement.ph,
    width: pageWidth * templateElement.pw,
    height: pageHeight * templateElement.ph,
    fontColor: numberToHex(templateElement.color),
    fontFamily: decodeURI(templateElement.fontFamily),
    fontSize: templateElement.fontSize,
    fontWeight: templateElement.fontWeight,
    textAlign: templateElement.textAlign,
    textVAlign: templateElement.textVAlign
  };
};

/**
 * 根据模板信息, 更新页面上的所有元素.
 * @param  {Immutable.Map} page  页面对象, 是Immutable对象
 * @param  {Immutable.List} template 页面上所有的元素对象.
 * @param  {Array} images   所有的图片集合.
 * @param  {Immutable.Map} template 模板信息对象
 */
export const updateElementsByTemplate = (
  page,
  pageElements,
  images,
  template,
  isHalfCover = false
) => {
  // 给页面上所有的元素对象根据encImgId进行排序.
  // 将含有图片的elements移到前面.
  const sortedPageElements = pageElements.sort(
    (first, second) => first.get('encImgId') - second.get('encImgId')
  );
  const textElements = sortedPageElements.filter(
    element => element.get('type') === elementTypes.text
  );
  const photoElements = sortedPageElements.filter(
    element => element.get('type') === elementTypes.photo
  );
  const decorationElements = sortedPageElements.filter(
    element => element.get('type') === elementTypes.decoration
  );

  let photosApplyedTemplate = 0;
  let textsApplyedTemplate = 0;

  // 获取template的基本信息和所有的elements
  const bgColor = template.bgColor;
  const templateElements = template.elements;

  // 将模板元素按照从左到右排列
  const sortedTemplateElements = templateElements.sort((first, second) => {
    return first.x - second.x;
  });

  // 取得模板左边元素和右边元素宽对比情况
  const isLeftELargerRightE =
    sortedTemplateElements.length === 2
      ? sortedTemplateElements[0].width > sortedTemplateElements[1].width
      : false;

  let sortedPhotoElements = [];
  // 根据模板元素的比对信息对图片元素进行同向排序
  if (photoElements && photoElements.length === imageCountPerSheet) {
    sortedPhotoElements = photoElements.sort((first, second) => {
      const fImage = getImage(first, images);
      const sImage = getImage(second, images);
      if (sImage && fImage) {
        const fImageRatio = fImage.width / fImage.height;
        const sImageRatio = sImage.width / sImage.height;
        if (isLeftELargerRightE && fImageRatio < sImageRatio) {
          return sImageRatio - fImageRatio;
        } else if (!isLeftELargerRightE && fImageRatio > sImageRatio) {
          return fImageRatio - sImageRatio;
        }
      }
      return false;
    });
  } else {
    sortedPhotoElements = photoElements;
  }

  const isFront = page.get('type') === pageTypes.front;
  const minPx = getElementsMinPx(fromJS(templateElements));
  const shouldCorrectPxPw = isFront && isHalfCover && minPx > minPxValue;

  const textInTemplate = templateElements.filter((element) => {
    return element.type === elementTypes.text;
  });

  // 存放根据模板生成后的新的elements.
  let newElements = List([]);

  // 如果模板的element的数量正好等于原先page上的elements数量时, 那么可以一一对应.
  // 如果模板的element的数量大于原先page上的elements数量时, 多出来的elements用空图片框代替
  // 如果模板的element的数量小于原先page上的elements数量时, 那就用模板的elements的数量为准,
  // 忽略原先page上多出来的elements.
  sortedTemplateElements.forEach((templateElement, index) => {
    switch (templateElement.type) {
      case elementTypes.photo: {
        if (++photosApplyedTemplate <= sortedPhotoElements.length) {
          const pageElement = sortedPhotoElements[photosApplyedTemplate - 1];
          let newTemplateElement = templateElement;

          // 如果是front page并且是crystal, metal, 对模板里的元素的px, pw进行校正.
          // 因为crystal, metal还是使用的全页模板(左侧是空白的, 只有右侧有元素).
          if (shouldCorrectPxPw) {
            const newPxPw = correctPxPw(
              templateElement.x,
              templateElement.px,
              templateElement.width,
              templateElement.pw
            );

            newTemplateElement = merge({}, templateElement, newPxPw);
          }

          const newElement = pageElement.merge(
            recomputedElementOptions(
              images,
              pageElement,
              newTemplateElement,
              page
            )
          );

          newElements = newElements.push(newElement);
        } else {
          let newTemplateElement = templateElement;

          // 如果是front page并且是crystal, metal, 对模板里的元素的px, pw进行校正.
          // 因为crystal, metal还是使用的全页模板(左侧是空白的, 只有右侧有元素).
          if (shouldCorrectPxPw) {
            const newPxPw = correctPxPw(
              templateElement.x,
              templateElement.px,
              templateElement.width,
              templateElement.pw
            );

            newTemplateElement = merge({}, templateElement, newPxPw);
          }

          const newElement = new Element(
            recomputedElementOptions(images, Map({}), newTemplateElement, page)
          );
          newElements = newElements.push(
            Map(merge(newElement, { id: guid() }))
          );
        }
        break;
      }
      case elementTypes.text: {
        if (++textsApplyedTemplate <= textElements.length) {
          const pageElement = textElements[textsApplyedTemplate - 1];

          let newTemplateElement = templateElement;

          // 如果是front page并且是crystal, metal, 对模板里的元素的px, pw进行校正.
          // 因为crystal, metal还是使用的全页模板(左侧是空白的, 只有右侧有元素).
          if (shouldCorrectPxPw) {
            const newPxPw = correctPxPw(
              templateElement.x,
              templateElement.px,
              templateElement.width,
              templateElement.pw
            );

            newTemplateElement = merge({}, templateElement, newPxPw);
          }

          const newElement = pageElement.merge(
            recomputedTextElementOptions(newTemplateElement, page)
          );
          newElements = newElements.push(newElement);
        } else {
          let newTemplateElement = templateElement;

          // 如果是front page并且是crystal, metal, 对模板里的元素的px, pw进行校正.
          // 因为crystal, metal还是使用的全页模板(左侧是空白的, 只有右侧有元素).
          if (shouldCorrectPxPw) {
            const newPxPw = correctPxPw(
              templateElement.x,
              templateElement.px,
              templateElement.width,
              templateElement.pw
            );

            newTemplateElement = merge({}, templateElement, newPxPw);
          }

          const newElement = recomputedTextElementOptions(
            newTemplateElement,
            page
          );
          newElements = newElements.push(
            Map(merge(newElement, { id: guid() }))
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  });

  // if templateElement has no textElement keep orin textElement
  if (!textInTemplate.length && textElements.length) {
    textElements.forEach((element) => {
      newElements = newElements.push(Map(merge(element, { id: guid() })));
    });
  }
  // keep origin decorationElement
  decorationElements.forEach((element) => {
    newElements = newElements.push(Map(merge(element, { id: guid() })));
  });

  if (templateElements[0].type === elementTypes.photo) {
    newElements = newElements.filter((ele) => {
      return ele.get('type') === elementTypes.photo;
    });
  } else {
    newElements = newElements.filter((ele) => {
      return ele.get('type') === elementTypes.text;
    });
  }

  return fromJS(newElements.toJS());
};

/**
 * 根据模板信息和待渲染的图片集合, 创建新的图片元素在指定的页面上.
 * @param  {[type]} page     [description]
 * @param  {[type]} images   [description]
 * @param  {[type]} template [description]
 * @return {[type]}          [description]
 */
export const createNewElementsByTemplate = (
  page,
  images,
  template,
  ratio,
  isHalfCover = false
) => {
  const newElements = [];

  const pageWidth = page.get('width') * ratio;
  const pageHeight = page.get('height') * ratio;

  // 获取template的基本信息和所有的elements
  const bgColor = template.bgColor;
  let templateElements = template.elements;

  const isFront = page.get('type') === pageTypes.front;
  const minPx = getElementsMinPx(fromJS(templateElements));
  const shouldCorrectPxPw = isFront && isHalfCover && minPx > minPxValue;

  templateElements = templateElements.map((tmpl) => {
    // 如果是front page并且是crystal, metal, 对模板里的元素的px, pw进行校正.
    // 因为crystal, metal还是使用的全页模板(左侧是空白的, 只有右侧有元素).
    if (shouldCorrectPxPw) {
      const newPxPw = correctPxPw(tmpl.x, tmpl.px, tmpl.width, tmpl.pw);

      return merge({}, tmpl, newPxPw);
    }

    return tmpl;
  });

  // 给模板的元素按照宽高比进行排序.
  const sortedTemplateElements = templateElements.sort((first, second) => {
    return first.width / first.height > second.width / second.height;
  });

  // 给待渲染的图片按照宽高比进行排序.
  const sortedImages = images.sort((first, second) => {
    return (
      first.get('width') / first.get('height') >
      second.get('width') / second.get('height')
    );
  });

  // 如果模板中包含文本框，将文本框加入元素数组
  const textInTemplate = templateElements.find((element) => {
    return element.type === elementTypes.text;
  });

  if (textInTemplate) {
    const newTextElement = recomputedTextElementOptions(textInTemplate, page);
    newElements.push(
      Map(
        merge({}, newTextElement, {
          id: guid(),
          type: elementTypes.text
        })
      )
    );
  }

  sortedTemplateElements.forEach((templateElement, index) => {
    if (
      sortedImages.size > index &&
      templateElement.type === elementTypes.photo
    ) {
      const image = sortedImages.get(index).toJS();
      const baseElement = new Element(
        recomputedElementOptionsWithImage(image, templateElement, page)
      );

      newElements.push(
        Map(
          merge({}, baseElement, {
            id: guid(),
            type: elementTypes.photo,
            encImgId: image.encImgId,
            imageid: image.imageid
          })
        )
      );
    } else {
      log('照片数小于模板的元素总数.');
    }
  });

  return newElements;
};
