import X2JS from 'x2js';
import { forEach, get } from 'lodash';
import { fromJS, List } from 'immutable';
import { pageTypes, spreadTypes, CcSheetTypeArray, layoutSheetType, elementTypes, elType, mapCoverForLayout, productCodes } from '../../../contants/strings';
import { hexString2Number } from '../../../../../common/utils/colorConverter';
import { convertObjIn } from '../../../../../common/utils/typeConverter';
import { hexToDec } from '../../../../../common/utils/math';
import { checkIsSupportImageInCover, checkIsSupportFullImageInCover, checkIsSupportHalfImageInCover } from '../../../utils/cover';
import { convertResultToJson, formatTemplateInstance, filterCoverTemplates } from '../../../utils/template';
import { updateElementsByTemplate } from '../../../utils/autoLayoutHepler';

export const getPageElementIds = (pageId, pages) => {
  let halfPageTemplate = '';
  let pageElementIds;
  let bgColor;
  pages.forEach((item) => {
    if (pageId === item.id) {
      // page type:
      // - page: 半页
      // - sheet: 全页
      halfPageTemplate = item.type === pageTypes.page;
      pageElementIds = item.elements;
      bgColor = item.bgColor;
    }
  });
  return {
    halfPageTemplate,
    pageElementIds,
    bgColor
  };
};

export const getMapSheetType = (productCode, cover, size, isCover) => {
  let resCover;
  for (const key in mapCoverForLayout) {
    if (mapCoverForLayout.hasOwnProperty(key)) {
      const item = mapCoverForLayout[key];
      if (item.indexOf(cover) >= 0) {
        resCover = key;
        break;
      }
    }
  }
  if (productCode === 'V2_PRESSBOOK') {
    return 'HC';
  } else {
    if (isCover) {
      if (CcSheetTypeArray.indexOf(resCover) >= 0) {
        return 'CC';
      } else if (['5X7', '7X5'].indexOf(size.toUpperCase()) >= 0) {
        return 'PA';
      } else {
        return 'HC';
      }
    } else {
      if (['5X7', '7X5'].indexOf(size.toUpperCase()) >= 0) {
           return 'PA';
       } else {
         return 'HC';
       }
    }
  }
};

export const getTemplateData = (that) => {
  const {
    pagination,
    paginationSpread,
    project,
    boundAlertModalActions,
    t
  } = that.props;
  let frameTotalNum = 0;
  let textFrameNum = 0;
  let frameHorizonNum = 0;
  let textFrameHorizonNum = 0;
  let frameVertialNum = 0;
  let textFrameVertialNum = 0;
  let frameSquareNum = 0;
  const cover = project.setting.get('cover');
  const product = project.setting.get('product');
  const size = project.setting.get('size');
  const productCode = productCodes[product];
  const { pageId } = pagination;
  const pages = paginationSpread.get('pages').toJS();
  const summary = paginationSpread.get('summary').toJS();
  const pageDetails = getPageElementIds(pageId, pages);
  const { pageElementIds, halfPageTemplate, bgColor } = pageDetails;
  const sheetType = getMapSheetType(productCode, cover, size, summary.isCover);
  const isCoverDefault = summary.isCover ? 1 : 0;
  const pageType = halfPageTemplate ? 'half' : 'full';
  const pagePositon = summary.isCover ? spreadTypes.coverPage : spreadTypes.innerPage;
  const elementArray = [];
  const pageBgColor = bgColor || '#FFFFFF';

  // 如果该页中没有一个元素框的话会弹出提示框不继续保存。
  if ((pageElementIds instanceof Array) && !pageElementIds.length) {
    boundAlertModalActions.showAlertModal({
      title: t('SAVE_EMPTY_LAYOUT_ERROR'),
      message: t('SAVE_EMPTY_LAYOUT_MESSAGE')
    });
    return 'blankPage';
  }

    pageElementIds.forEach((element) => {
      switch (element.type) {
        case elementTypes.photo: {
          frameTotalNum += 1;
          const WHRatio = element.width / element.height;
          if (WHRatio > 1) {
            frameHorizonNum += 1;
          } else if (WHRatio < 1) {
            frameVertialNum += 1;
          } else {
            frameSquareNum += 1;
          }
          elementArray.push({
            _type: elementTypes.photo,
            _x: element.x,
            _y: element.y,
            _width: element.width,
            _height: element.height,
            _px: element.px,
            _py: element.py,
            _pw: element.pw,
            _ph: element.ph,
            _rot: element.rot,
            _dep: element.dep
          });
          break;
        }
        case elementTypes.text: {
          textFrameNum += 1;
          const WHRatio = element.width / element.height;
          if (WHRatio > 1) {
            textFrameHorizonNum += 1;
          } else if (WHRatio < 1) {
            textFrameVertialNum += 1;
          }
          elementArray.push({
            _type: elementTypes.text,
            _x: element.x,
            _y: element.y,
            _width: element.width,
            _height: element.height,
            _px: element.px,
            _py: element.py,
            _pw: element.pw,
            _ph: element.ph,
            _rot: element.rot,
            _dep: element.dep,
            _color: hexToDec(element.fontColor),
            _fontSize: element.fontSize,
            _textAlign: element.textAlign,
            _fontWeight: element.fontWeight,
            _fontFamily: element.fontFamily,
            _textVAlign: element.textVAlign
          });
          break;
        }
        default:
      }
    });

  //  定义 xmlViewData 的数据结构。
  const templateJson = {
    templateView: {
      spread: {
        _type: pagePositon,
        _bgColor: hexString2Number(pageBgColor),
        elements: {
          element: elementArray
        }
      }
    }
  };
  const x2jsInstance = new X2JS({
    escapeMode: false
  });
  // 将 json 结构的 xmlViewData 转化为 xml 字符串。
  const xmlViewData = x2jsInstance.js2xml(templateJson);
  return {
    sheetType,
    pageType,
    frameTotalNum,
    frameHorizonNum,
    frameVertialNum,
    textFrameNum,
    textFrameHorizonNum,
    textFrameVertialNum,
    frameSquareNum,
    xmlViewData,
    isCoverDefault
  };
};

