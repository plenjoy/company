import Immutable, { fromJS } from 'immutable';
import { get, sortBy, merge } from 'lodash';
import Element from '../../../utils/entries/element';
import { elementTypes, pageTypes } from '../../../contants/strings';
import {
  autoLayoutByCoverImages,
  autoLayoutByInnerImages
} from '../../../utils/autoLayout';
import { updateElementsByTemplate } from '../../../utils/autoLayoutHepler';
import { checkIsImageCover } from '../../../utils/sizeCalculator';
import { getCropOptions } from '../../../utils/crop';
import {
  createPhotoElement,
  createCoverPagePhotoElement,
  updateElementByTemplate
} from '../../../utils/elementHelper';
import {
  convertResultToJson,
  formatTemplateInstance,
  filterCoverTemplates
} from '../../../utils/template';
import { getAutoFillDataByGroups } from '../../../../../common/utils/autofill/autofill';
import {
  getDefaultRandomTemplateId,
  getTemplateIdByImageShape
} from '../../../utils/template/getTemplateId';
import { mergeTemplateData } from '../../../utils/template/mergeTemplateData';

const getElement = (allElements, eid) => {
  return allElements.find((ele) => {
    return ele.get('id') === eid;
  });
};

function getPageTemplateMap(
  pageArray,
  allTemplatesList,
  allElements,
  allImages,
  autoFillImages,
  productSize
) {
  let pageTemplateMap = Immutable.Map();
  pageArray.forEach((page) => {
    if (page.get('type') === pageTypes.sheet && autoFillImages.length) {
      let images = [];
      let photoElements = Immutable.List();
      const pageElements = [];
      page.get('elements').forEach((elementId) => {
        const element = allElements.find(o => o.get('id') === elementId);

        if (
          element.get('type') === elementTypes.photo &&
          element.get('encImgId')
        ) {
          photoElements = photoElements.push(element);
        }
      });
      if (photoElements.size < 2) {
        photoElements.forEach((element) => {
          const image = allImages.find((o) => {
            return o.get('encImgId') === element.get('encImgId');
          });
          if (image) {
            pageElements.push(element.toJS());
            images.push(image.toJS());
          }
        });

        while (images.length < 2 && autoFillImages.length) {
          const sheetImages = autoFillImages.shift();
          images = images.concat(sheetImages);
        }

        const templateId = getTemplateIdByImageShape(
          allTemplatesList,
          images,
          productSize
        );

        pageTemplateMap = pageTemplateMap.set(
          page.get('id'),
          Immutable.Map({
            templateId,
            images,
            pageElements
          })
        );
      }
    }
  });

  return pageTemplateMap;
}

