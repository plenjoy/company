import React from 'react';
import Immutable from 'immutable';
import { get, sortBy } from 'lodash';
import { elementTypes, pageTypes, imgShape } from '../../../contants/strings';
import {
  autoLayoutByInnerImages,
  selectedDefaultCoverTemplate
} from '../../../utils/autoLayout';
import { updateElementsByTemplate } from '../../../utils/autoLayoutHepler';
import {
  convertResultToJson,
  formatTemplateInstance
} from '../../../utils/template';
import { mergeTemplateData } from '../../../utils/template/mergeTemplateData';
import {
  getDefaultRandomTemplateId,
  getTemplateIdByImageShape,
  getImageShapeString
} from '../../../utils/template/getTemplateId';

/**
 * 更新装饰元素的dep值, 使所有的sticker的dep不小于基础值.
 * @param  {Number} baseDep  基础值的dep值.
 * @param  {Array} elements stickers集合.
 * @return {Array}      更新后的stickers集合
 */
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

/**
 * 根据模板详细信息, 应用该模板到当前工作的page上.
 * @param  {object} template 模板详细信息, 结构为: {bgColor, type, elements: []}
 */
const doApplyTemplate = (
  that,
  template,
  nextProps,
  elementArray,
  allImages
) => {
  const {
    paginationSpread,
    pagination,
    ratios,
    boundProjectActions,
    allElements,
    variables
  } =
    nextProps || that.props;

  const spineElement = allElements.find((ele) => {
    return ele.get('type') === elementTypes.text;
  });

  const pageId = pagination.pageId;

  const pages = paginationSpread.get('pages');
  const images = paginationSpread.get('images');
  const summary = paginationSpread.get('summary');
  const elementsInSheet = paginationSpread.get('elements');

  const page = pages.find((p) => {
    return p.get('id') === pageId;
  });

  const elementIds = page.get('elements');

  const elements =
    elementArray ||
    elementIds.map((eid) => {
      return elementsInSheet.get(eid);
    });

  let iImages = [];
  const isHalfCover = summary.get('isCrystal') || summary.get('isMetal');

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
  } else {
    // 解构处理的images是一个Immutable.Map对象. 需要把它转成数组.
    images.forEach((image) => {
      iImages.push(image.toJS());
    });
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

    const text = spineElement ? spineElement.get('text') : '';
    const fontColor = spineElement
      ? spineElement.get('fontColor')
      : variables.get('coverForegroundColor');
    newElements = newElements.setIn([0, 'text'], text);
    newElements = newElements.setIn([0, 'fontColor'], fontColor);

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

    newElements = newElements.filter((ele) => {
      return ele.get('type') === elementTypes.photo;
    });

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

export const doAutoLayout = (that, addedElements) => {
  const {
    paginationSpread,
    pagination,
    settings,
    boundProjectActions,
    boundTrackerActions,
    boundTemplateActions,
    boundNotificationActions,
    allImages,
    allElements,
    variables,
    ratios,
    t
  } = that.props;

  const ratio = pagination.sheetIndex === 0 ? ratios.coverWorkspace : ratios.innerWorkspace;

  const pageId = pagination.pageId;
  const pages = paginationSpread.get('pages');
  const summary = paginationSpread.get('summary');
  const elementsInSheet = paginationSpread.get('elements');
  const spinePage = paginationSpread.get('pages').find((obj) => {
    return obj.get('type') === pageTypes.spine;
  });

  // 根据cover/inner 筛选模板
  const isCover = summary.get('isCover');
  const template = isCover
    ? get(that.props, 'templateObjectForCover')
    : get(that.props, 'templateObjectForInner');

  const iImages = [];

  const page = pages.find((p) => {
    return p.get('id') === pageId;
  });

  const elementIds = page.get('elements');

  const immutableAddedElements = Immutable.fromJS(addedElements);

  const elements = elementIds
    .map((eid) => {
      return elementsInSheet.get(eid);
    })
    .concat(immutableAddedElements);

  const pageElements = [];
  elements.forEach((element) => {
    const image = allImages.find(
      o => o.get('encImgId') === element.get('encImgId')
    );
    if (image) {
      pageElements.push(element.toJS());
      iImages.push(image.toJS());
    }
  });

  // 解构一些变量.
  const isEnableAutoLayout = get(settings, 'bookSetting.autoLayout') || true;
  const coverType = get(settings, 'spec.cover');
  const productSize = get(settings, 'spec.size');

  // 判断autolayout是否开启.
  if (isEnableAutoLayout && elements.size) {
    const projectSize = get(settings, 'spec.size');
    let allTemplatesList = template.get('list').toJS();
    const templateDetails = template.get('details').toJS();

    if (!page.get('enabled')) {
      allTemplatesList = [];
    }

    const newSize = isCover ? productSize : (
        productSize !== '5X7' ? '6X6' : '5X7'
      );

    const templateId = isCover
      ? getDefaultRandomTemplateId(template.get('list').toJS())
      : getTemplateIdByImageShape(allTemplatesList, iImages, newSize);

    if (templateId) {
      boundTemplateActions.getTemplateData([templateId], newSize).then(
        (newTemplates) => {
          const newElements = mergeTemplateData(
            iImages,
            newTemplates[0],
            allImages.toJS(),
            page.get('width'),
            page.get('height'),
            pageElements,
            ratio
          );

          const fixedElements = fixFontColorElements(
            spinePage,
            allElements,
            variables,
            newElements
          );

          boundProjectActions.applyTemplate(
            page.get('id'),
            templateId,
            fixedElements
          );
        },
        () => {
          if (!that.dragImageFailedNode) {
            boundNotificationActions.addNotification({
              children: (
                <div ref={node => (that.dragImageFailedNode = node)}>
                  {t('ADD_IMAGE_TO_SHEET_FAILED')}
                </div>
              ),
              level: 'error',
              autoDismiss: 0
            });
          }
        }
      );
    }
  }
};

function getImagesByElements(elements, allImages) {
  const images = [];
  elements.forEach((element) => {
    const image = allImages.find((o) => {
      return o.get('encImgId') === element.get('encImgId');
    });

    if (image) {
      images.push(image.toJS());
    }
  });

  return images;
}

function fixFontColorElements(spinePage, allElements, variables, newElements) {
  return newElements.map((element) => {
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
}

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const {
    template,
    settings,
    variables,
    allElements,
    allImages,
    coverElements,
    pagination,
    paginationSpread,
    boundTrackerActions,
    boundTemplateActions,
    boundCoverElementsActions,
    boundProjectActions,
    ratios
  } = that.props;
  const ratio = pagination.sheetIndex === 0 ? ratios.coverWorkspace : ratios.innerWorkspace;
  const templateList = template.get('list');
  const summary = paginationSpread.get('summary');
  const currentPageId = pagination.pageId;

  // 根据cover/inner 筛选模板
  const isCover = summary.get('isCover');
  const isisCoverOrInner = isCover ? 'cover' : 'inner';

  const pages = paginationSpread.get('pages');
  const currentPage = pages.find(page => page.get('id') === currentPageId);

  if (!currentPage) return null;

  const currentTemplateId = currentPage.getIn(['template', 'tplGuid']);

  boundTemplateActions.changeApplyTemplateStatus(true);

  const fullPage = paginationSpread.get('pages').find((obj) => {
    return obj.get('type') === pageTypes.full;
  });
  const spinePage = paginationSpread.get('pages').find((obj) => {
    return obj.get('type') === pageTypes.spine;
  });

  let needCoverElements = false;

  if (fullPage) {
    const fullPageElementIds = fullPage.get('elements');

    const fullPageElements = allElements.filter((obj) => {
      return fullPageElementIds.indexOf(obj.get('id')) !== -1;
    });

    let willApplyTemplateDetail = null;
    let currentTemplateDetail = null;

    templateList.forEach((obj) => {
      if (obj.get('guid') === guid) {
        willApplyTemplateDetail = obj;
      }

      if (obj.get('guid') === fullPage.getIn(['template', 'tplGuid'])) {
        currentTemplateDetail = obj;
      }
    });

    const checkIsPureTextTemplate = (templateDetail) => {
      return (
        templateDetail &&
        templateDetail.get('imageNum') === 0 &&
        templateDetail.get('textFrameNum') > 0
      );
    };

    const checkIsImageTemplate = (templateDetail) => {
      return templateDetail && templateDetail.get('imageNum') > 0;
    };

    if (
      checkIsPureTextTemplate(willApplyTemplateDetail) &&
      checkIsImageTemplate(currentTemplateDetail)
    ) {
      boundCoverElementsActions.saveCoverElements(fullPageElements);
    }

    needCoverElements = Boolean(
      checkIsPureTextTemplate(currentTemplateDetail) &&
        checkIsImageTemplate(willApplyTemplateDetail)
    );
  }

  const size = get(settings, 'spec.size');
  const fixedSize = isCover ? size : (
      size !== '5X7' ? '6X6' : '5X7'
    );

  const elements = currentPage.get('elements').map((elementId) => {
    return allElements.find(o => o.get('id') === elementId);
  });

  const pageElements = needCoverElements ? coverElements : elements;

  boundTemplateActions.getTemplateData([guid], fixedSize).then((newTemplates) => {
    const newElements = mergeTemplateData(
      getImagesByElements(pageElements, allImages),
      newTemplates[0],
      allImages.toJS(),
      currentPage.get('width'),
      currentPage.get('height'),
      pageElements.toJS(),
      ratio
    );

    const fixedElements = fixFontColorElements(
      spinePage,
      allElements,
      variables,
      newElements
    );

    boundProjectActions.applyTemplate(
      currentPage.get('id'),
      guid,
      fixedElements
    );

    // 以下代码为埋点日志: 应用模版时的埋点。
    const currentPageImages = [];
    fixedElements.forEach(ele => {
      const m = allImages.find(image => image.get('encImgId') === ele.encImgId);

      if(m){
        currentPageImages.push(m.toJS());
      }
    });

    const imagesShapesArray = [];
    currentPageImages.forEach(m => {
      imagesShapesArray.push(getImageShapeString(m));
    });

    boundTrackerActions.addTracker(
      `SelectLayout,${isisCoverOrInner},${currentTemplateId},${guid},${String(
        imagesShapesArray
      )}`
    );
  });

  that.setState({
    selectedTemplateId: guid
  });
};
