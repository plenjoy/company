import { merge,get } from 'lodash';
import Immutable, { List } from 'immutable';
import { findDOMNode } from 'react-dom';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { elementTypes, pageTypes, editTextOperateType, shapeTypes } from '../../../contants/strings';
import { collision } from '../../../utils/collision';
import { getSwitchedTemplateId, generateTemplateInfo, customeTemplateIds } from '../../../utils/customeTemplate';
import { updateElementByTemplate, getCoverPhotoElementRect } from '../../../utils/elementHelper';
import { getImage } from '../canvas/elementEvents';
import securityString from '../../../../../common/utils/securityString';
/**
 * 更新书脊和封面正面的text元素.
 * @param  {[type]} that [description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
const updateTextElements = (that, updatedOptions) => {
  const { actions, data } = that.props;
  const { boundProjectActions } = actions;
  const { text, id } = updatedOptions;

  const elements = data.paginationSpread.get('elements');
  const newElements = [];

  if (elements && elements.size) {
    elements.forEach((ele) => {
      if (ele.get('type') === elementTypes.text) {
        newElements.push(merge({}, ele.toJS(), { text }));
      }
    });

    if (newElements && newElements.length) {
      boundProjectActions.updateElements(newElements);
    }
  }
};

/**
 * 根据指定的坐标和宽高来展开元素
 * @param  {object} element 待展开的元素
 * @param  {number} x  展开后的左上角的x坐标
 * @param  {number} y 展开后的左上角的y坐标
 * @param  {number} elementWidth   展开后的元素的宽
 * @param  {number} elementHeight   展开后的元素的高
 */
const expand = (that, element, x, y, elementWidth, elementHeight) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { images } = data;

  boundProjectActions.updateElement({
    id: element.get('id'),
    x,
    y,
    // 重置图片框的旋转
    rot: 0,
    width: elementWidth,
    height: elementHeight
  });
};

/**
 * 编辑图片
 */
export const onEditImage = (that, element, e) => {
  const { data, actions } = that.props;
  const { boundImageEditModalActions, boundProjectActions, boundTrackerActions } = actions;
  const { images, elements, ratio ,env } = data;
  // 计算element的显示宽高.
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');

  const { computed, encImgId, imgRot, imageid, cropLUX, cropLUY, cropRLX, cropRLY } = element.toJS();

  const eWidth = computed.width;
  const eHeight = computed.height;

  const imageDetail = images.get(encImgId);
  const { width, height, name } = imageDetail.toJS();

  const landscapeOrPortrait = (width === height) ? shapeTypes.S :
    (width > height ? shapeTypes.L : shapeTypes.P);

  boundTrackerActions.addTracker(`ClickEdit,${landscapeOrPortrait}`);

  boundImageEditModalActions.showImageEditModal({
    imageEditApiTemplate: computed.corpApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : imageid,
    rotation: imgRot,
    imageWidth: width,
    imageHeight: height,
    imageName: name,
    elementWidth: eWidth / ratio.workspace,
    elementHeight: eHeight / ratio.workspace,
    crop: {
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    },
    securityString,
    onDoneClick: (encImgId, crop, rotate) => {
      boundProjectActions.updateElement(merge({}, crop, { imgRot: rotate, id: element.get('id') }));
    }
  });
};

/**
 * 旋转图片
 */
export const onRotateImage = (that, element, e) => {
  const { data, actions } = that.props;

  const changeMap = {
    0: 90,
    90: 180,
    180: -90,
    '-90': 0
  };

  const { boundProjectActions } = actions;
  const { page, ratio, images } = data;

  const { imgRot, encImgId } = element.toJS();

  const imageDetail = images.get(encImgId);

  const elementWidth = element.getIn(['computed', 'width']);
  const elementHeight = element.getIn(['computed', 'height']);

  const { width, height } = imageDetail.toJS();
  const changeRot = changeMap[imgRot];

  const options = getCropOptions(width, height, elementWidth, elementHeight, changeRot);
  const lrOptions = getCropLRByOptions(options.px, options.py, options.pw, options.ph);

  boundProjectActions.updateElement({
    id: element.get('id'),
    imgRot: changeRot,
    cropLUX: lrOptions.cropLUX,
    cropLUY: lrOptions.cropLUY,
    cropRLX: lrOptions.cropRLX,
    cropRLY: lrOptions.cropRLY
  });
};

/**
 * 图片镜像切换
 */
export const onFlipImage = (that, element, e) => {
  const { actions } = that.props;
  const { boundProjectActions } = actions;
  const imgFlip = element.get('imgFlip');
  boundProjectActions.updateElement({
    id: element.get('id'),
    imgFlip: !imgFlip
  });
};

