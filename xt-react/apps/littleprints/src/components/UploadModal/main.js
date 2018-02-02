import { template, get, set, merge } from 'lodash';

import {
  UPLOAD_BASE,
  GET_IMAGE_IDS,
  UPLOAD_IMAGES,
  IMAGE_SRC,
  AUTH_UPLOAD_IMAGES
} from '../../constants/apiUrl';

import { getDegree } from '../../../../common/utils/exif';
import { limitedPageNum } from '../../constants/strings';
import urlEncode from '../../../../common/utils/urlEncode';
import { PENDING, DONE, PROGRESS, FAIL } from '../../constants/uploadStatus';
import { combine } from '../../utils/url';

// 埋点延时
let timer = null;

// 埋点
const uploadTracker = (that, successUploaded, errorUploaded) => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const { addTracker, project } = that.props;
    const totalUploadedImages = project.imageArray.count();
    const isLeastUploadCounts = totalUploadedImages >= limitedPageNum;

    // 图片全部上传成功时自动关闭上传框的 埋点。成功个数 失败个数
    addTracker(
      `PhotosUploadComplete,${successUploaded},${errorUploaded},${String(
        isLeastUploadCounts
      )}`
    );
  }, 100);
};

const formatImagesObject = (images, param = {}) => {
  const { percent = 0, status = PENDING, retryCount = 0 } = param;

  if (!images || !images.length) {
    return [];
  }

  return images.map(m => {
    m.percent = percent;
    m.status = status;
    m.retryCount = retryCount;

    return m;
  });
};

const updateImagesStatus = (that, image, ops) => {
  const index = that.state.allImages.findIndex(item => {
    return item.guid === image.guid;
  });

  const status = get(that.state.allImages, index);

  if (status) {
    // file对象上自定义属性
    for (const key in ops) {
      if (ops.hasOwnProperty(key)) {
        status[key] = ops[key];
      }
    }

    const allImages = set(that.state.allImages, index, status);
    that.setState({
      allImages
    });
  }
};

const removeSucceed = (that, file) => {
  const { boundUploadedImagesActions } = that.props;
  const { allImages } = that.state;
  const currentIndex = allImages.findIndex(item => {
    return item.guid === file.guid;
  });

  if (currentIndex !== -1) {
    allImages.splice(currentIndex, 1);

    that.setState({
      allImages
    });

    boundUploadedImagesActions.deleteImage(file.guid);
  }
};

const saveFileToStore = (that, file, res) => {
  const { boundUploadedImagesActions, env } = that.props;
  const { instance } = that.state;
  const { checkIsAllCompleted, countOfFailed, countOfCompleted } = instance;

  const fileInfo = {
    name: file.name.replace(/[\&\/\_]+/g, ''),
    guid: file.guid,
    createTime: file.lastModified,
    url: combine(get(env, 'urls.uploadBaseUrl'), IMAGE_SRC, {
      qaulityLevel: 0,
      puid: get(res, 'resultData.img.encImgId')
    }),
    usedCount: 0,
    imageId: get(res, 'resultData.img.id'),
    totalSize: get(res, 'resultData.img.size'),
    uploadTime: new Date().getTime(),
    shotTime: get(res, 'resultData.img.shotTime'),
    encImgId: get(res, 'resultData.img.encImgId'),
    width: get(res, 'resultData.img.width'),
    height: get(res, 'resultData.img.height'),
    orientation: getDegree(get(res, 'resultData.img.exifOrientation')),
    thirdpartyImageId: get(res, 'resultData.img.thirdpartyImageId')
  };

  // 上传时, 如果使用了相同的imageId, 返回值会显示成功, 但是它包含failType.
  const failType = get(res, 'resultData.img.failType');
  if (!failType) {
    boundUploadedImagesActions.uploadComplete(fileInfo).then(() => {
      // 如果上传队列为空并且没有上传失败的
      if (checkIsAllCompleted() && !countOfFailed) {
        uploadTracker(that, countOfCompleted, countOfFailed);
        handleUploadModalClosed(that);
        that.setState({
          allImages: []
        });
      }
    });
  }
};

