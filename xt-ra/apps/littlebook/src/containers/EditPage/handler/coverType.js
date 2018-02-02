import { pageTypes, elementTypes } from '../../../contants/strings';
import { createCoverPageTextElement, createCoverPagePhotoElement } from '../../../utils/elementHelper';
import { customeTemplateIds } from '../../../utils/customeTemplate';
import { toEncode } from '../../../../../common/utils/encode';
import { merge } from 'lodash';

let tmpPhotoElement = {};
let tmpTemplateId = '';

const getSpineText = (that) => {
  let text = '';
  const { project, allElements } = that.props;

  const containers = project.getIn(['cover', 'containers']);
  const spinePage = containers.find(c => c.get('type') === pageTypes.spine);

  if (spinePage && allElements && allElements.size) {
    const ids = spinePage.get('elements');
    if (ids && ids.size) {
      const id = ids.get(0);

      const element = allElements.find(ele => ele.get('id') === id);

      if (element) {
        text = element.get('text');
      }
    }
  }

  return text;
};

const addTextElementToFullPage = (that) => {
  const { project, boundProjectActions, paginationSpread } = that.props;

  const containers = project.getIn(['cover', 'containers']);
  const fullPage = containers.find(c => c.get('type') === pageTypes.full && c.getIn(['backend', 'isPrint']));
  const spinePage = containers.find(c => c.get('type') === pageTypes.spine);

  if (fullPage && spinePage) {
    const bookSetting = project.get('bookSetting').toJS();
    const fontColor = project.getIn(['variableMap', 'coverForegroundColor']);
    const text = getSpineText(that); // || project.getIn(['setting', 'title']);

    // 书脊正面的延边.
    const expandingOverFrontcover = project.getIn(['parameterMap', 'spineExpanding', 'expandingOverFrontcover']);

    tmpPhotoElement = paginationSpread.get('elements').find((ele) => {
      return ele.get('type') === elementTypes.photo;
    });
    tmpTemplateId = fullPage.getIn(['template', 'tplGuid']);

    const textElement = createCoverPageTextElement(
      fullPage,
      spinePage,
      bookSetting,
      expandingOverFrontcover,
      fontColor,
      text
    );

    boundProjectActions.deleteElements(fullPage.get('id'), fullPage.get('elements')).then(() => {
      boundProjectActions.createElement(fullPage.get('id'), textElement);
    });
  }
};

const addPhotoElementToFullPage = (that) => {
  const { project, allImages, boundProjectActions } = that.props;

  const containers = project.getIn(['cover', 'containers']);
  const fullPage = containers.find(c => c.get('type') === pageTypes.full && c.getIn(['backend', 'isPrint']));
  const spinePage = containers.find(c => c.get('type') === pageTypes.spine);

  if (fullPage && spinePage) {
    // 书脊正面的延边.
    const expandingOverFrontcover = project.getIn(['parameterMap', 'spineExpanding', 'expandingOverFrontcover']);
    const coverThickness = project.getIn(['parameterMap', 'coverThickness']);
    const coverType = project.getIn(['setting', 'cover']);

    // 获取切换前图片元素的信息.
    const imgRot = tmpPhotoElement ? tmpPhotoElement.get('imgRot') : 0;
    const encImgId = tmpPhotoElement ? tmpPhotoElement.get('encImgId') : '';
    let imageObj;
    let photoElement;

    if (encImgId) {
      imageObj = allImages.find(image => image.get('encImgId') === encImgId);
      imageObj = imageObj ? imageObj.toJS() : null;

      photoElement = merge({}, createCoverPagePhotoElement(
        fullPage,
        spinePage,
        coverThickness,
        expandingOverFrontcover,
        coverType,
        imageObj,
        imgRot
      ), {
        templateId: customeTemplateIds.full
      });
    }

    boundProjectActions.deleteElements(fullPage.get('id'), fullPage.get('elements')).then(() => {
      if (photoElement) {
        boundProjectActions.createElement(fullPage.get('id'), photoElement).then(() => {
          if (tmpTemplateId) {
            that.applyTemplate(tmpTemplateId);
          }
        });
      }else if (tmpTemplateId) {
        that.applyTemplate(tmpTemplateId);
      }
    });
  }
};

/**
 * [description]
 * @param  {[type]} that  [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export const onSwitchCoverType = (that, value) => {
  const { boundPaginationActions, boundTrackerActions, settings, variables } = that.props;
  const { spec } = settings;
  const backgroundColor = variables.get('coverBackgroundColor');
  const EncodeBackgroundColor = toEncode(backgroundColor);

  // 1: text cover
  // 2: image cover
  switch (value) {
    case 1: {
      addPhotoElementToFullPage(that);
      boundPaginationActions.switchSheet(0);
      //boundTrackerActions.addTracker(`SwitchToPhotoCover,${EncodeBackgroundColor},${spec.cover}`);

      break;
    }
    case 2: {
      addTextElementToFullPage(that);
      boundPaginationActions.switchSheet(0);
      //boundTrackerActions.addTracker(`SwitchToTextCover,${EncodeBackgroundColor},${spec.cover}`);
      break;
    }
    default: {
      break;
    }
  }
};