/**
 * 展开图片到整页
 */
export const onExpandToFullSheet = (that, element, e) => {
  const { data } = that.props;
  const { page } = data;


  // 计算展开后的尺寸.
  const elementWidth = page.get('width');
  const elementHeight = page.get('height');

  // 展开元素到指定的位置和宽高.
  expand(that, element, 0, 0, elementWidth, elementHeight);
};

/**
 * 展开图片到左半页
 */
export const onExpandToLeftPage = (that, element, e) => {
  const { data } = that.props;
  const { page } = data;


  // 计算展开后的尺寸.
  const elementWidth = page.get('width') / 2;
  const elementHeight = page.get('height');

  // 展开元素到指定的位置和宽高.
  expand(that, element, 0, 0, elementWidth, elementHeight);
};

/**
 * 展开图片到右半页
 */
export const onExpandToRightPage = (that, element, e) => {
  const { data } = that.props;
  const { page } = data;

  // 计算展开后的尺寸.
  const elementWidth = page.get('width') / 2;
  const elementHeight = page.get('height');

  // 展开元素到指定的位置和宽高.
  expand(that, element, page.get('width') / 2, 0, elementWidth, elementHeight);
};

export const onFilter = (that, element, e) => {
  const { data, actions } = that.props;
  const { images, page, ratio,env } = data;

  const userInfo = get(env, 'userInfo');
  const timestamp = userInfo ? userInfo.get('timestamp') : '';
  const token  = userInfo ? userInfo.get('authToken') : '';
  const customerId = userInfo ? userInfo.get('id') : -1;

  const info = {
    timestamp,
    token,
    customerId
  };

  const computed = element.get('computed');
  const { boundPropertyModalActions } = actions;
  const imageDetail = images.get(element.get('encImgId')).toJS();
  const filename = imageDetail.name.split('.')[0];
  boundPropertyModalActions.showPropertyModal({
    isShown: true,
    imgWidth: imageDetail.width,
    imgHeight: imageDetail.height,
    element: element.toJS(),
    ratio: ratio.workspace,
    filename,
    userInfo: info,
  });
};

/**
 * 删除图片
 */
export const onRemoveImage = (that, element, e) => {
  const { data, actions } = that.props;
  const { page, summary } = data;
  const { boundProjectActions, boundTrackerActions } = actions;

  if (element.get('type') === elementTypes.photo) {
    const newElement = element.merge({
      encImgId: '',
      imgRot: 0
    });

    boundProjectActions.updateElement(newElement);
    boundTrackerActions.addTracker('DeleteImage');
  } else {
    // boundProjectActions.deleteElement(page.get('id'), element.get('id'));
  }
};

/**
 * 上传图片
 */
export const onUploadImage = (that, element, e) => {
  const { data, actions } = that.props;

  findDOMNode(that.fileUpload).click();
  const { boundImagesActions } = actions;
  const { page } = data;

  const elementWidth = element.get('pw') * page.get('width');
  const elementHeight = element.get('ph') * page.get('height');

  const elementId = element.get('id');
  const imgRot = element.get('imgRot');

  boundImagesActions.autoAddPhotoToCanvas({
    status: true,
    elementId,
    elementWidth,
    elementHeight,
    imgRot
  });
};

export const onBringToFront = (that, element, e) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { elements } = data;
  const nearest = elements.maxBy((item) => {
    return item.get('dep');
  });
  if (element.get('type') === elementTypes.cameo || (nearest && nearest.get('type') === elementTypes.cameo)) {
    return;
  }
  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      dep: nearest.get('dep') + 1
    });
  }
};

export const onSendToback = (that, element, e) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { elements } = data;
  const nearest = elements.minBy((item) => {
    return item.get('dep');
  });
  if (element.get('type') === elementTypes.cameo || (nearest && nearest.get('type') === elementTypes.cameo)) {
    return;
  }
  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      dep: nearest.get('dep') - 1
    });
  }
};

