import { merge } from 'lodash';
import securityString from '../../../../../common/utils/securityString';
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

/**
 * 获取天窗背景图的路径
 * @param  {string} cameoShape 天窗的形状.
 */
export const getCameoBackgroundImage = (that, cameoShape) => {
  const { materials } = that.props;
  let image = '';
  if (cameoShape === cameoShapeTypes.rect) {
    image = materials.getIn(['originalMaterials', 'cameo', 'rect']);
  } else {
    image = materials.getIn(['originalMaterials', 'cameo', 'round']);
  }

  return image;
};
export const Ellipse = (context, x, y, a, b) => {
  const step = a > b ? 1 / a : 1 / b;
  context.beginPath();
  context.moveTo(x + a, y);
  for (let i = 0; i < 2 * Math.PI; i += step) {
    context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
  }
  context.closePath();
};

export const handleDragOver = (that, event) => {
  stopEvent(event);
};

/**
 * 天窗drop处理函数
 * @param   {object} that CameoElement的this指向
 */
export const onDrop = (that, event) => {
  const { data, actions } = that.props;

  const { element, page, ratio } = data;
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
export const toggleActionBar = (that, event) => {
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
export const showActionBar = (that, event) => {
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
export const hideActionBar = (that, event) => {
  const ev = event || window.event;
  ev.stopPropagation();

  that.setState({
    isShowActionBar: false
  });
};

/**
 * 天窗action bar的图片裁剪的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onCrop = (that) => {
  const { data, actions } = that.props;
  const {
    boundImageEditModalActions,
    boundProjectActions,
    boundTrackerActions
  } = actions;
  const { element, page, ratio, paginationSpread } = data;
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
    securityString,
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
export const onRotate = (that, event) => {
  const { data, actions } = that.props;
  const changeMap = {
    0: 90,
    90: 180,
    180: -90,
    '-90': 0
  };

  const { boundProjectActions, boundTrackerActions } = actions;
  const { element, page, ratio, paginationSpread } = data;

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
export const onFlip = (that, event) => {
  const { data, actions } = that.props;
  const { element } = data;
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
export const onRect = (that, event) => {
  const { data, actions } = that.props;
  const { element, parameters } = data;
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
export const onRound = (that, event) => {
  const { data, actions } = that.props;
  const { element, setting } = data;
  const availableOptionMap = projectParser.getAvailableOptionMap(
    setting,
    configurableOptionArray,
    allOptionMap
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
const updateElementBySize = (that, event) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { element, parameters, size, paginationSpread } = data;
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
export const onSmall = (that, event) => {
  const { data, actions } = that.props;
  const { element, parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.small
    })
    .then(() => {
      updateElementBySize(that);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的中尺寸图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onMedium = (that, event) => {
  const { data, actions } = that.props;
  const { element, parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.middle
    })
    .then(() => {
      updateElementBySize(that);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的大尺寸图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onLarge = (that, event) => {
  const { data, actions } = that.props;
  const { element, parameters } = data;
  const { boundProjectActions } = actions;
  boundProjectActions
    .changeProjectSetting({
      cameo: cameoSizeTypes.large
    })
    .then(() => {
      updateElementBySize(that);
    });
  stopEvent(event);
};

/**
 * 天窗action bar的删除天窗的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onClear = (that, event) => {
  const { data, actions } = that.props;
  const { element, page } = data;
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
    boundProjectActions.deleteElement(page.get('id'), element.get('id'));
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
