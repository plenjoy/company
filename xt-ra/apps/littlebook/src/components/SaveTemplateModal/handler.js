import X2JS from 'x2js';
import { forEach } from 'lodash';
import { pageTypes, spreadTypes } from '../../contants/strings';
import { hexString2Number } from '../../../../common/utils/colorConverter';

export const resetTemplateName = (that, event) => {
  that.setState({
    name: event.target.value
  });
  that.checkTemplateName(event.target.value);
};

export const closeModal = (that) => {
  const closeSaveTemplateModal = that.props.closeSaveTemplateModal;
  closeSaveTemplateModal();
  that.setState({
    name: '',
    timer: null,
    isInvalid: false,
    errorTip: ''
  });
};

export const checkTemplateName = (that, templateName, callback) => {
  const { env, project, checkTemplateName, addNotification, boundPageLoadingModalActions } = that.props;
  const user =  env.userInfo;
  const userId = user.get('id').toString();
  const userName = user.get('firstName');
  const size = project.get('setting').get('size');
  const sheetType = 'INNER';
  const timerFunc = () => {
    checkTemplateName(userId, templateName, size, sheetType).then((res) => {
      if (res && res.status === 'success') {
        if (res.data.hasExisting === 'false') {
          that.setState({
            isInvalid: false,
            errorTip: ''
          });
          if (callback) {
            that.closeModal();
            boundPageLoadingModalActions.showPageLoadingModal('Saving');
            callback();
          }
        }
      } else {
        that.setState({
          isInvalid: true,
          errorTip: 'Name repeat, please give another name'
        });
        if (callback) {
          that.setState({
            isInvalid: true,
            errorTip: 'Name repeat, please give another name'
          });
        }
      }
    });
  };
  if (!templateName.trim()) {
    that.setState({
      name: '',
      isInvalid: true,
      errorTip: 'Template name is required'
    });
  } else if (!(/^[a-zA-Z 0-9\d_\s-]+$/.test(templateName))) {
    that.setState({
      isInvalid: true,
      errorTip: 'Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in template name.'
    });
  } else {
    if (callback) {
      timerFunc();
    } else {
      if (that.state.timer) {
        clearTimeout(that.state.timer);
      }
      const timer = setTimeout(timerFunc, 300);
      that.setState({
        timer
      });
    }
  }
};

export const handleSaveTemplate = (that) => {
  const { saveTemplate, addTemplate, project, addNotification, boundPageLoadingModalActions } = that.props;
  const params = that.getParams();
  const size = project.get('setting').get('size');
  const callback = () => {
    saveTemplate(params).then((res) => {
      boundPageLoadingModalActions.hidePageLoadingModal();
      if (res.result.state === 'success') {
        addTemplate(res.result.template);
        addNotification({
          message: 'Layout saved successfully!',
          level: 'success',
          autoDismiss: 2
        });
      } else if (res.result.state === 'fail') {
        addNotification({
          message: 'Template saved failed! Please try again later.',
          level: 'error',
          autoDismiss: 0
        });
      }
    });
  };
  that.checkTemplateName(that.state.name.trim(), callback);
};

export const getParams = (that) => {
  const { env, project } = that.props;
  const user = env.userInfo;
  const userId = user.get('id').toString();
  const size = project.get('setting').get('size');
  const templateData = that.templateData();
  return {
    customerId: userId,
    name: that.state.name,
    size,
    pageType: templateData.pageType,
    sheetType: templateData.sheetType,
    frameTotalNum: templateData.frameTotalNum.toString(),
    frameHorizonNum: templateData.frameHorizonNum.toString(),
    frameVertialNum: templateData.frameVertialNum.toString(),
    frameSquareNum: templateData.frameSquareNum.toString(),
    xmlViewData: templateData.xmlViewData
  };
};

export const templateData = (that) => {
  const { pageInfo, project } = that.props;
  let frameTotalNum = 0;
  let frameHorizonNum = 0;
  let frameVertialNum = 0;
  let frameSquareNum = 0;
  // const sheetType = project.get('setting').get('cover');
  const sheetType = 'INNER';
  const { pageId, pages, elements, summary } =  pageInfo;
  const pageDetails = that.getPageElementIds(pageId, pages);
  const { pageElementIds, halfPageTemplate } = pageDetails;
  const pageType = halfPageTemplate? 'half' : 'full';
  const pagePositon = summary.isCover ? spreadTypes.coverPage : spreadTypes.innerPage;
  const elementArray = [];
  // 获取当前页的 elements 的 json 格式。
  forEach(elements, (value, key) => {
    if (pageElementIds.indexOf(key) > -1 && value.elType === 'image') {
      frameTotalNum += 1;
      const WHRatio = value.width / value.height;
      if (WHRatio > 1) {
        frameHorizonNum += 1;
      } else if (WHRatio < 1) {
        frameVertialNum += 1;
      } else {
        frameSquareNum += 1;
      }
      elementArray.push({ _type: 'PhotoElement', _x: value.x, _y: value.y, _width: value.width, _height: value.height, _px: value.px, _py: value.py, _pw: value.pw, _ph: value.ph, _rot: value.rot, _dep: value.dep });
    }
  });
  //  定义 xmlViewData 的数据结构。
  const templateJson = {
    templateView: {
      spread: {
        _type: pagePositon,
        _bgColor: hexString2Number('#FFF'),
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
    frameSquareNum,
    xmlViewData
  };
};

export const getPageElementIds = (pageId, pages) => {
  let halfPageTemplate;
  let pageElementIds;
  pages.forEach((item) => {
    if (pageId === item.id) {
      halfPageTemplate = item.type === pageTypes.page;
      pageElementIds = item.elements;
    }
  });
  return {
    halfPageTemplate,
    pageElementIds
  };
};
