import { get, merge } from 'lodash';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';

import { cameoShapeTypes } from '../../../contants/strings';
import securityString from '../../../../../common/utils/securityString';
export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};

/**
 * 显示天窗的action bar
 * @param  {object} that
 */
export const showCameoActionBar = (that, event) => {
  const ev = event || window.event;
  that.setState({
    isShowActionBar: true
  });
  stopEvent(ev);
};

/**
 * 隐藏天窗的action bar
 * @param  {object} that
 */
export const hideCameoActionBar = (that, event) => {
  const ev = event || window.event;
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
  const { boundProjectActions, boundTrackerActions, boundSystemActions } = actions;
  const { element, paginationSpread } = data;
  // boundTrackerActions.addTracker('ClickCropImage');
  // 计算element的显示宽高.
  const elementWidth = get(element, 'width');
  const elementHeight = get(element, 'height');

  const { computed, encImgId, imgRot, imageid, cropLUX, cropLUY, cropRLX, cropRLY } = element;
  const { images } = paginationSpread;

  const imageDetail = images[encImgId];
  let { width, height, name } = imageDetail;
  if (Math.abs(imgRot) === 90) {
    let tmp = width;
    width = height;
    height = tmp;
  }
  boundSystemActions.showImageEditModal({
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
      const newCrop = merge({}, crop);
      const cropPw = get(crop, 'cropRLX') - get(crop, 'cropLUX');
      const cropPh = get(crop, 'cropRLY') - get(crop, 'cropLUY');
      if (!(cropPw && cropPh)) {
        merge(newCrop, {
          cropLUX: cropLUX - 0,
          cropLUY: cropLUY - 0,
          cropRLX: cropRLX - 0,
          cropRLY: cropRLY - 0
        });
      };
      boundProjectActions.updateElement(merge({}, crop, { imgRot: rotate, id: get(element, 'id') }));
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
    '0': 90,
    '90': 180,
    '180': -90,
    '-90': 0
  };

  const { boundProjectActions, boundTrackerActions } = actions;
  const { element, paginationSpread } = data;

  const { imgRot, encImgId } = element;

  const { images } = paginationSpread;
  const imageDetail = images[encImgId];

  const elementWidth = get(element, 'computed.width');
  const elementHeight = get(element, 'computed.height');

  const { width, height } = imageDetail;
  const changeRot = changeMap[imgRot];

  const options = getCropOptions(width, height, elementWidth, elementHeight, changeRot);
  const lrOptions = getCropLRByOptions(options.px, options.py, options.pw, options.ph);

  // boundTrackerActions.addTracker('ClickRotateImage');
  boundProjectActions.updateElement({
    id: get(element, 'id'),
    imgRot: changeRot,
    cropLUX: lrOptions.cropLUX,
    cropLUY: lrOptions.cropLUY,
    cropRLX: lrOptions.cropRLX,
    cropRLY: lrOptions.cropRLY
  });
  stopEvent(event);
};

/**
 * 天窗action bar的方形图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onRect = (that, event) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { setting } = data;
  if (setting.cameoShape !== cameoShapeTypes.rect) {
    boundProjectActions.changeProjectSetting({
      cameoShape: cameoShapeTypes.rect
    });
  }
  stopEvent(event);
};

/**
 * 天窗action bar的圆形图标的处理函数
 * @param  {object} that CameoElement的this指向
 */
export const onRound = (that, event) => {
  const { data, actions } = that.props;
  const { boundProjectActions } = actions;
  const { setting } = data;
  if (setting.cameoShape !== cameoShapeTypes.round) {
    boundProjectActions.changeProjectSetting({
      cameoShape: cameoShapeTypes.round
    });
  }
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
  if (get(element, 'encImgId')) {
    boundProjectActions.updateElement({
      id: get(element, 'id'),
      encImgId: '',
      imageid: ''
    });
  } else {
    boundProjectActions.deleteElement(get(page, 'id'), get(element, 'id'));
    boundProjectActions.changeProjectSetting({cameoShape: cameoShapeTypes.rect});
  }
  stopEvent(event);
};
