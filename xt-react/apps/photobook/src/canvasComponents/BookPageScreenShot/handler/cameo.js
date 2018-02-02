import { merge, get } from 'lodash';

import projectParser from '../../../../../common/utils/projectParser';
import { cameoShapeTypes, cameoSizeTypes } from '../../../contants/strings';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { computedCameoElementOptions } from '../../../utils/cameo';
import { getTransferData } from '../../../../../common/utils/drag';
import {
  configurableOptionArray,
  allOptionMap,
  variableArray
} from '../../../reducers/project/projectReducer';

export const handleDragOver = (that, element, event) => {
  stopEvent(event);
};

/**
 * 天窗drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, element, event) => {
  const { data, actions } = that.props;

  const { page, ratio } = data;
  const { boundProjectActions } = actions;

  const imgRot = 0;

  const elementWidth = element.get('pw') * page.get('width') * ratio.workspace;
  const elementHeight =
    element.get('ph') * page.get('height') * ratio.workspace;

  const ev = event || window.event;

  const elementProps = getTransferData(event);
  const { width, height } = elementProps[0];
  const elementId = element.get('id');

  const options = getCropOptions(
    width,
    height,
    elementWidth,
    elementHeight,
    imgRot
  );
  const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
  const elementData = merge(
    {},
    {
      id: elementId,
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY,
      imgRot,
      encImgId: elementProps[0].encImgId,
      imageid: elementProps[0].imageid
    }
  );
  boundProjectActions.updateElement(elementData);
  stopEvent(ev);
};

/**
 * 显示或隐藏天窗的action bar
 * @param  {object} that
 */
export const toggleActionBar = (that, element, event) => {
  const ev = event || window.event;
  ev.stopPropagation();

  that.setState({
    isShowActionBar: !that.state.isShowActionBar
  });
};

/**
 * 显示天窗的action bar
 * @param  {object} that
 */
export const showActionBar = (that, element, event) => {
  const ev = event || window.event;
  ev.stopPropagation();

  that.setState({
    isShowActionBar: true
  });
};

/**
 * 隐藏天窗的action bar
 * @param  {object} that
 */
export const hideActionBar = (that, element, event) => {
  const ev = event || window.event;
  ev.stopPropagation();
};

