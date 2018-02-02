import { merge, get, isArray } from 'lodash';
import x2jsInstance from '../../../common/utils/xml2js';
import { convertObjIn } from '../../../common/utils/typeConverter';
import { numberToHex } from '../../../common/utils/colorConverter';
import { limitImageNumberInHalfPageTemplate } from '../contants/strings';
import { checkIsSupportFullImageInCover, checkIsSupportHalfImageInCover } from './cover';

/**
 * 对模板的元素进行校验. 有以下情况的, 即为无效的模板.
 * - 元素的width, height为0
 * - pw, ph小于0.001
 * @param  {[type]} elements [description]
 * @return {[type]}          [description]
 */
const doValid = (elements) => {
  const v = 0.001;

  const element = elements.find((ele) => {
    const { width, height, pw, ph } = ele;

    if (width === 0 || height === 0 || pw < v || ph < v) {
      return true;
    }

    return false;
  });

  // 如果找到了, 说明有无效的元素, 则验证失败.
  return !element;
};

/**
 * 把请求返回值中的xml转成json.
 * @param  {object} result 结构为: {data: [{id: 'xxxx', template: <template>}]}
 */
export const convertResultToJson = (result) => {
  const data = get(result, 'data');
  const newResult = [];

  if (data && data.length) {
    data.forEach((t) => {
      const temp = merge({}, {
        id: t.id,
        template: x2jsInstance.xml2js(t.template)
      });

      newResult.push(temp);
    });
  }

  return newResult;
};

/**
 * 格式化template的原始数据, 使它可以在app中可以使用的格式.
 * @param  {object} results 结构: [{id, template}]
 * @param  {object} templateIds 结构: ['xxxx', 'xxx']
 * @param  {string} size 结构: '8x8'
 * @return {[type]}         [{'xxxxxx': {id, bgColor, type, elements}}]
 */
export const formatTemplateInstance = (results, templateIds, size) => {
  const newResults = [];

  if (templateIds && templateIds.length) {
    templateIds.forEach((id) => {
      const templateId = `${id}_${size}`;
      const template = results.find(r => r.id === id);

      if (template) {
        const elements = convertObjIn(get(template, 'template.templateView.spread.elements.element'));
        const newElements = isArray(elements) ? elements : [elements];

        // 对模板的元素有效性进行校验.
        if (doValid(newElements)) {
          newResults.push({
            [templateId]: {
              id: template.id,
              bgColor: numberToHex(get(template, 'template.templateView.spread.bgColor')),
              type: get(template, 'template.templateView.spread.type'),
              elements: newElements
            }
          });
        }
      }
    });
  }

  return newResults;
};

export const filterCoverTemplates = (templates, coverType) => {
  const isSupportFullImageInCover = checkIsSupportFullImageInCover(coverType);
  const isSupportHalfImageInCover = checkIsSupportHalfImageInCover(coverType);

  let newList = [];

  if (isSupportFullImageInCover) {
    // 使用封面的HC全页模板.  template.customerId 自定义的时候没有只能放2个框的设置
    newList = templates.filter((template) => {
      return template.sheetType.toLowerCase() === 'hc' &&
        template.pageType.toLowerCase() === 'full' && (
          (template.customerId !== 0) ||
          (template.imageNum > 0 && template.imageNum <= limitImageNumberInHalfPageTemplate)
        );
    });
  } else if (isSupportHalfImageInCover) {
    // 使用封面的CC模板..
    newList = templates.filter((template) => {
      return template.sheetType.toLowerCase() === 'cc' &&
        template.pageType.toLowerCase() === 'full' && (
          (template.customerId !== 0) ||
          (template.imageNum > 0 && template.imageNum <= limitImageNumberInHalfPageTemplate)
        );
    });
  }

  return newList;
};
