import { merge } from 'lodash';
import { findDOMNode } from 'react-dom';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import {
  elementTypes,
  editTextOperateType,
  shapeTypes,
  productTypes,
  canvasBorderTypes
} from '../../../constants/strings';

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
 * 编辑图片
 */
export const onEditImage = (that, element, e) => {
  const { data, actions } = that.props;
  const { boundImageEditModalActions, boundProjectActions, boundTrackerActions } = actions;
  const { images, elements, ratio, settings, parameters } = data;

  // canvas 的 image 包边需要显示 裁切图片边上被包边的区域；
  const product = settings.get('product');
  const canvasBorder = settings.get('canvasBorder');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  const bleed = parameters.get('bleed');
  const isImageCropCornerShow = product === productTypes.canvas && canvasBorder === canvasBorderTypes.image;
  const imageCornerRatios = isImageCropCornerShow
    ? {
      top: Math.floor((canvasBorderThickness.get('top') + bleed.get('top')) / element.get('height') * 100),
      right: Math.floor((canvasBorderThickness.get('right') + bleed.get('right')) / element.get('width') * 100),
      bottom: Math.floor((canvasBorderThickness.get('bottom') + bleed.get('bottom')) / element.get('height') * 100),
      left: Math.floor((canvasBorderThickness.get('left') + bleed.get('left')) / element.get('width') * 100)
    }
    : null;

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
    elementWidth: eWidth / ratio,
    elementHeight: eHeight / ratio,
    imageCornerRatios,
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

export const toggleModal = (that, type, status) => {
  const { actions } = that.props;
  const { boundUploadImagesActions } = actions;
  boundUploadImagesActions.toggleUpload(status);
};