export const onBringForward = (that, element, e) => {
  const { data, actions } = that.props;
  const { elements } = data;
  const { boundProjectActions } = actions;
  // 层级高于当前元素的元素
  const elementsUp = elements.filter((item) => {
    return item.get('dep') > element.get('dep');
  });
  const mixed = findMixed(elementsUp, element);
  const nearest = mixed.minBy((item) => {
    return item.get('dep');
  });
  if (element.get('type') === elementTypes.cameo || (nearest && nearest.get('type') === elementTypes.cameo)) {
    return;
  }
  if (nearest) {
    // 找到层级比相近元素A低但排除掉当前元素的元素
    const elementsDown = elements.filter((item) => {
      return item.get('dep') < nearest.get('dep') && item.get('id') !== element.get('id');
    });
    // 找到上一步找到元素中层级最高的元素
    const minest = elementsDown.maxBy((item) => {
      return item.get('dep');
    });
    // 找到元素A和当前元素之间的元素
    const between = elementsDown.filter((item) => {
      return item.get('dep') > element.get('dep');
    });
    const updateArray = [{
      id: element.get('id'),
      dep: nearest.get('dep')
    }, {
      id: nearest.get('id'),
      dep: element.get('dep')
    }];
    if (between && between.size) {
      let offset = 1;
      elementsUp.forEach((ele) => {
        let dep = ele.get('dep');
        if (dep < element.get('dep')) {
          dep = element.get('dep') - offset;
          offset++;
        } else {
          dep -= between.size;
        }
        updateArray.push({
          id: ele.get('id'),
          dep
        });
      });
    }
    boundProjectActions.updateElements(updateArray);
  }
};

export const onSendBackward = (that, element, e) => {
  const { data, actions } = that.props;
  const { elements } = data;
  const { boundProjectActions } = actions;
  // 层级低于当前元素的元素
  const elementsDown = elements.filter((item) => {
    return item.get('dep') < element.get('dep');
  });
  // 找到层级低于当前元素并且与相交的元素
  const mixed = findMixed(elementsDown, element);
  // 找到相交元素中离当前元素最近的元素A
  const nearest = mixed.maxBy((item) => {
    return item.get('dep');
  });
  if (element.get('type') === elementTypes.cameo || (nearest && nearest.get('type') === elementTypes.cameo)) {
    return;
  }
  if (nearest) {
    // 找到层级比相近元素A高单排除掉当前元素的元素
    const elementsUp = elements.filter((item) => {
      return item.get('dep') > nearest.get('dep') && item.get('id') !== element.get('id');
    });
    // 找到上一步找到元素中层级最低的元素
    const minest = elementsUp.minBy((item) => {
      return item.get('dep');
    });
    // 找到元素A和当前元素之间的元素
    const between = elementsUp.filter((item) => {
      return item.get('dep') < element.get('dep');
    });
    const updateArray = [{
      id: element.get('id'),
      dep: nearest.get('dep')
    }, {
      id: nearest.get('id'),
      dep: element.get('dep')
    }];
    if (between && between.size) {
      let offset = 1;
      elementsUp.forEach((ele) => {
        let dep = ele.get('dep');
        if (dep < element.get('dep')) {
          dep = element.get('dep') + offset;
          offset++;
        } else {
          dep += between.size;
        }
        updateArray.push({
          id: ele.get('id'),
          dep
        });
      });
    }
    boundProjectActions.updateElements(updateArray);
  }
};

export const onEditText = (that, element, operateType = '') => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;
  const { page } = data;
  const isSpine = page.get('type') === pageTypes.spine;
  const { boundTextEditModalActions, boundPaintedTextModalActions } = actions;
  const editTextType = isSpine ? 'OpenSpineTextEditor' : 'OpenCoverTextEditor';
  const operateByType = (operateType === editTextOperateType) ? editTextOperateType : 'onEditByDbClick';
  boundTextEditModalActions.showTextEditModal({
    element,
    updateElements: updatedOptions => updateTextElements(that, updatedOptions)
  });
  boundTrackerActions.addTracker(`${editTextType}`);
};

const findMixed = (elements, element) => {
  let mixed = List([]);
  const source = {
    x: element.get('x'),
    y: element.get('y'),
    width: element.get('width'),
    height: element.get('height')
  };
  elements.forEach((item) => {
    const target = {
      x: item.get('x'),
      y: item.get('y'),
      width: item.get('width'),
      height: item.get('height')
    };
    const isCollapsed = collision(source, target);
    if (item.get('id') !== element.get('id') && isCollapsed) {
      mixed = mixed.push(item);
    }
  });
  return mixed;
};


