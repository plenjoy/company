import Immutable from 'immutable';
import { get, sortBy } from 'lodash';
import { elementTypes } from '../../../constants/strings';
import { autoLayoutByElements } from '../../../utils/autoLayout';
import { updateElementsByTemplate } from '../../../utils/autoLayoutHepler';
import {
  convertResultToJson,
  formatTemplateInstance,
  filterCoverTemplates
} from '../../../utils/template';
import { getTemplateId } from '../../../utils/template/getTemplateId';
import { mergeTemplateElements } from '../../../utils/template/mergeTemplateElements';

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
const doApplyTemplate = (that, template, nextProps, elementArray) => {
  const { data, actions } = nextProps || that.props;
  const { boundProjectActions } = actions;
  const { images, page, summary, ratio, settings } = data;

  const elements = elementArray || data.elements;
  let newPage = page;

  const iImages = [];
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

  // 解构处理的images是一个Immutable.Map对象. 需要把它转成数组.
  images.forEach((image) => {
    iImages.push(image.toJS());
  });

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

    newPage = page.set('elements', newElements);
    const allImages = images.valueSeq().toList();

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
      allImages
    );

    newElements = newPhotoElements.concat(notPhotoElements);

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

    newPage = page.set('elements', newElements);
    const allImages = images.valueSeq().toList();

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
      allImages
    );

    newElements = newPhotoElements.concat(notPhotoElements);

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
  const { data, actions } = that.props;
  const { settings, page, summary, template, images } = data;

  const { boundProjectActions } = actions;

  const immutableAddedElements = Immutable.fromJS(addedElements);
  const elements = page.get('elements').concat(immutableAddedElements);
  const newPage = page.set('elements', elements);

  // 解构一些变量.
  const isEnableAutoLayout = get(settings, 'bookSetting.autoLayout');
  const coverType = get(settings, 'spec.cover');

  // 判断autolayout是否开启.
  if (isEnableAutoLayout && elements.size) {
    const projectSize = get(settings, 'spec.size');
    let allTemplatesList = get(template, 'list') || [];
    const templateDetails = get(template, 'details');

    // 根据cover/inner 筛选模板
    const isCover = summary.get('isCover');

    if (newPage.get('enabled')) {
      if (isCover) {
        allTemplatesList = filterCoverTemplates(allTemplatesList, coverType);
      } else {
        allTemplatesList = allTemplatesList.filter((item) => {
          return item.sheetType.toLowerCase().indexOf('inner') >= 0;
        });
      }
    } else {
      allTemplatesList = [];
    }

    const pageElementsWithImage = [];
    let countTextFrame = 0;
    elements.forEach((element) => {
      const elementImage = images.get(element.get('encImgId'));
      pageElementsWithImage.push(
        Object.assign({}, element.toJS(), {
          image: elementImage && elementImage.toJS()
        })
      );

      if (element.get('type') === elementTypes.text) {
        countTextFrame += 1;
      }
    });

    const guid = getTemplateId(
      page.get('width'),
      page.get('height'),
      countTextFrame,
      allTemplatesList,
      pageElementsWithImage
    );

    // 如果找到模板.
    if (guid) {
      // 下载后的模板信息,会缓存到store上, 键以:<guid>_<size>两部分构成.
      const templateId = `${guid}_${projectSize}`;

      // 如果在store上找不到当前id的模板信息,说明该模板还没有下载
      if (!templateDetails[templateId]) {
        const { boundTemplateActions } = actions;

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
                that.props,
                elements
              );
            }
          });
      } else {
        // 直接使用已经下载了的模板.
        doApplyTemplate(
          that,
          templateDetails[templateId],
          that.props,
          elements
        );
      }
    } else {
      boundProjectActions.createElements(addedElements);
    }
  } else {
    boundProjectActions.createElements(addedElements);
  }
};

/**
 * 根据模板的guid和size, 下载指定模板详细信息.
 */
export const applyTemplate = (that, guid) => {
  const { actions, data } = that.props;
  const { template, settings } = data;
  const { boundTrackerActions, boundTemplateActions } = actions;
  const templateDetails = template.details;

  const size = get(settings, 'spec.size');

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

          that.elementControlsNode.needRedrawElementControlsRect();
        });
      }
    });
  } else {
    // 直接使用已经下载了的模板.
    doApplyTemplate(that, templateDetails[templateId]).then(() => {
      boundTemplateActions.changeApplyTemplateStatus(false);

      that.elementControlsNode.needRedrawElementControlsRect();
    });
  }

  that.setState({
    selectedTemplateId: guid
  });
};
