import { merge, template } from 'lodash';
import {
  IMAGES_CROPPER,
  IMAGES_CROPPER_PARAMS
} from '../../../constants/apiUrl';
import {
  elementTypes,
  productTypes,
  canvasBorderTypes,
  enumPhotoQuantity,
  shapeTypes
} from '../../../constants/strings';
import securityString from '../../../../../common/utils/securityString';

/**
 * 编辑图片
 */
export const onEditImage = (that, element, e) => {
  const { data, actions } = that.props;
  const {
    boundImageEditModalActions,
    boundProjectActions,
    boundTrackerActions
  } = actions;
  const { ratios, paginationSpread, settings, parameters, urls } = data;
  const ratio = ratios.get('workspace');
  const images = paginationSpread.get('images');

  const product = settings.get('product');
  const canvasBorder = settings.get('canvasBorder');
  const canvasBorderThickness = parameters.get('canvasBorderThickness');
  const orientation = settings.get('orientation');
  const bleed = parameters.get('bleed');
  const isImageCropCornerShow =
    product === productTypes.canvas && canvasBorder === canvasBorderTypes.image;
  const imageCornerRatios = isImageCropCornerShow
    ? {
        top: Math.floor(
          (canvasBorderThickness.get('top') + bleed.get('top')) /
            element.get('height') *
            100
        ),
        right: Math.floor(
          (canvasBorderThickness.get('right') + bleed.get('right')) /
            element.get('width') *
            100
        ),
        bottom: Math.floor(
          (canvasBorderThickness.get('bottom') + bleed.get('bottom')) /
            element.get('height') *
            100
        ),
        left: Math.floor(
          (canvasBorderThickness.get('left') + bleed.get('left')) /
            element.get('width') *
            100
        )
      }
    : null;

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

  const eWidth = element.get('width');
  const eHeight = element.get('height');

  const imageDetail = images.get(encImgId);
  const { width, height, name } = imageDetail.toJS();

  const landscapeOrPortrait =
    width === height
      ? shapeTypes.S
      : width > height ? shapeTypes.L : shapeTypes.P;
  const frameOrientation =
    orientation === 'Landscape' ? 'FrameLandscape' : 'FramePortrait';
  boundTrackerActions.addTracker(
    `ClickEdit,${landscapeOrPortrait},${frameOrientation}`
  );
  const imageEditApiTemplate =
    template(IMAGES_CROPPER)({
      baseUrl: urls.baseUrl
    }) + IMAGES_CROPPER_PARAMS;

  boundImageEditModalActions.showImageEditModal({
    imageEditApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : imageid,
    rotation: imgRot,
    imageWidth: width,
    imageHeight: height,
    imageName: name,
    elementWidth: eWidth,
    elementHeight: eHeight,
    imageCornerRatios,
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
 * 删除图片
 */
export const onRemoveImage = (that, element, e) => {
  const { data, actions } = that.props;
  const { boundProjectActions, boundTrackerActions } = actions;

  if (element.get('type') === elementTypes.photo) {
    const newElement = element.merge({
      encImgId: '',
      imgRot: 0,
      imageid: ''
    });

    boundProjectActions.updateElement(newElement);
    boundTrackerActions.addTracker('DeleteImage');
  } else {
    // boundProjectActions.deleteElement(page.get('id'), element.get('id'));
  }
};

export const toggleModal = (that, type, status) => {
  const { actions } = that.props;
  const { boundUploadImagesActions } = actions;
  boundUploadImagesActions.toggleUpload(status);
};

export const uploadFileClicked = (that, element) => {
  const { actions, data } = that.props;
  const { boundImagesActions, boundTrackerActions } = actions;
  const { settings } = data;
  const orientation = settings.get('orientation');
  const photoQuantity = settings.get('photoQuantity');
  // const { useNewUpload } = data;

  // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const timerFunc = () => {
    boundTrackerActions.addTracker('ClickCloudUploadImage');
    // const method = useNewUpload ? 'asynchronous' : 'synchronous';
    // boundTrackerActions.addTracker(`UploadPhotosMethod,${method}`);
    boundImagesActions.autoAddPhotoToCanvas({
      status: true,
      elementId: element.get('id'),
      projectOrientation: orientation,
      shouldAutoChangeOrientation: photoQuantity === enumPhotoQuantity.one
    });
  };
  that.timer && clearTimeout(that.timer);
  const timer = setTimeout(timerFunc, 30);

  that.timer = timer;
};

export const onCloudClick = (that, element) => {
  that.fileUpload.onClickInput();
  that.uploadFileClicked(element);
};
