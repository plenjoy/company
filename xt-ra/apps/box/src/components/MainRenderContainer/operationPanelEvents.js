import { get, merge } from 'lodash';
import { elementTypes } from '../../contants/strings';
import { getCropOptions, getCropLRByOptions } from '../../utils/crop';
import { ClickCropImage, ClickRotateImage, ClickRemoveImage } from '../../contants/trackerConfig';
import securityString from '../../../../common/utils/securityString';

/**
 * 裁剪图片的处理函数
 * @param ev
 */
export const onCropImage = (that) => {
  const { boundImageEditModalActions, boundProjectActions, boundSystemActions, rate, paginationSpread, boundTrackerActions } = that.props;
  const { images } = paginationSpread;
  const element = that.state.activeElement;
  // const element = this.state.activeElement;

  // 计算element的显示宽高.
  const elementWidth = get(element, 'width');
  const elementHeight = get(element, 'height');


  let { computed, encImgId, imgRot, imageid, cropLUX, cropLUY, cropRLX, cropRLY, type } = element;
  const eWidth = computed.width;
  const eHeight = computed.height;
  const imageDetail = get(images, encImgId);
  const { width, height, name } = imageDetail;
  const isDVDElement = type === elementTypes.dvd;

  // 如果元素宽高还没更新
  if (Math.round(elementWidth * rate) !==eWidth || Math.round(elementHeight * rate) !== eHeight) {
    const options = getCropOptions(width, height, eWidth, eHeight, imgRot);
    cropLUX = options.cropLUX;
    cropLUY = options.cropLUY;
    cropRLX = options.cropRLX;
    cropRLY = options.cropRLY;
  }

  boundSystemActions.showImageEditModal({
    imageEditApiTemplate: computed.corpApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : parseInt(imageid),
    rotation: parseInt(imgRot),
    imageWidth: parseInt(width),
    imageHeight: parseInt(height),
    imageName: name,
    elementWidth: parseInt(eWidth / rate),
    elementHeight: parseInt(eHeight / rate),
    isShowDvdCropCover: isDVDElement,
    crop: {
      cropLUX: cropLUX - 0,
      cropLUY: cropLUY - 0,
      cropRLX: cropRLX - 0,
      cropRLY: cropRLY - 0
    },
    onDoneClick: (encImgId, crop, rotate) => {
      // 修改点击 crop 区域之外的地方会出现切图宽高为 0 的 bug;
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
      boundProjectActions.updateElement(merge({}, newCrop, { imgRot: rotate, id: get(element, 'id') }));
    }
  });
  boundTrackerActions.addTracker(ClickCropImage);
};

/**
 * 旋转图片
 */
export const onRotateImage = (that) => {
  const { boundProjectActions, paginationSpread, boundTrackerActions } = that.props;
  const { images } = paginationSpread;
  const element = that.state.activeElement;

  const changeMap = {
    '0': 90,
    '90': 180,
    '180': -90,
    '-90': 0
  };

  const { imgRot, encImgId } = element;

  const imageDetail = get(images, encImgId);

  const elementWidth = get(element, 'computed.width');
  const elementHeight = get(element, 'computed.height');

  const { width, height } = imageDetail;
  const changeRot = changeMap[imgRot];

  const options = getCropOptions(width, height, elementWidth, elementHeight, changeRot);
  const lrOptions = getCropLRByOptions(options.px, options.py, options.pw, options.ph);

  boundProjectActions.updateElement({
    id: get(element, 'id'),
    imgRot: changeRot,
    cropLUX: lrOptions.cropLUX,
    cropLUY: lrOptions.cropLUY,
    cropRLX: lrOptions.cropRLX,
    cropRLY: lrOptions.cropRLY
  });
  boundTrackerActions.addTracker(ClickRotateImage);
};

/**
 * 删除图片
 */
export const onRemoveImage = (that, e) => {
  const { boundProjectActions, paginationSpread, boundTrackerActions } = that.props;
  const { images } = paginationSpread;
  const element = that.state.activeElement;

  if (get(element, 'type') === elementTypes.photo || get(element, 'type') === elementTypes.dvd) {
    if (get(element, 'encImgId')) {
      boundProjectActions.updateElement({
        id: get(element, 'id'),
        encImgId: '',
        imageid: '',
        cropLUX: 0,
        cropLUY: 0,
        cropRLX: 0,
        cropRLY: 0,
        imgRot: 0
      });
      boundTrackerActions.addTracker(ClickRemoveImage);
    } else {
      boundProjectActions.deleteElement(get(page, 'id'), get(element, 'id'));
    }
  } else {
    boundProjectActions.deleteElement(get(page, 'id'), get(element, 'id'));
  }

  // that.hideActionBar(that);
};