const createNewPhotoCoverElement = (that) => {
  const {
    project,
    allImages,
    templateForCover,
    settings,
    boundProjectActions,
    boundTemplateActions
  } = that.props;

  const templates = templateForCover.get('list').toJS();
  const templateDetails = templateForCover.get('details').toJS();

  const cover = project.get('cover');
  const containers = project.getIn(['cover', 'containers']);
  const elementArray = project.get('elementArray');

  let fullPage;
  let spinePage;

  const isImageCover = checkIsImageCover(
    Immutable.Map({
      pages: cover.get('containers'),
      elements: elementArray
    })
  );

  if (isImageCover) {
    if (containers && containers.size) {
      fullPage = containers.find(
        page =>
          page.get('type') === pageTypes.full &&
          page.getIn(['backend', 'isPrint'])
      );
      spinePage = containers.find(page => page.get('type') === pageTypes.spine);
    }

    const productSize = get(settings, 'spec.size');

    const expandingOverFrontcover = project.getIn([
      'parameterMap',
      'spineExpanding',
      'expandingOverFrontcover'
    ]);
    const coverThickness = project.getIn(['parameterMap', 'coverThickness']);

    const coverType = project.getIn(['setting', 'cover']);
    const isCover = true;

    let element;
    const coverImageId = getEncImageId(
      elementArray,
      fullPage.getIn(['elements', 0])
    );

    if (fullPage && spinePage && !coverImageId) {
      element = createCoverPagePhotoElement(
        fullPage,
        spinePage,
        coverThickness,
        expandingOverFrontcover,
        coverType
      );
    }

    if (element) {
      const sizes = productSize.split('X');

      // 从所有的图片列表中, 选择一张图片的比例最接近的设置为封面.
      const imageObj = getSuitableImage(
        allImages,
        // 5x7: 5指的是高, 7：为宽.
        parseInt(sizes[1]) / parseInt(sizes[0])
      );

      if (!imageObj) {
        return;
      }

      const imageWidth = parseInt(imageObj.get('width'));
      const imageHeight = parseInt(imageObj.get('height'));

      const newElement = merge({}, element, {
        encImgId: imageObj.get('encImgId'),
        imgRot: imageObj.get('orientation') || 0
      });

      const templateId = getDefaultRandomTemplateId(templates);

      boundTemplateActions
        .getTemplateData([templateId], productSize)
        .then((newTemplates) => {
          const newElements = mergeTemplateData(
            [imageObj.toJS()],
            newTemplates[0],
            allImages.toJS(),
            fullPage.get('width'),
            fullPage.get('height'),
            [newElement]
          );

          boundProjectActions.applyTemplate(
            fullPage.get('id'),
            templateId,
            newElements
          );
        });
    }
  }
};

const updatePhotoCoverElement = (that) => {
  const {
    project,
    allImages,
    settings,
    allElements,
    boundProjectActions
  } = that.props;
  const productSize = get(settings, 'spec.size');

  // 检查当前的封面是否允许放置图片.
  const cover = project.get('cover');
  const isImageCover = checkIsImageCover(
    Immutable.Map({
      pages: cover.get('containers'),
      elements: allElements
    })
  );

  if (!isImageCover) {
    return;
  }

  // 获取封面上的fullpage.
  const containers = project.getIn(['cover', 'containers']);
  const fullPage = containers.find(
    page =>
      page.get('type') === pageTypes.full &&
      page.getIn(['backend', 'isPrint'])
  );

  // 获取封面上的元素.
  if (fullPage) {
    const elementId = fullPage.getIn(['elements', '0']);
    const element = allElements.find(ele => ele.get('id') === elementId);

    // 如果找到了元素, 就更新元素的图片信息.
    if (element) {
      // 检查元素有没有添加图片, 如果添加了, 就使用原来的.
      if (element.get('encImgId')) {
        return;
      }

      // 从所有的图片列表中, 选择一张图片的比例最接近的设置为封面.
      const sizes = productSize.split('X');
      const imageObj = getSuitableImage(
        allImages,
        element.get('width') / element.get('height')
      );

      // 如果没有找到合适的图片, 就直接返回.
      if (!imageObj) {
        return;
      }

      // 使用新的图片, 更新封面上图片元素的encImgId, crop等信息.
      const imageWidth = parseInt(imageObj.get('width'));
      const imageHeight = parseInt(imageObj.get('height'));
      const orientation = parseInt(imageObj.get('orientation')) || 0;
      const pageWidth = fullPage.get('width');
      const pageHeight = fullPage.get('height');

      const {
        cropLUX,
        cropLUY,
        cropRLX,
        cropRLY
      } = getCropOptions(imageWidth, imageHeight, element.get('pw') * pageWidth, element.get('ph') * pageHeight, orientation);

      const newElement = element.merge({
        cropLUX,
        cropLUY,
        cropRLX,
        cropRLY,
        encImgId: imageObj.get('encImgId'),
        imageid: imageObj.get('imageid'),
        imgFlip: false,
        imgRot: orientation
      });

      boundProjectActions.updateElement(newElement);
    } else {
      createNewPhotoCoverElement(that);
    }
  }
};

