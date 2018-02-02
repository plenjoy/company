import { getTransferData } from '../../../../../common/utils/drag';

export const onDropedExternalFiles = (event, that) => {
  const {
    boundImagesActions,
    boundUploadImagesActions,
    isDisableDragExternalFiles
  } = that.props;
  if (isDisableDragExternalFiles) {
    return;
  }

  if (event.dataTransfer) {
    const files = [...event.dataTransfer.files];
    if (files && files.length) {
      boundImagesActions.addImages(files);
      boundUploadImagesActions.toggleUpload(true);
      // 解决多次拖拽上传弹框不关闭问题
      __app.addMore = true;
    }
  } else {
    // TODO: 当dataTransfer不支持时的错误提示.
  }

  that.setState({
    isShowDropActive: false
  });
};

export const onDragEndExternalFiles = (event, that) => {
  const { isDisableDragExternalFiles } = that.props;
  if (isDisableDragExternalFiles) {
    return;
  }

  // 在firefox上, 访问event.target可能出现access denied的错误.
  try {
    if (event.target.className.indexOf('drop-external-files') !== -1) {
      that.setState({
        isShowDropActive: false
      });
    }
  } catch (err) {
    that.setState({
      isShowDropActive: false
    });
  }
};

export const onDragEnterExternalFiles = (event, that) => {
  const { isDisableDragExternalFiles } = that.props;
  if (isDisableDragExternalFiles) {
    return;
  }

  // 区分是从电脑上拖拽图片还是从app的phototray中拖拽图片.
  // - 从电脑上拖拽图片: types包含Files.
  // - 从app的phototray中拖拽图片: types为string/html等
  let isFromExternal = false;
  if (event.dataTransfer) {
    if (event.dataTransfer.types.indexOf) {
      isFromExternal = event.dataTransfer.types.indexOf('Files') !== -1;
    } else if (event.dataTransfer.types.item) {
      // IE上event.dataTransfer.types的数据结构是: DOMStringList
      // 需要通过.item(index)方法来取值.
      isFromExternal = event.dataTransfer.types.item(0).indexOf('Files') !== -1;
    }
  }

  if (isFromExternal) {
    that.setState({
      isShowDropActive: true
    });
  }
};