export const getParams = (that) => {
  const { env, project } = that.props;
  const user = env.userInfo;
  const userId = user.get('id').toString();
  const size = project.setting.get('size');
  const product = project.setting.get('product');
  const productType = productCodes[product];
  const templateData = getTemplateData(that);
  if (templateData === 'blankPage') return 'blankPage';
  return {
    customerId: userId,
    name: new Date().getTime(),
    size,
    pageType: templateData.pageType,
    sheetType: templateData.sheetType,
    frameTotalNum: templateData.frameTotalNum.toString(),
    frameHorizonNum: templateData.frameHorizonNum.toString(),
    frameVertialNum: templateData.frameVertialNum.toString(),
    frameSquareNum: templateData.frameSquareNum.toString(),
    textFrameTotalNum: templateData.textFrameNum.toString(),
    textFrameHorizonNum: templateData.textFrameHorizonNum.toString(),
    textFrameVertialNum: templateData.textFrameVertialNum.toString(),
    xmlViewData: templateData.xmlViewData,
    isCoverDefault: templateData.isCoverDefault,
    product: productType
  };
};

export const handleSaveTemplate = (that) => {
  const {
    boundTemplateActions,
    boundNotificationActions,
    boundProjectActions,
    // boundPageLoadingModalActions,
    t,
    pagination
  } = that.props;
  const saveLayout = boundTemplateActions.saveLayout;
  const addTemplate = boundTemplateActions.addTemplate;
  const addNotification = boundNotificationActions.addNotification;
  const isCover = pagination.sheetIndex === 0;
  const params = getParams(that);
  if (params === 'blankPage') return;
  that.setState({
    isSavingLayout: true
  });
  // boundPageLoadingModalActions.showPageLoadingModal('Saving');
  saveLayout(params).then((res) => {
    // boundPageLoadingModalActions.hidePageLoadingModal();
    if (res.result.state === 'success') {
      addTemplate(convertObjIn(res.result.template), isCover).then((template) => {
        const { pageId } = pagination;

        if (pageId) {
          boundProjectActions.updatePageTemplateId(pageId, template.guid);
        }
      });

      addNotification({
        message: t('SAVE_LAYOUT_SUCCESSFULLY_MESSAGE'),
        level: t('SAVE_LAYOUT_SUCCESSFULLY_LEVEL'),
        autoDismiss: 2
      });
    } else if (res.result.state === 'fail') {
      addNotification({
        message: t('SAVE_LAYOUT_FAIL_MESSAGE'),
        level: t('SAVE_LAYOUT_FAIL_LEVEL'),
        autoDismiss: 0
      });
    }
    that.setState({
      isSavingLayout: false
    });
  });
};
