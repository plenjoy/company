import { merge, template } from 'lodash';
import securityString from '../../../../../common/utils/securityString';

import {
  IMAGES_CROPPER,
  IMAGES_CROPPER_PARAMS
} from '../../../constants/apiUrl';

export const onMouseEnter = (that) => {
  const { data } = that.props;
  const { page, ratio } = data;
  const height = page.get('height');
  const width = page.get('width');
  const pageBottom = page.getIn(['bleed', 'bottom']);
  const snackBarTop = Math.ceil((height - pageBottom) * ratio.workspace) - 44;
  const snackBarWidth = Math.ceil(width * ratio.workspace);
  that.setState({
    snackBar: {
      isShown: true,
      left: 0,
      top: snackBarTop,
      width: snackBarWidth,
      templateId: 0,
      zIndex: 200
    }
  });
};

export const onMouseLeave = (that) => {
  const { snackBar } = that.state;
  that.setState({
    snackBar: merge({}, snackBar, { isShown: false })
  });
};


export const toggleModal = (that, type, status) => {
  const { actions } = that.props;
  const { boundUploadImagesActions } = actions;
  boundUploadImagesActions.toggleUpload(status);
};

export const uploadFileClicked = (that) => {
  const { actions, data } = that.props;
  const { boundImagesActions, boundTrackerActions } = actions;
  const { page } = data;
  const element = page.getIn(['elements', '0']);
  if (!element) return;
  // const { useNewUpload } = data;

  // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const timerFunc = () => {
    boundTrackerActions.addTracker('ClickCloudUploadImage');
    // const method = useNewUpload ? 'asynchronous' : 'synchronous';
    // boundTrackerActions.addTracker(`UploadPhotosMethod,${method}`);
    boundImagesActions.autoAddPhotoToCanvas({
      status: true,
      pageId: page.get('id'),
      elementId: element.get('id'),
      elementWidth: 0,
      elementHeight: 0
    });
  };
  that.timer && clearTimeout(that.timer);
  const timer = setTimeout(timerFunc, 30);

  that.timer = timer;
};

export const onReplaceImage = (that) => {
   // 我也不知道为什么会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const {boundTrackerActions } = that.props.actions;
  const timerFunc = () => {
   boundTrackerActions.addTracker('TapReplaceImage');
  }
   that.newtimer && clearTimeout(that.newtimer);
   const newtimer = setTimeout(timerFunc, 30);
   that.newtimer = newtimer;

  that.fileUpload.onClickInput();
  that.uploadFileClicked();
};


/**
 * 编辑图片
 */
export const onSnackBarEditImage = (that) => {
  const { data, actions } = that.props;
  const { boundImageEditModalActions, boundProjectActions,boundTrackerActions } = actions;
  const { images, page, urls } = data;

  const element = page.getIn(['elements', '0']);
  if (!element) return;
  const {
    encImgId,
    imgRot,
    imageid,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY
  } = element.toJS();
  boundTrackerActions.addTracker('TapCropImage');
  const imageDetail = images.get(encImgId);
  if (!imageDetail) return;
  const { width, height, name } = imageDetail.toJS();
  const imageEditApiTemplate = template(IMAGES_CROPPER)({
    baseUrl: urls.baseUrl
  }) + IMAGES_CROPPER_PARAMS;

  console.log('encImgId', encImgId)

  boundImageEditModalActions.showImageEditModal({
    imageEditApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : imageid,
    rotation: imgRot,
    imageWidth: width,
    imageHeight: height,
    imageName: name,
    elementWidth: element.get('width'),
    elementHeight: element.get('height'),
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
