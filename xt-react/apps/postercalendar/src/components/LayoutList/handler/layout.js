import React from 'react';
import Immutable, { fromJS } from 'immutable';
import { merge, isEqual, template, get, isArray, sortBy } from 'lodash';

import {
  elementTypes,
  pageTypes,
  filterOptions,
  productTypes,
  LAYOUT_MAX_VIEW_NUM_PS,
  LAYOUT_MAX_VIEW_NUM_DEFAULT,
  defaultBorder
} from '../../../constants/strings';

import {
  updateElementsByTemplate,
  filterFonts
} from '../../../utils/autoLayoutHepler';
import { checkIsEnablePage } from '../../../utils/sizeCalculator';
import {
  convertResultToJson,
  formatTemplateInstance,
  filterCoverTemplates
} from '../../../utils/template';
import { mergeTemplateElements } from '../../../utils/template/mergeTemplateElements';

const filterTemplate = (that, templateList, pagination, setting) => {
  const filters = [];
  let newList = [];
  const isCover = pagination.sheetIndex == '0';
  const coverType = setting.get('cover');

  const pageEnabled = checkIsEnablePage(
    pagination.total,
    pagination.sheetIndex,
    pagination.pageIndex,
    setting.get('product'),
    setting.get('cover'),
    isCover
  );
  if (pageEnabled) {
    if (isCover) {
      newList = filterCoverTemplates(templateList, coverType);
    } else {
      newList = templateList.filter((item) => {
        return item.sheetType.toLowerCase().indexOf('inner') >= 0;
      });
    }
  } else {
    newList = [];
  }
  newList = newList.filter((item) => {
    return !(item.imageNum === 0 && item.textFrameNum === 0);
  });
  return newList;
};

const getCurrentFilterTag = (that, list, page) => {
  const { data } = that.props;
  let currentFilterTag = that.state.currentFilterTag;
  const { TOP, MY, TEXT } = filterOptions;

  const isPressBook = data.paginationSpread.getIn(['summary', 'isPressBook']);
  const maxView = isPressBook
    ? LAYOUT_MAX_VIEW_NUM_PS
    : LAYOUT_MAX_VIEW_NUM_DEFAULT;

  const numTemplate = groupTemplateByNum(that, list);

  if (page && page.get('template')) {
    const selectedTemplateId = page.getIn(['template', 'tplGuid']);
    const elements = page.get('elements');
    const photoElementSize = elements.filter((ele) => {
      return ele.get('type') === elementTypes.photo;
    }).size;

    const currentTemplate = list.find((item) => {
      return item.guid === selectedTemplateId;
    });

    if (currentTemplate) {
      // 查找顺序: my layouts -> text -> number -> top picks
      // 1. 是否使用了my layouts的模板.
      if (currentTemplate.customerId) {
        currentFilterTag = MY;
      } else if (currentTemplate.textFrameNum) {
        // 2. 是否使用了text的模板.
        currentFilterTag = TEXT;
      } else if (Object.keys(numTemplate).indexOf(currentFilterTag) !== -1) {
        // 3. 是否使用了number的模板.
        currentFilterTag = currentTemplate.imageNum >= maxView ? `${maxView}+`
        : `${currentTemplate.imageNum}`;
      } else {
        // 4. 是否使用了top picks的模板.
        currentFilterTag = TOP;
      }
    } else if (page) {
      // 获取与page上元素个数相同的模板的filter.
      currentFilterTag = !photoElementSize ? TOP :
      (photoElementSize >= maxView ? `${maxView}+` : `${photoElementSize}`);

      // 如果不存在此numfilter则默认TOP
      if (
        currentFilterTag !== TOP &&
        Object.keys(numTemplate).indexOf(currentFilterTag) === -1
      ) {
        currentFilterTag = TOP;
      }
    } else {
      currentFilterTag = TOP;
    }
  }

  return currentFilterTag;
};

const getNumFilterByElementSize = (elementSize, maxView = 5) => {
  const { TOP } = filterOptions;
  if (elementSize) {
    return elementSize >= maxView ? `${maxView}+` : `${elementSize}`;
  }
  return TOP;
};

const getNumFilter = (that, template) => {
  const { data } = that.props;
  const { setting, paginationSpread } = data;
  const product = setting.get('product');
  const { TOP, MY, TEXT } = filterOptions;
  let filterTag = '';

  const isPressBook = paginationSpread.getIn(['summary', 'isPressBook']);
  const maxView = isPressBook
    ? LAYOUT_MAX_VIEW_NUM_PS
    : LAYOUT_MAX_VIEW_NUM_DEFAULT;

  // 判断模板是否包含文本.
  if (template.textFrameNum === 0) {
    // 判断是否为自定义模板.
    if (template.customerId) {
      filterTag = MY;
    } else if (template.imageNum < maxView) {
      filterTag = `${template.imageNum}`;
    } else {
      filterTag = `${maxView}+`;
    }
  } else {
    // 判断是否为自定义模板.
    if (template.customerId) {
      filterTag = MY;
    } else {
      filterTag = TEXT;
    }
  }

  return filterTag;
};

