import React from 'react';
import Immutable, { fromJS } from 'immutable';
import { merge, isEqual, template, get, isArray, sortBy } from 'lodash';

import {
  elementTypes,
  pageTypes,
  filterOptions,
  productTypes,
  LAYOUT_MAX_VIEW_NUM_PS,
  LAYOUT_MAX_VIEW_NUM_DEFAULT
} from '../../../contants/strings';

import { checkIsSupportHalfImageInCover } from '../../../utils/cover';
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
    newList = merge([], templateList);
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
      } else if (currentTemplate.imageNum) {
        // 3. 是否使用了number的模板.
        currentFilterTag =
          currentTemplate.imageNum >= maxView
            ? `${maxView}+`
            : `${currentTemplate.imageNum}`;
      } else {
        // 4. 是否使用了top picks的模板.
        currentFilterTag = TOP;
      }
    } else if (page) {
      // 获取与page上元素个数相同的模板的filter.
      currentFilterTag = !photoElementSize
        ? TOP
        : photoElementSize >= maxView ? `${maxView}+` : `${photoElementSize}`;

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

// handlers write here
export const receiveProps = (that, nextProps) => {
  const { pageSize, currentFilterTag } = that.state;
  const { MY, TEXT } = filterOptions;
  const oldList = get(that.props, 'data.template.list');
  let newList = get(nextProps, 'data.template.list');

  // page切换时.
  const oldPage = fromJS(get(that.props, 'data.page'));
  const newPage = fromJS(get(nextProps, 'data.page'));

  const oldElements = oldPage ? oldPage.get('elements') : fromJS({});
  const newElements = newPage ? newPage.get('elements') : fromJS({});

  const oldPageId = oldPage ? oldPage.get('id') : 0;
  const newPageId = newPage ? newPage.get('id') : 0;

  const oldTabIndex = that.props.tabIndex;
  const newTabIndex = nextProps.tabIndex;

  const oldSelectedTemplateId = oldPage
    ? oldPage.getIn(['template', 'tplGuid'])
    : -1;
  const newSelectedTemplateId = newPage
    ? newPage.getIn(['template', 'tplGuid'])
    : -1;

  const pagination = get(nextProps, 'data.pagination');
  const setting = get(nextProps, 'data.setting');

  if (oldTabIndex !== newTabIndex) {
    that.setState({
      tabIndex: newTabIndex
    });
  }

  if (
    oldList.length !== newList.length ||
    oldSelectedTemplateId !== newSelectedTemplateId ||
    !Immutable.is(oldElements, newElements)
  ) {
    // 获取过滤好的模板列表.
    newList = getFilterTemplateList(that, newList, pagination, setting);

    // 计算layout选项卡中,选中的选项卡的名称.
    const currentFilterTag = getCurrentFilterTag(that, newList, newPage);

    const photoElementSize = newElements.filter((ele) => {
      return ele.get('type') === elementTypes.photo;
    }).size;

    that.setState({
      currentFilterTag,
      templateList: newList,
      realFilterTag: photoElementSize
    });
  }

  // if (!Immutable.is(oldElements, newElements)) {
  //   // 获取过滤好的模板列表.
  //   newList = getFilterTemplateList(that, newList, pagination, setting);

  //   const photoElementSize = newElements.filter((ele) => {
  //     return ele.get('type') === elementTypes.photo;
  //   }).size;

  //   const isPressBook = nextProps.data.paginationSpread.getIn([
  //     'summary',
  //     'isPressBook'
  //   ]);
  //   const maxView = isPressBook
  //     ? LAYOUT_MAX_VIEW_NUM_PS
  //     : LAYOUT_MAX_VIEW_NUM_DEFAULT;
  //   const copyFilterTag = getNumFilterByElementSize(photoElementSize, maxView);

  //   const numTemplate = groupTemplateByNum(that, newList);
  //   const list = numTemplate[copyFilterTag] || [];
  //   const isDistinctLayout = [TEXT, MY].indexOf(currentFilterTag) >= 0;

  //   if () {
  //     that.setState({
  //       currentFilterTag: copyFilterTag,
  //       realFilterTag: photoElementSize
  //     });
  //   }
  // }
};

export const didMount = (that) => {
  let newList = get(that.props, 'data.template.list');
  const pagination = get(that.props, 'data.pagination');
  const setting = get(that.props, 'data.setting');
  const page = get(that.props, 'data.page');

  // 获取过滤好的模板列表.
  newList = getFilterTemplateList(that, newList, pagination, setting);

  // 计算layout选项卡中,选中的选项卡的名称.
  const currentFilterTag = getCurrentFilterTag(that, newList, page);

  that.setState({
    currentFilterTag,
    templateList: newList
  });
};

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const { data, actions } = that.props;
  const { boundTrackerActions, boundTemplateActions } = actions;
  const { template, setting } = data;
  const templateDetails = template.details;
  const size = setting.get('size');

  // 应用模版时 的 埋点。
  boundTrackerActions.addTracker(`SelectLayout,${guid}`);
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
  const { boundProjectActions } = actions;
  const {
    paginationSpread,
    uploadedImages,
    ratios,
    fontList,
    pagination,
    setting,
    bookSetting
  } = data;

  const coverType = setting.get('cover');
  const isAppliedTheme = paginationSpread.getIn(['summary', 'isAppliedTheme']);
  const isHalfCover = checkIsSupportHalfImageInCover(coverType);

  let iElements = [];
  let newElements = [];
  const elementsAarray = template.elements;
  // 处理已经被禁用的字体
  template.elements = filterFonts(elementsAarray, fontList);

  // 获取当前page上的基本信息和所有的elements
  const pages = paginationSpread.get('pages');
  const pageId = get(pagination, 'pageId');
  const page = pages.find((p) => {
    return p.get('id') === pageId;
  });
  const pageHeight = page.get('height') * ratios.workspace;
  const pageWidth = page.get('width') * ratios.workspace;
  const pageElements = page.get('elements');

  const iPhotoElement = pageElements.filter(
    ele => ele.get('type') === elementTypes.photo && !!ele.get('encImgId')
  );
  const iTextElement = pageElements.filter(
    ele => ele.get('type') === elementTypes.text && !!ele.get('text')
  );
  const stickersElements = pageElements.filter(
    ele => ele.get('type') === elementTypes.sticker
  );
  const iBackgroundElements = pageElements.filter(
    ele => ele.get('type') === elementTypes.background
  );

  const textOrPhotoElements = iPhotoElement.concat(
    iTextElement,
    iBackgroundElements
  );
  textOrPhotoElements.forEach((element) => {
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
      template,
      isHalfCover
    );

    // 调整sticker的dep, 使它始终在图片和文字的最上面.
    const maxDepElement = newElements.maxBy(ele => ele.get('dep'));
    const maxDep = maxDepElement ? maxDepElement.get('dep') : 0;

    const newStickerElements = updateStickersDep(maxDep, stickersElements);

    // 更新sticker.
    if (newStickerElements && newStickerElements.size) {
      newElements = newElements
        .filter(o => o.get('type') !== elementTypes.sticker)
        .concat(newStickerElements);
    }

    // 应用模板, 更新store上的page和page上的elements.
    if (newElements && newElements.size) {
      // 应用border.
      const border = bookSetting.border;
      newElements = newElements.map((element) => {
        if (element.get('type') === elementTypes.photo) {
          return element.get('border')
            ? element
            : element.merge({
              border
            });
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
  iElements = iElements.filter((ele) => {
    return (
      ele.get('type') === elementTypes.photo ||
      ele.get('type') === elementTypes.sticker ||
      ele.get('type') === elementTypes.background
    );
  });

  // 根据模板信息, 更新页面上的所有元素.
  newElements = updateElementsByTemplate(
    page,
    iElements,
    uploadedImages,
    template,
    isHalfCover
  );

  // 调整sticker的dep, 使它始终在图片和文字的最上面.
  const maxDepElement = newElements.maxBy(ele => ele.get('dep'));
  const maxDep = maxDepElement ? maxDepElement.get('dep') : 0;

  const newStickerElements = updateStickersDep(maxDep, stickersElements);

  // 更新sticker.
  if (newStickerElements && newStickerElements.size) {
    newElements = newElements
      .filter(o => o.get('type') !== elementTypes.sticker)
      .concat(newStickerElements);
  }

  // 应用模板, 更新store上的page和page上的elements.
  if (newElements && newElements.size) {
    // 应用border.
    const border = bookSetting.border;
    newElements = newElements.map((element) => {
      if (element.get('type') === elementTypes.photo) {
        return element.get('border')
          ? element
          : element.merge({
            border
          });
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