const doApplyTemplate = (that, template, page, elementArray, allImages) => {
  const {
    paginationSpread,
    pagination,
    ratios,
    boundProjectActions,
    allElements
  } = that.props;

  const spineElement = allElements.find((ele) => {
    return ele.get('type') === elementTypes.text;
  });

  const elementIds = page.get('elements');

  const elements =
    elementArray ||
    elementIds.map((eid) => {
      return getElement(allElements, eid);
    });

  let iImages = [];
  const isHalfCover = false;

  let iElements = [];
  let newElements;

  const textOrPhotoElements = elements.filterNot(
    ele => ele.get('type') === elementTypes.decoration
  );
  const emptyTextElements = elements.filter(
    ele => ele.get('type') === elementTypes.text && !ele.get('text')
  );
  const stickersElements = elements.filter(
    ele => ele.get('type') === elementTypes.decoration
  );

  // 获取所有空文本元素的id集合.
  const emptyTextElementIds = [];
  if (emptyTextElements && emptyTextElements.size) {
    emptyTextElements.forEach((ele) => {
      emptyTextElementIds.push(ele.get('id'));
    });
  }

  if (allImages) {
    iImages = allImages;
  }

  textOrPhotoElements.forEach((element) => {
    if (element.get('type') === elementTypes.text) {
      if (element.get('text')) {
        iElements.push(element);
      }
    } else {
      iElements.push(element);
    }
  });

  const templateElements = template.elements;
  const textInTemplate = templateElements.filter((element) => {
    return element.type === elementTypes.text;
  });

  if (textInTemplate.length) {
    // 选出为text且不为空的element
    const iElementsTextElement = iElements.filter(
      ele => ele.get('type') === elementTypes.text && !!ele.get('text')
    );
    const iElementsPhotoElement = iElements.filter(
      ele => ele.get('type') === elementTypes.photo
    );
    const templateTextElement = templateElements.filter(
      ele => ele.type === elementTypes.text
    );

    // 页面上面的textelement 大于模板的的个数选择最新的N个 N为模板的数量
    const templateTextElementLength = templateTextElement.length;
    const iElementsTextElementLength = iElementsTextElement.length;

    if (iElementsTextElementLength >= templateTextElementLength) {
      // 去掉多余的 textelement元素 如果比模板数量多
      const filtersSortIElementsTextElemen = [];
      // 根据最新操作时间进行排序 返回最新的操作过的模板
      const sortIElementsTextElement = sortBy(
        iElementsTextElement,
        n => -n.get('lastModified')
      );
      // 模板有N个text 只插入最新的N个text
      for (let i = 0; i < templateTextElementLength; i++) {
        filtersSortIElementsTextElemen.push(sortIElementsTextElement[i]);
      }
      // 合并排序好的 text 加 photo模板；
      iElements = iElementsPhotoElement.concat(filtersSortIElementsTextElemen);
    }
    // 根据模板信息, 更新页面上的所有元素.
    newElements = updateElementsByTemplate(
      page,
      iElements,
      iImages,
      template,
      isHalfCover
    );

    // 调整sticker的dep, 使它始终在图片和文字的最上面.
    const maxDepElement = newElements.maxBy(ele => ele.get('dep'));
    const maxDep = maxDepElement ? maxDepElement.get('dep') : 0;

    const newStickerElemnets = updateStickersDep(maxDep, stickersElements);

    // 更新sticker.
    if (newStickerElemnets && newStickerElemnets.size) {
      newElements = newElements.concat(newStickerElemnets);
    }

    newElements = newElements.setIn([0, 'text'], spineElement.get('text'));
    newElements = newElements.setIn(
      [0, 'fontColor'],
      spineElement.get('fontColor')
    );

    // 应用模板, 更新store上的page和page上的elements.
    if (newElements && newElements.size) {
      if (emptyTextElementIds && emptyTextElementIds.length) {
        return boundProjectActions
          .deleteElements(emptyTextElementIds)
          .then(() => {
            return boundProjectActions.applyTemplate(
              page.get('id'),
              template.id,
              newElements
            );
          });
      }
      return boundProjectActions.applyTemplate(
        page.get('id'),
        template.id,
        newElements
      );
    }
  } else {
    // 根据模板信息, 更新页面上的所有元素.
    newElements = updateElementsByTemplate(
      page,
      iElements,
      iImages,
      template,
      isHalfCover
    );

    // 调整sticker的dep, 使它始终在图片和文字的最上面.
    const maxDepElement = newElements.maxBy(ele => ele.get('dep'));
    const maxDep = maxDepElement ? maxDepElement.get('dep') : 0;

    const newStickerElemnets = updateStickersDep(maxDep, stickersElements);

    // 更新sticker.
    if (newStickerElemnets && newStickerElemnets.size) {
      newElements = newElements.concat(newStickerElemnets);
    }

    // 应用模板, 更新store上的page和page上的elements.
    if (newElements && newElements.size) {
      if (emptyTextElementIds && emptyTextElementIds.length) {
        return boundProjectActions
          .deleteElements(emptyTextElementIds)
          .then(() => {
            return boundProjectActions.applyTemplate(
              page.get('id'),
              template.id,
              newElements
            );
          });
      }
      return boundProjectActions.applyTemplate(
        page.get('id'),
        template.id,
        newElements
      );
    }
  }
  return Promise.resolve();
};

