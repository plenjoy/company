import { get, sortBy, merge } from 'lodash';
import Immutable, { fromJS } from 'immutable';
import { elementTypes, defaultBorder } from '../../../constants/strings';

import {
  convertResultToJson,
  formatTemplateInstance,
  filterCoverTemplates
} from '../../../utils/template';

import {
  updateElementsByTemplate,
  filterFonts
} from '../../../utils/autoLayoutHepler';
import { mergeTemplateElements } from '../../../utils/template/mergeTemplateElements';

export const autoFill = (that, uploadSuccessImages) => {
  const {
    project,
    boundProjectActions
  } = that.props;
  const pageArray = get(project, 'pageArray');
  const cover = get(project, 'cover');
  const containers = cover.get('containers');
  const elementIds = [];
  let usedIndex = 0;
  const willUpdateElements = [];

  const sortedImages = merge([], uploadSuccessImages);
  sortedImages.sort((prev, next) => {
    return get(prev, 'shotTime') - get(next, 'shotTime');
  });

  if (containers && containers.size) {
    containers.forEach((container) => {
      const elements = container.get('elements');
      if (elements && elements.size) {
        elements.forEach((ele) => {
          if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
            elementIds.push(ele.get('id'));
          }
        });
      }
    });
  }

  if (pageArray && pageArray.size) {
    pageArray.forEach((page) => {
      const elements = page.get('elements');
      if (elements && elements.size) {
        elements.forEach((ele) => {
          if (ele.get('type') === elementTypes.photo && !ele.get('encImgId')) {
            elementIds.push(ele.get('id'));
          }
        });
      }
    });
  }

  elementIds.forEach((eleId) => {
    if (sortedImages[usedIndex]) {
      const curElement = sortedImages[usedIndex];
      willUpdateElements.push({
        id: eleId,
        encImgId: curElement.encImgId,
        imageid: curElement.imageId,
        imgRot: 0,
        style: {
          effectId: 0,
          opacity: 100,
          brightness: 0
        },
        imgFlip: false
      });
      usedIndex += 1;
    }
  });

  boundProjectActions.updateElements(willUpdateElements);
};

/**
 * 根据模板详细信息, 应用该模板到当前工作的page上.
 * @param  {object} template 模板详细信息, 结构为: {bgColor, type, elements: []}
 */