const doUpload = (that, newImages) => {
  const {
    env,
    project,
    boundUploadedImagesActions,
    boundProjectActions,
    autoAddPhotoToCanvas,
    addTracker,
    t
  } = that.props;
  const instance = that.state.instance;
  const { checkIsAllCompleted } = instance;

  const { userInfo } = env;
  const uid = userInfo.get('id');
  const timestamp = userInfo.get('timestamp');
  const token = userInfo.get('authToken');
  const albumId = env.albumId;
  const projectTitle = project.setting.get('title');

  if (newImages) {
    // 照片选择完毕，开始上传图片埋点
    addTracker(`SelectPhotoComplete`);
    addTracker(`StartUploadPhotos,${newImages.length}`);

    newImages.forEach((file, index) => {
      const isFromAuth = file.isFromAuth;

      const fileName = file.name;
      const fileSize = isFromAuth ? null : `${Math.round(file.size / 1024)}kb`;
      const source = isFromAuth ? file.name.replace(/[\&\/\_]+/g, '') : 'local';
      const startTime = Date.now();

      if (isFromAuth) {
        // 图片开始上传时的埋点.
        addTracker(`StartUploadEachPhoto,${startTime},${source}`);
      } else {
        // 图片开始上传时的埋点.
        addTracker(
          `StartUploadEachPhoto,${startTime},${fileName},${fileSize},${source}`
        );
      }

      let data = {
        uid,
        timestamp,
        token,
        albumId,
        albumName: projectTitle
      };

      if (isFromAuth) {
        data = urlEncode(
          merge({}, data, {
            thirdpartyImageId: file.id,
            imageUrl: file.originalImageUrl,
            platform: file.platform,
            clientSource: 'PC'
          })
        );
      } else {
        data = merge({}, data, {
          Filename: file.name.replace(/[\&\/\_]+/g, ''),
          filename: file
        });
      }

      const reducer = instance.push({
        url: template(UPLOAD_IMAGES)({
          uploadBaseUrl: get(env, 'urls').get('uploadBaseUrl')
        }),
        data,
        authData: isFromAuth ? file : null,
        isFormData: !isFromAuth,
        success: res => {
          updateImagesStatus(that, file, {
            status: res.status,
            percent: res.percent
          });

          const endTime = Date.now();

          if (isFromAuth) {
            // 图片上传完成时的埋点.
            addTracker(`CompleteUploadEachPhoto,${endTime},${res.cost}`);
          } else {
            // 图片上传完成时的埋点.
            addTracker(
              `CompleteUploadEachPhoto,${endTime},${fileName},${fileSize},${
                res.cost
              }`
            );
          }

          // 从上传列表中删除已经成功的项.
          removeSucceed(that, file);

          // 把上传完成的图片保存到store中.
          saveFileToStore(that, file, res);
        },
        progress: res => {
          updateImagesStatus(that, file, {
            status: res.status,
            percent: res.percent
          });
        },
        error: err => {
          const { countOfFailed, countOfCompleted } = that.state.instance;

          const endTime = Date.now();

          updateImagesStatus(that, file, {
            status: err.status,
            percent: err.percent
          });
          // 图片上传失败埋点
          addTracker(
            `FaildedUploadEachPhoto,${endTime},${fileName},${fileSize},${
              err.cost
            }`
          );
          // 当前队列无待上传图片埋点
          if (checkIsAllCompleted()) {
            uploadTracker(that, countOfCompleted, countOfFailed);
          }
        }
      });

      updateImagesStatus(that, file, {
        reducer
      });

      // 上传的文件是不支持的.
      if (!reducer.isAccept) {
        log('reducer', reducer);
      }
    });
  }
};

/**
 * 获取新增的图片列表.
 * @param  {[type]} that      [description]
 * @param  {[type]} nextProps [description]
 * @return {[type]}           [description]
 */
const filterNewAddImages = (that, nextProps) => {
  const newImages = nextProps.uploadingImages;
  const allImagesInStatus = that.state.allImages;

  const results = newImages.filter(m => {
    return !allImagesInStatus.find(image => image.guid === m.file.guid);
  });

  return results.map(r => r.file);
};