export function onAlignLeft(that, selectedElementArray) {
  const minXElement = selectedElementArray.minBy((element) => {
    return element.get('x');
  });

  const minX = minXElement.get('x');

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();

  selectedElementArray.forEach((element) => {
    if (element.get('x') !== minX) {
      updateObjectArray = updateObjectArray.push(Immutable.Map({
        id: element.get('id'),
        x: minX
      }));
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onAlignCenter(that, selectedElementArray) {
  const maxWidthElement = selectedElementArray.maxBy((element) => {
    return element.get('width');
  });

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();
  selectedElementArray.forEach((element) => {
    if (element.get('id') !== maxWidthElement.get('id')) {
      const halfMaxWidthX = maxWidthElement.get('x') +
        (maxWidthElement.get('width') / 2);
      const elementX = halfMaxWidthX - (element.get('width') / 2);

      if (element.get('x') !== elementX) {
        const updateObject = Immutable.Map({
          id: element.get('id'),
          x: elementX
        });

        updateObjectArray = updateObjectArray.push(updateObject);
      }
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onAlignRight(that, selectedElementArray) {
  const maxRightXElement = selectedElementArray.maxBy((element) => {
    return element.get('x') + element.get('width');
  });

  const maxRightX = maxRightXElement.get('x') + maxRightXElement.get('width');

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();

  selectedElementArray.forEach((element) => {
    const elementX = maxRightX - element.get('width');
    if (element.get('x') !== elementX) {
      updateObjectArray = updateObjectArray.push(Immutable.Map({
        id: element.get('id'),
        x: elementX
      }));
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onAlignTop(that, selectedElementArray) {
  const minYElement = selectedElementArray.minBy((element) => {
    return element.get('y');
  });

  const minY = minYElement.get('y');

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();

  selectedElementArray.forEach((element) => {
    if (element.get('y') !== minY) {
      updateObjectArray = updateObjectArray.push(Immutable.Map({
        id: element.get('id'),
        y: minY
      }));
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onAlignMiddle(that, selectedElementArray) {
  const maxHeightElement = selectedElementArray.maxBy((element) => {
    return element.get('height');
  });

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();
  selectedElementArray.forEach((element) => {
    if (element.get('id') !== maxHeightElement.get('id')) {
      const halfMaxWidthY = maxHeightElement.get('y') +
        (maxHeightElement.get('height') / 2);
      const elementY = halfMaxWidthY - (element.get('height') / 2);

      if (element.get('y') !== elementY) {
        const updateObject = Immutable.Map({
          id: element.get('id'),
          y: elementY
        });

        updateObjectArray = updateObjectArray.push(updateObject);
      }
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onAlignBottom(that, selectedElementArray) {
  const maxBottomYElement = selectedElementArray.maxBy((element) => {
    return element.get('y') + element.get('height');
  });

  const maxBottomY = maxBottomYElement.get('y') +
    maxBottomYElement.get('height');

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let updateObjectArray = Immutable.List();

  selectedElementArray.forEach((element) => {
    const elementY = maxBottomY - element.get('height');

    if (element.get('y') !== elementY) {
      updateObjectArray = updateObjectArray.push(Immutable.Map({
        id: element.get('id'),
        y: elementY
      }));
    }
  });

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onSpaceHorizontal(that, selectedElementArray) {
  if (selectedElementArray.size < 3) return;

  const sortedSelectedElementArray = selectedElementArray.sort((a, b) => {
    return a.get('x') - b.get('x');
  });

  let totalGutter = 0;
  sortedSelectedElementArray.forEach((element, index) => {
    const prevElementIndex = index - 1;
    if (prevElementIndex >= 0) {
      const prevElement = sortedSelectedElementArray.get(index - 1);
      const gutter = element.get('x') -
        (prevElement.get('x') + prevElement.get('width'));
      totalGutter += gutter;
    }
  });

  const length = sortedSelectedElementArray.size;
  const averageGutter = totalGutter / (length - 1);

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let newSelectedElementArray = Immutable.List();

  sortedSelectedElementArray.forEach((element, index) => {
    if (index === 0 || index === (length - 1)) {
      newSelectedElementArray = newSelectedElementArray.push(null);
    } else {
      const prevElement = sortedSelectedElementArray.get(index - 1);
      const updatedPrevElement = newSelectedElementArray.get(index - 1);
      let updatedPrevElementPositionX = prevElement.get('x');

      if (updatedPrevElement) {
        updatedPrevElementPositionX = updatedPrevElement.get('x');
      }

      const elementX = updatedPrevElementPositionX + prevElement.get('width') +
        averageGutter;

      if (element.get('x').toFixed(12) !== elementX.toFixed(12)) {
        const updateObject = Immutable.Map({
          id: element.get('id'),
          x: elementX
        });

        newSelectedElementArray = newSelectedElementArray.push(
          updateObject
        );
      } else {
        newSelectedElementArray = newSelectedElementArray.push(null);
      }
    }
  });

  const updateObjectArray = newSelectedElementArray.filter(o => o);

  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}

export function onSpaceVertical(that, selectedElementArray) {
  if (selectedElementArray.size < 3) return;

  const sortedSelectedElementArray = selectedElementArray.sort((a, b) => {
    return a.get('y') - b.get('y');
  });

  let totalGutter = 0;
  sortedSelectedElementArray.forEach((element, index) => {
    const prevElementIndex = index - 1;
    if (prevElementIndex >= 0) {
      const prevElement = sortedSelectedElementArray.get(index - 1);
      const gutter = element.get('y') -
        (prevElement.get('y') + prevElement.get('height'));
      totalGutter += gutter;
    }
  });

  const length = sortedSelectedElementArray.size;
  const averageGutter = totalGutter / (length - 1);

  const { actions } = that.props;
  const { boundProjectActions } = actions;

  let newSelectedElementArray = Immutable.List();

  sortedSelectedElementArray.forEach((element, index) => {
    if (index === 0 || index === (length - 1)) {
      newSelectedElementArray = newSelectedElementArray.push(null);
    } else {
      const prevElement = sortedSelectedElementArray.get(index - 1);
      const updatedPrevElement = newSelectedElementArray.get(index - 1);
      let updatedPrevElementPositionY = prevElement.get('y');

      if (updatedPrevElement) {
        updatedPrevElementPositionY = updatedPrevElement.get('y');
      }

      const elementY = updatedPrevElementPositionY + prevElement.get('height') +
        averageGutter;

      if (element.get('y').toFixed(12) !== elementY.toFixed(12)) {
        const updateObject = Immutable.Map({
          id: element.get('id'),
          y: elementY
        });

        newSelectedElementArray = newSelectedElementArray.push(
          updateObject
        );
      } else {
        newSelectedElementArray = newSelectedElementArray.push(null);
      }
    }
  });

  const updateObjectArray = newSelectedElementArray.filter(o => o);
  if (updateObjectArray.size) {
    boundProjectActions.updateElements(updateObjectArray);
  }
}


export function onClearAll(that, selectedElementArray) {
  const { data, actions } = that.props;
  const { page } = data;

  actions.boundProjectActions.deleteElements(
    selectedElementArray.map(o => o.get('id')),
    page.get('id')
  );
}

export const toggleModal = (that, type, status) => {
  const { actions } = that.props;
  const { boundUploadImagesActions } = actions;
  boundUploadImagesActions.toggleUpload(status);
};


export const onSwitchLayout = (that, elementId) => {
  const { data, actions } = that.props;
  const { elementArray } = that.state;

  const element = elementArray.find(obj => obj.get('id') === elementId);

  if (!element) {
    return;
  }

  const { boundProjectActions, boundTrackerActions } = actions;
  const { userId, page, allImages, pagination, project, paginationSpread, ratio } = data;

  const isCover = pagination.sheetIndex === 0;

  const imgRot = element.get('imgRot');
  const encImgId = element.get('encImgId');
  const image = getImage(allImages, encImgId);

  let width = image.get('width');
  let height = image.get('height');

  // 如果图片旋转了，对调宽高
  if (Math.abs(imgRot) === 90) {
    width = image.get('height');
    height = image.get('width');
  }

  const imageInfo = {
    width, height
  };

  const curTemplateId = element.get('templateId') || customeTemplateIds.full;

  const templateId = getSwitchedTemplateId(userId, curTemplateId, imageInfo);

  const pages = paginationSpread.get('pages');
  const spinePage = pages.find(page => page.get('type') === pageTypes.spine);

  const expandingOverFrontcover = project.getIn(['parameterMap', 'spineExpanding', 'expandingOverFrontcover']);
  const coverThickness = project.getIn(['parameterMap', 'coverThickness']);
  const coverType = project.getIn(['setting', 'cover']);

  const options = {
    page, element, imageInfo: image.toJS(), templateId, isCover, spinePage, expandingOverFrontcover, coverThickness, coverType
  };

  const newElement = updateElementByTemplate(options);

  boundProjectActions.updateElement(newElement);

  const isLeft = newElement.px < 0.5;

  const bleed = page.get('bleed');
  const actualBleed = bleed.map(o => Math.floor(o * ratio.workspace));

  let snackBarLeft = newElement.x * ratio.workspace;
  let snackBarWidth = newElement.width * ratio.workspace;

  const bleedLeft = actualBleed.get('left');
  const bleedBottom = actualBleed.get('bottom');

  if (templateId === customeTemplateIds.full) {
    if (isLeft) {
      snackBarLeft += bleedLeft;
    }
    snackBarWidth -= bleedLeft;
  }

  that.setState({
    snackBar: {
      isShown: true,
      left: snackBarLeft,
      bottom: bleedBottom,
      width: snackBarWidth,
      templateId
    }
  });

  // boundTrackerActions.addTracker(`SwitchLayout,${curTemplateId},${templateId}`);
};