/**
 * 天窗action bar的图片裁剪的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onCrop = (that, element) => {
  const { data, actions } = that.props;
  const {
    boundImageEditModalActions,
    boundProjectActions,
    boundTrackerActions
  } = actions;
  const { page, ratio, paginationSpread } = data;
  boundTrackerActions.addTracker('ClickCropImage');
  // 计算element的显示宽高.
  const elementWidth = element.get('width');
  const elementHeight = element.get('height');

  const {
    computed,
    encImgId,
    imgRot,
    imageid,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY
  } = element.toJS();
  const { images } = paginationSpread.toJS();

  const imageDetail = images[encImgId];
  let { width, height, name } = imageDetail;
  if (Math.abs(imgRot) === 90) {
    const tmp = width;
    width = height;
    height = tmp;
  }
  boundImageEditModalActions.showImageEditModal({
    imageEditApiTemplate: computed.corpApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : imageid,
    rotation: imgRot,
    imageWidth: width,
    imageHeight: height,
    imageName: name,
    elementWidth,
    elementHeight,
    crop: {
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    },
    onDoneClick: (encImgId, crop, rotate) => {
      boundProjectActions.updateElement(
        merge({}, crop, { imgRot: rotate, id: element.get('id') })
      );
    }
  });
};

/**
 * 天窗action bar的图片旋转的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onRotate = (that, element, event) => {
  const { data, actions } = that.props;
  const changeMap = {
    0: 90,
    90: 180,
    180: -90,
    '-90': 0
  };

  const { boundProjectActions, boundTrackerActions } = actions;
  const { page, ratio, paginationSpread } = data;

  const { imgRot, encImgId } = element.toJS();

  const { images } = paginationSpread.toJS();
  const imageDetail = images[encImgId];

  const elementWidth = element.get('pw') * page.get('width') * ratio.workspace;
  const elementHeight =
    element.get('ph') * page.get('height') * ratio.workspace;

  const { width, height } = imageDetail;
  const changeRot = changeMap[imgRot];

  const options = getCropOptions(
    width,
    height,
    elementWidth,
    elementHeight,
    changeRot
  );
  const lrOptions = getCropLRByOptions(
    options.px,
    options.py,
    options.pw,
    options.ph
  );

  boundTrackerActions.addTracker('ClickRotateImage');
  boundProjectActions.updateElement({
    id: element.get('id'),
    imgRot: changeRot,
    cropLUX: lrOptions.cropLUX,
    cropLUY: lrOptions.cropLUY,
    cropRLX: lrOptions.cropRLX,
    cropRLY: lrOptions.cropRLY
  });
  stopEvent(event);
};

/**
 * 天窗action bar的图片镜像旋转的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onFlip = (that, element, event) => {
  const { data, actions } = that.props;
  const { boundProjectActions, boundTrackerActions } = actions;
  const imgFlip = element.get('imgFlip');
  boundTrackerActions.addTracker('ClickFlipImage');
  boundProjectActions.updateElement({
    id: element.get('id'),
    imgFlip: !imgFlip
  });
  stopEvent(event);
};

/**
 * 天窗action bar的方形图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onRect = (that, element, event) => {
  const { data, actions } = that.props;
  const { parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameoShape: cameoShapeTypes.rect
    })
    .then(() => {
      // console.log('parameters', parameters.toJS());
    });
  stopEvent(event);
};

/**
 * 天窗action bar的圆形图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onRound = (that, element, event) => {
  const { data, actions } = that.props;
  const { settings, specData } = data;
  const setting = get(settings, 'spec');

  const configurableOptionArray = get(specData, 'configurableOptionArray');
  const allOptionMap = get(specData, 'allOptionMap');
  const variableArray = get(specData, 'variableArray');
  const disableOptionArray = get(specData, 'disableOptionArray');

  const availableOptionMap = projectParser.getAvailableOptionMap(
    setting,
    configurableOptionArray,
    allOptionMap,
    disableOptionArray
  );
  const availCameoShapeTypes = availableOptionMap.cameoShape;

  // 更新值为round还是oval
  const updateValue = isInTypes(cameoShapeTypes.round, availCameoShapeTypes)
    ? cameoShapeTypes.round
    : cameoShapeTypes.oval;
  const { boundProjectActions } = actions;
  boundProjectActions.changeProjectSetting({
    cameoShape: updateValue
  });
  stopEvent(event);
};

/**
 * 根据选择的cameo size更新element参数
 */
const updateElementBySize = (that, element, event) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { parameters, size, paginationSpread } = data;
  const summary = paginationSpread.get('summary');
  const cameoSize = parameters.get('cameoSize');
  const cameoBleed = parameters.get('cameoBleed');
  // 计算新的天窗的基本属性: { x, y, px, py, pw, ph }
  const options = computedCameoElementOptions(
    size.coverSpreadSize,
    cameoSize,
    cameoBleed,
    size.spineSize
  );
  const elementOptions = merge({}, options, {
    id: element.get('id'),
    width:
      cameoSize.get('width') + cameoBleed.get('left') + cameoBleed.get('right'),
    height:
      cameoSize.get('height') + cameoBleed.get('top') + cameoBleed.get('bottom')
  });
  boundProjectActions.updateElement(elementOptions);
};

/**
 * 天窗action bar的小尺寸图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onSmall = (that, element, event) => {
  const { data, actions } = that.props;
  const { parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.small
    })
    .then(() => {
      updateElementBySize(that, element);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的中尺寸图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onMedium = (that, element, event) => {
  const { data, actions } = that.props;
  const { parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.middle
    })
    .then(() => {
      updateElementBySize(that, element);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的大尺寸图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onLarge = (that, element, event) => {
  const { data, actions } = that.props;
  const { parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.large
    })
    .then(() => {
      updateElementBySize(that, element);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的删除天窗的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onClear = (that, element, event) => {
  const { data, actions } = that.props;
  const { page } = data;
  const { boundProjectActions } = actions;
  if (element.get('encImgId')) {
    // has image then remove image props
    boundProjectActions.updateElement({
      id: element.get('id'),
      encImgId: '',
      imageid: ''
    });
  } else {
    // remove element
    boundProjectActions.deleteElement(element.get('id'));
  }
  stopEvent(event);
};

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

export const isInTypes = (type, availTypes) => {
  const index = availTypes.findIndex((item) => {
    return item.id === type;
  });
  return index >= 0;
};

export const handleCameoImageLoaded = (that) => {
  const { actions } = that.props;
  that.hideLoading();
};

export const getOffset = (el) => {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};
