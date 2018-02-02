export const toggleModal = (that, type, status) => {
  const { boundUploadImagesActions } = that.props;
  boundUploadImagesActions.toggleUpload(status);
};

export const uploadFileClicked = (that) => {
  const { boundImagesActions, boundTrackerActions } = that.props;
  // const { useNewUpload } = data;

  // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const timerFunc = () => {
    boundTrackerActions.addTracker('ClickCloudUploadImage');
    // const method = useNewUpload ? 'asynchronous' : 'synchronous';
    // boundTrackerActions.addTracker(`UploadPhotosMethod,${method}`);
    boundImagesActions.autoAddPhotoToCanvas({
      status: false,
      elementId: '',
      elementWidth: 0,
      elementHeight: 0
    });
  };
  that.timer && clearTimeout(that.timer);
  const timer = setTimeout(timerFunc, 30);

  that.timer = timer;
};

export const onAddPhotos = (that) => {
  that.fileUpload.onClickInput();
  that.uploadFileClicked();
};