const getFilterTemplateList = (that, list, pagination, setting) => {
  let newList = filterTemplate(that, list, pagination, setting);

  // 按照使用频次排序
  newList = newList.sort((prev, next) => {
    return next.spread - prev.spread;
  });

  return newList;
};

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const { data, actions } = that.props;
  const { boundTrackerActions, boundTemplateActions } = actions;
  const { template, setting, isCover } = data;
  const templateDetails = template.details;
  const size = get(setting, 'spec.size');

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

  that.setState({
    selectedTemplateId: guid
  });
};

/**
 * 把模板根据模板的图片数量分组.
 */
export const groupTemplateByNum = (that, list) => {
  const numTemplate = {};
  const { data } = that.props;
  const { setting, paginationSpread } = data;

  const isPressBook = paginationSpread.getIn(['summary', 'isPressBook']);
  const maxView = isPressBook
    ? LAYOUT_MAX_VIEW_NUM_PS
    : LAYOUT_MAX_VIEW_NUM_DEFAULT;

  list.map((item) => {
    let num = item.imageNum;
    if (item.textFrameNum > 0) {
      return;
    }
    if (num >= maxView) {
      num = `${maxView}+`;
    }
    if (!numTemplate[num]) {
      numTemplate[num] = [];
    }
    numTemplate[num].push(item);
  });
  return numTemplate;
};

export const onSelectFilter = (that, tag) => {
  that.setState({
    currentFilterTag: tag
  });
};

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
const doApplyTemplate = (that, template) => {
  const { data, actions } = that.props;
  const { boundProjectActions, boundPaginationActions } = actions;
  const {
    paginationSpread,
    uploadedImages,
    ratios,
    fontList,
    pagination,
    setting
  } = data;

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
  if(!isPageEnable) {
    page = pages.get('0');
    boundPaginationActions.switchPage(0, page.get('id'));
  };
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

const shiftTemplateSuitImage = (himage, vimage, width, height) => {
  let imageObject = null;
  if (width > height) {
    imageObject = vimage.shift();
  } else {
    imageObject = himage.shift();
  }
  if (typeof imageObject === 'undefined') {
    if (width > height) {
      imageObject = himage.shift();
    } else {
      imageObject = vimage.shift();
    }
  }
  if (typeof imageObject === 'undefined') {
    imageObject = null;
  }
  return imageObject;
};

const getTemplateBySize = (size) => {
  const { data } = that.props;
  const { template } = data;
  const templateList = template.list;
  const tpls = [];
  for (let i = 0; i < templateList.length; i++) {
    const item = templateList[i];
    if (item.designSize === size) {
      tpls.push(item);
    }
  }
  return tpls;
};

const getTemplateByGuid = (guid) => {
  const { data } = that.props;
  const { template } = data;
  const templateList = template.list;

  for (let i = 0; i < templateList.length; i++) {
    const item = templateList[i];
    if (item.guid === guid) {
      return item;
    }
  }
};

const getFitTemplate = (imgsNum, hImgNum, vImgNum) => {
  const { setting } = data;
  let size = setting.get('size');
  let rotated = false,
    tpls = [],
    fitTpls = [],
    optionalTpls = [];
  if (rotated) {
    size = `${size.split('X')[1]}X${size.split('X')[0]}`;
  }
  tpls = getTemplateBySize(size);
  if (tpls.length > 0) {
    for (const index in tpls) {
      const item = tpls[index];
      if (
        item.imageNum == imgsNum &&
        item.isCoverDefault &&
        item.isCoverDefault === 'true'
      ) {
        return item;
      }
    }
  }
  tpls.map((tpl) => {
    if (imgsNum == tpl.imageNum) {
      if (hImgNum == tpl.horizontalNum) {
        fitTpls.push(tpl);
      } else if (vImgNum == tpl.verticalNum) {
        fitTpls.push(tpl);
      } else {
        optionalTpls.push(tpl);
      }
    }
  });
  if (fitTpls.length) {
    if (fitTpls.length === 1) {
      return fitTpls[0];
    }
    const rindex = Math.floor(Math.random() * fitTpls.length);
    return fitTpls[rindex];
  }
  if (optionalTpls.length) {
    const rindex = Math.floor(Math.random() * optionalTpls.length);
    return optionalTpls[rindex];
  }
};

const autoLayout = () => {
  const templateElements = spread.elements;
  if (autoLayout) {
    let imgParams = [],
      imgNums = 0,
      hImgNum = 0,
      vImgNum = 0,
      fitTpl;
    templateElements.map((item) => {
      if (item.elType === 'image') {
        imgParams.push(item);
        if (item.width > item.height) {
          hImgNum++;
        } else {
          vImgNum++;
        }
      }
    });
    imgNums = imgParams.length;
    fitTpl = getFitTemplate(imgNums, hImgNum, vImgNum);
    if (fitTpl) {
      applyTemplate(fitTpl.guid, fitTpl.designSize);
    }
  }
};