const doApplyTemplate = (that, template) => {
  const {
    paginationSpread,
    uploadedImages,
    ratios,
    fontList,
    pagination,
    settings,
    boundProjectActions,
    boundPaginationActions
  } = that.props;

  let iElements = [];
  let newElements = [];
  const elementsAarray = template.elements;
  // 处理已经被禁用的字体
  // template.elements = filterFonts(elementsAarray, fontList);

  // 获取当前page上的基本信息和所有的elements
  const pages = paginationSpread.get('pages');
  const pageId = get(pagination, 'pageId');
  let page = pages.find((p) => {
    return p.get('id') === pageId;
  });
  const isPageEnable = page && page.get('enabled');
  if (!isPageEnable) {
    page = pages.get('0');
    boundPaginationActions.switchPage(0, page.get('id'));
  }
  const pageHeight = page.get('height') * ratios.workspace;
  const pageWidth = page.get('width') * ratios.workspace;
  const pageElements = page.get('elements');

  const iPhotoElement = pageElements.filter(
    ele => ele.get('type') === elementTypes.photo && !!ele.get('encImgId')
  );
  const iTextElement = pageElements.filter(
    ele => ele.get('type') === elementTypes.text && !!ele.get('text')
  );
  const iCalendarElement = pageElements.filter(
    ele => ele.get('type') === elementTypes.calendar
  );
  const textOrPhotoElements = iPhotoElement.concat(iTextElement);
  textOrPhotoElements.forEach((element) => {
    iElements.push(element);
  });
  iCalendarElement.forEach((element) => {
    iElements.push(element);
  });

  const templateElements = template.elements;
  const textInTemplate = templateElements.filter((element) => {
    return element.type === elementTypes.text;
  });

  // 如果模板中包含tetxElement，先清除所有的textElement
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
      uploadedImages,
      template
    );

    // 应用模板, 更新store上的page和page上的elements.
    if (newElements && newElements.size) {
      // 应用border.
      newElements = newElements.map((element) => {
        if (element.get('type') === elementTypes.photo) {
          return element.get('border')
            ? element
            : element.merge(defaultBorder);
        }

        return element;
      });

      const newPage = page.set('elements', newElements);
      let notPhotoElements = Immutable.List();
      let photoElements = Immutable.List();
      newElements.forEach((element) => {
        if (element.get('type') === elementTypes.photo) {
          photoElements = photoElements.push(element);
        } else {
          notPhotoElements = notPhotoElements.push(element);
        }
      });

      const newPhotoElements = mergeTemplateElements(
        newPage,
        photoElements,
        Immutable.fromJS(uploadedImages)
      );

      newElements = newPhotoElements.concat(notPhotoElements);

      return boundProjectActions.applyTemplate(
        page.get('id'),
        template.id,
        newElements
      );
    }

    return Promise.resolve();
  }

  // 没有text模板的情况先移除页面上面的textelement
  iElements = iElements.filter(ele => (ele.get('type') === elementTypes.photo || ele.get('type') === elementTypes.calendar));

  // 根据模板信息, 更新页面上的所有元素.
  newElements = updateElementsByTemplate(
    page,
    iElements,
    uploadedImages,
    template
  );

  // 应用模板, 更新store上的page和page上的elements.
  if (newElements && newElements.size) {
    // 应用border.
    newElements = newElements.map((element) => {
      if (element.get('type') === elementTypes.photo) {
        return element.get('border')
          ? element
          : element.merge(defaultBorder);
      }

      return element;
    });

    const newPage = page.set('elements', newElements);
    let notPhotoElements = Immutable.List();
    let photoElements = Immutable.List();
    newElements.forEach((element) => {
      if (element.get('type') === elementTypes.photo) {
        photoElements = photoElements.push(element);
      } else {
        notPhotoElements = notPhotoElements.push(element);
      }
    });

    const newPhotoElements = mergeTemplateElements(
      newPage,
      photoElements,
      Immutable.fromJS(uploadedImages)
    );

    newElements = newPhotoElements.concat(notPhotoElements);

    return boundProjectActions.applyTemplate(
      page.get('id'),
      template.id,
      newElements
    );
  }

  return Promise.resolve();
};

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const { template, settings, isCover, boundTrackerActions, boundTemplateActions } = that.props;
  const templateDetails = template.details;
  const size = get(settings, 'spec.size');

  // 应用模版时 的 埋点。
  const trackerName = isCover ? 'ChangeCoverLayout' : 'ChangeInnerLayout';
  boundTrackerActions.addTracker(`${trackerName},${guid}`);
  boundTemplateActions.changeApplyTemplateStatus(true);

  // 下载后的模板信息,会缓存到store上, 键以:<guid>_<size>两部分构成.
  const templateId = `${guid}_${size}`;

  // 如果在store上找不到当前id的模板信息,说明该模板还没有下载
  if (!templateDetails[templateId]) {
    boundTemplateActions.getTemplateInfo(guid, size).then((response) => {
      // 把请求返回值中的xml转成json.
      const results = convertResultToJson(response);

      // 格式化template的原始数据, 使它可以在app中可以使用的格式
      const newTemplates = formatTemplateInstance(results, [guid], size);

      if (newTemplates && newTemplates.length) {
        doApplyTemplate(that, newTemplates[0][templateId]).then(() => {
          boundTemplateActions.changeApplyTemplateStatus(false);
        });
      }
    });
  } else {
    // 直接使用已经下载了的模板.
    doApplyTemplate(that, templateDetails[templateId]).then(() => {
      boundTemplateActions.changeApplyTemplateStatus(false);
    });
  }
};

/**
 * 根据的 orientation 或 size, 应用选项切换后对应的模板。
 */
export const applyRelativeTemplate = (that, options) => {
  const {
    settings,
    boundTemplateActions,
    paginationSpread,
    boundPaginationActions,
    pagination
  } = that.props;
  // 获取当前page上的基本信息和所有的elements
  const pages = paginationSpread.get('pages');
  const pageId = get(pagination, 'pageId');
  let page = pages.find((p) => {
    return p.get('id') === pageId;
  });
  const isPageEnable = page && page.get('enabled');
  if (!isPageEnable) {
    page = pages.get('0');
    boundPaginationActions.switchPage(0, page.get('id'));
  }
  const tplGuid = page && page.getIn(['template', 'tplGuid']);
  const size = options.size || get(settings, 'spec.size');
  const orientation = options.orientation || get(settings, 'spec.orientation');
  const requestSize = orientation !== 'Portrait'
    ? size.split('X')[1] + 'X' + size.split('X')[0]
    : size;
  boundTemplateActions.getRelationTemplate(
    tplGuid,
    requestSize,
  ).then((result) => {
    const templateId = get(result, 'data.guid');
    if (templateId && templateId !== -1) {
      boundTemplateActions
        .getTemplateInfo(templateId, requestSize)
        .then(
          () => {
            that.applyTemplate(templateId);
          }
        );
    }
  });
};