const updateStickersDep = (baseDep, elements) => {
  // 更加dep, 从小到大排序.
  let sortedElements = elements.sort((first, second) => {
    return first.get('dep') - second.get('dep');
  });

  if (baseDep && sortedElements && sortedElements.size) {
    const firstElementDep = sortedElements.getIn(['0', 'dep']);

    if (firstElementDep > baseDep) {
      return sortedElements;
    }
    const step = baseDep - firstElementDep + 1;

    sortedElements = sortedElements.map(ele =>
      ele.set('dep', ele.get('dep') + step)
    );

    return sortedElements;
  }

  return [];
};

const getEncImageId = (elements, elementId) => {
  const element = elements.find((ele) => {
    return ele.get('id') === elementId;
  });
  return element ? element.get('encImgId') : '';
};

const getSuitableImage = (imageArray, elementRatio = 1) => {
  let image;
  const findBestSizeImage = (images, ratio) => {
    let img = null;

    if (images && images.size) {
      const newImageArray = images.map((m) => {
        const imageRatio = parseInt(m.get('width')) / parseInt(m.get('height'));

        return m.merge({
          ratioStep: Math.abs(ratio - imageRatio)
        });
      });

      img = newImageArray.minBy((m) => {
        return m.ratioStep;
      });
    }

    return img;
  };

  if (imageArray && imageArray.size) {
    const horizontalImages = imageArray.filter(
      m => parseInt(m.get('width')) >= parseInt(m.get('height'))
    );
    const verticalImages = imageArray.filter(
      m => parseInt(m.get('width')) < parseInt(m.get('height'))
    );

    // 先选择横版的图片.
    image = findBestSizeImage(horizontalImages, elementRatio);

    if (!image) {
      // 如果没有找到, 就选择一张竖版的图片.
      image = findBestSizeImage(verticalImages, elementRatio);
    }
  }

  return image;
};

/**
 * 查找内页中, 只有半页为空和全页都为空的页面的个数.
 * @param  {[type]} pageArray [description]
 * @return {[type]}           [description]
 */
const getEmptyElementsPageCount = (pageArray, allElements) => {
  const data = [];

  // 页面中只有半页没有放置图片.
  const single = 0;

  // 页面中, 左右都没有放置图片.
  const double = 0;

  if (pageArray && pageArray.size) {
    pageArray.forEach((page) => {
      if (page.get('type') === pageTypes.sheet) {
        let emptyCount = 0;
        const elementIds = page.get('elements');

        if (elementIds && elementIds.size) {
          elementIds.forEach((id) => {
            const ele = getElement(allElements, id);

            if (
              ele &&
              ele.get('type') === elementTypes.photo &&
              !ele.get('encImgId')
            ) {
              emptyCount += 1;
            }
          });
        } else {
          // 空的page.
          emptyCount += 2;
        }

        if (emptyCount === 1) {
          data.push(1);
        } else if (emptyCount > 1) {
          data.push(2);
        }
      }
    });
  }

  return data;
};