const preparePendingImages = (that, uploadedImages, addedImages) => {
  const { autoAddPhotoToCanvas } = that.props;
  const { instance } = that.state;
  const { countOfProgress, countOfPending } = instance;
  const total =
    uploadedImages.size + addedImages.length + countOfProgress + countOfPending;

  const autoAddPhotoToCanvasStatus = autoAddPhotoToCanvas && autoAddPhotoToCanvas.status;
  const isShowOverImageAttention = total > limitedPageNum && !autoAddPhotoToCanvasStatus;
  let images = [];

  if (isShowOverImageAttention) {
    const removedCount = total - limitedPageNum;

    // 加一个"-"号, 从右侧开始删除.
    const removedImages = addedImages.splice(-removedCount);
    images = addedImages;

    // 从UI上删除选项.
    removedImages.forEach(image => {
      that.props.boundUploadedImagesActions.deleteImage(image.guid);
    });
  } else {
    images = addedImages;
  }

  return { isShowOverImageAttention, images, total };
};

export const handleUploadModalClosed = (that, isManuClick) => {
  const {
    toggleModal,
    t,
    addTracker,
    autoFill,
    boundUploadedImagesActions,
    boundConfirmModalActions,
    autoAddPhotoToCanvas
  } = that.props;
  const { instance } = that.state;
  const { checkIsAllCompleted, completedFiles } = instance;
  // 获取这次上传的照片列表.
  const newUploadedFiles = completedFiles;
  const autoAddPhotoToCanvasStatus = autoAddPhotoToCanvas && autoAddPhotoToCanvas.status;

  // 获取所有照片的列表.
  const uploadedImages = that.props.project.imageArray;
  const reset = () => {
    instance.reset();

    boundUploadedImagesActions.clearAllImages();

    that.setState({
      allImages: []
    });
  };

  const closeUploadedImagesModal = () => {
    // 当项目图片大于24的时候才关闭
    if (uploadedImages.count() >= limitedPageNum || isManuClick || autoAddPhotoToCanvasStatus) {
      toggleModal('upload', false);
      const newUploadedImages = uploadedImages.filter(
        m => !!newUploadedFiles.find(k => k.guid === m.get('guid'))
      );

      // 执行autofill
      autoFill(newUploadedImages.toJS());
      reset();
      boundConfirmModalActions.hideConfirm()
    }
  };

  if (!checkIsAllCompleted()) {
    boundConfirmModalActions.showConfirm({
      activeButton: 'cancel',
      confirmTitle: '',
      confirmMessage: t('CLOSE_PROMPT'),
      onOkClick: () => {
        return false;
      },
      onCancelClick: () => {
        closeUploadedImagesModal();
      },
      xCloseFun: () => {
        return false;
      },
      okButtonText: 'Cancel',
      cancelButtonText: 'Continue'
    });
  } else {
    closeUploadedImagesModal();
  }
};

export const receiveProps = (that, nextProps) => {
  // 获取新增的图片列表.
  const addImages = filterNewAddImages(that, nextProps);

  if (addImages && addImages.length) {
    // 获取所有照片的列表.
    const uploadedImages = that.props.project.imageArray;

    // 判断是否要显示超过最大照片数的提示.已上传的照片数和已选择的照片数.
    const { isShowOverImageAttention, images, total } = preparePendingImages(
      that,
      uploadedImages,
      addImages
    );

    that.setState(
      {
        // 判断是否要显示超过最大照片数的提示.已上传的照片数和已选择的照片数.
        total,
        isShowOverImageAttention,
        allImages: that.state.allImages.concat(formatImagesObject(images))
      },
      () => {
        doUpload(that, images);
      }
    );
  }
};

export const retryImage = (that, guid) => {
  const { instance } = that.state;
  const { failedPools } = instance;
  const reducer = failedPools.find(m => {
    return m.file.guid === guid;
  });
  if (reducer) {
    instance.retry(reducer);
  }
};

export const handleDelete = (that, guid) => {
  const { instance } = that.state;
  const { pendingPools, failedPools, checkIsAllCompleted } = instance;
  const reducer = pendingPools.concat(failedPools).find(m => {
    return m.file.guid === guid;
  });
  if (reducer) {
    // 终止上传.
    instance.remove(reducer);

    // 从UI中删除.
    removeSucceed(that, reducer.file);
  }

  // 如果所有都上传完成并且没有失败的, 那就直接关闭弹窗.
  if (checkIsAllCompleted() && !instance.countOfFailed) {
    handleUploadModalClosed(that);
  }

  // 删除一个文件后, 隐藏提示.
  that.setState({ isShowOverImageAttention: false });
};

export const onUploadMoreClick = that => {
  that.setState({
    addMore: true
  });
};