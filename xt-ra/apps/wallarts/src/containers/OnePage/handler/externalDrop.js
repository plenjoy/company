import { getTransferData } from '../../../../../common/utils/drag';
let counter = 0; // 引入counter解决enter和leave触发次数不一致的问题

export const onDropedExternalFiles = (event, that) => {
  const { boundImagesActions, boundUploadImagesActions, isDisableDragExternalFiles } = that.props;
  counter = 0;
  that.setState({
    isShowDropActive: false
  });
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
};

export const onDragEndExternalFiles = (event, that) => {
  const { isDisableDragExternalFiles } = that.props;
  counter --;
  if (isDisableDragExternalFiles) {
    return;
  }
  if (event.target && counter === 0) {
    that.setState({
      isShowDropActive: false
    });
  }
};

export const onDragEnterExternalFiles = (event, that) => {
  const { isDisableDragExternalFiles } = that.props;
  counter ++;
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