export const doAutoLayout = (that, addedElements, page, pageImages) => {
  const {
    paginationSpread,
    pagination,
    settings,
    boundProjectActions,
    boundTrackerActions,
    boundTemplateActions,
    allImages,
    allElements
  } = that.props;

  const template = get(that.props, 'templateObjectForInner');
  const iImages = [];
  const pageId = page.get('id');
  const elementIds = page.get('elements');
  const immutableAddedElements = Immutable.fromJS(addedElements);

  let elements = elementIds
    .map((eid) => {
      return getElement(allElements, eid);
    })
    .concat(immutableAddedElements);

  if (pageImages) {
    const mergedElements = elements;

    // 将所有的images填充到page的element中.
    mergedElements.forEach((ele, index) => {
      if (!ele.get('encImgId')) {
        const image = pageImages.shift();

        if (image) {
          elements = elements.setIn([index, 'encImgId'], image.encImgId);
        }
      }
    });
  }

  allImages.forEach((im) => {
    const encImgId = im.get('encImgId');
    elements.forEach((ele) => {
      if (ele.get('encImgId') === encImgId) {
        iImages.push(im);
      }
    });
  });

  // 解构一些变量.
  const isEnableAutoLayout = get(settings, 'bookSetting.autoLayout') || true;
  const coverType = get(settings, 'spec.cover');

  // 判断autolayout是否开启.
  if (isEnableAutoLayout && elements.size) {
    const projectSize = get(settings, 'spec.size');
    const allTemplatesList = template.get('list').toJS();
    const templateDetails = template.get('details').toJS();

    // 根据cover/inner 筛选模板
    const isCover = false;

    // 根据页面元素和模板列表, 选出符合条件的模板.
    const templateOverView = autoLayoutByInnerImages(
      iImages,
      allTemplatesList,
      projectSize
    );

    // 如果找到模板.
    if (templateOverView) {
      const guid = templateOverView.guid;

      // 下载后的模板信息,会缓存到store上, 键以:<guid>_<size>两部分构成.
      const templateId = `${guid}_${projectSize}`;

      // 如果在store上找不到当前id的模板信息,说明该模板还没有下载
      if (!templateDetails[templateId]) {
        boundTemplateActions
          .getTemplateInfo(guid, projectSize)
          .then((response) => {
            // 把请求返回值中的xml转成json.
            const results = convertResultToJson(response);

            // 格式化template的原始数据, 使它可以在app中可以使用的格式
            const newTemplates = formatTemplateInstance(
              results,
              [guid],
              projectSize
            );

            if (newTemplates && newTemplates.length) {
              doApplyTemplate(
                that,
                newTemplates[0][templateId],
                page,
                elements,
                allImages.toJS()
              );
            }
          });
      } else {
        // 直接使用已经下载了的模板.
        doApplyTemplate(
          that,
          templateDetails[templateId],
          page,
          elements,
          allImages.toJS()
        );
      }
    } else {
      boundProjectActions.createElements(pageId, addedElements);
    }
  } else {
    boundProjectActions.createElements(pageId, addedElements);
  }
};

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const {
    template,
    settings,
    project,
    boundTrackerActions,
    boundTemplateActions,
    boundProjectActions,
    allImages,
    allElements,
    variables
  } = that.props;

  const promise = new Promise((resolve, reject) => {
    const size = get(settings, 'spec.size');

    // 应用模版时 的 埋点。
    boundTrackerActions.addTracker(`SelectLayout,${guid}`);
    boundTemplateActions.changeApplyTemplateStatus(true);

    const containers = project.getIn(['cover', 'containers']);
    const fullContainer = containers.find((obj) => {
      return obj.get('type') === pageTypes.full;
    });
    const spinePage = containers.find((obj) => {
      return obj.get('type') === pageTypes.spine;
    });

    const images = [];
    const pageElements = [];
    fullContainer.get('elements').forEach((elementId) => {
      const element = allElements.find(o => o.get('id') === elementId);

      if (
        element.get('type') === elementTypes.photo &&
        element.get('encImgId')
      ) {
        pageElements.push(element.toJS());
        const image = allImages.find(
          o => o.get('encImgId') === element.get('encImgId')
        );
        if (image) {
          images.push(image.toJS());
        }
      }
    });

    boundTemplateActions.getTemplateData([guid], size).then((newTemplates) => {
      const newElements = mergeTemplateData(
        images,
        newTemplates[0],
        allImages.toJS(),
        fullContainer.get('width'),
        fullContainer.get('height'),
        pageElements
      );

      const fixFontColorElements = newElements.map((element) => {
        if (element.type === elementTypes.text) {
          const spineElementId = spinePage.getIn(['elements', '0']);
          const spineElement = allElements.find(
            o => o.get('id') === spineElementId
          );
          return Object.assign({}, element, {
            fontColor: variables.get('coverForegroundColor'),
            text: spineElement ? spineElement.get('text') : ''
          });
        }
        return element;
      });

      boundTemplateActions.changeApplyTemplateStatus(false);

      boundProjectActions
        .applyTemplate(fullContainer.get('id'), guid, fixFontColorElements)
        .then(() => {
          that.setState({
            selectedTemplateId: guid
          });

          resolve();
        }, reject);
    }, reject);
  });

  return promise;
};

export const autoFill = (that, uploadSuccessImages) => {
  const {
    project,
    allElements,
    allImages,
    settings,
    templateObjectForInner,
    boundTemplateActions,
    boundProjectActions
  } = that.props;
  const pageArray = project.get('pageArray');

  // 获取内页页面中, 只有半页为空和全页都为空的page的数量.
  const groups = getEmptyElementsPageCount(pageArray, allElements);

  // uploadSuccessImages: 待分组的图片列表.
  const autoFillImages = getAutoFillDataByGroups(uploadSuccessImages, groups);

  // 更新封面的图片.
  updatePhotoCoverElement(that);

  const productSize = get(settings, 'spec.size');
  const allTemplatesList = templateObjectForInner.get('list').toJS();

  const pageTemplateMap = getPageTemplateMap(
    pageArray,
    allTemplatesList,
    allElements,
    allImages,
    autoFillImages,
    productSize
  );

  const templateIds = pageTemplateMap
    .valueSeq()
    .map(o => o.get('templateId'))
    .toArray();

  const allImagesObj = allImages.toJS();

  // 8x8, 6x6公用一套内页的模板.
  const newSize = productSize !== '5X7' ? '6X6' : '5X7';
  boundTemplateActions
    .getTemplateData(templateIds, newSize)
    .then((newTemplates) => {
      let templateDataArray = Immutable.List();

      pageTemplateMap.forEach((value, key) => {
        const thePage = pageArray.find((page) => {
          return page.get('id') === key;
        });

        const templateId = value.get('templateId');
        const theTemplate = newTemplates.find((template) => {
          return template.id === templateId;
        });

        const images = value.get('images');

        const newElements = mergeTemplateData(
          images,
          theTemplate,
          allImagesObj,
          thePage.get('width'),
          thePage.get('height'),
          value.get('pageElements')
        );

        templateDataArray = templateDataArray.push(
          Immutable.fromJS({
            elements: newElements,
            pageId: thePage.get('id'),
            templateId
          })
        );
      });

      boundProjectActions.applyTemplateToPages(templateDataArray).then(() => {
        boundProjectActions.autoSaveProject(true);
      });
    });
};
