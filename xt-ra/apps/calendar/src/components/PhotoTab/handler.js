import { isNumber } from 'lodash';
export const onToggleHideUsed = (that) => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;
  const { uploadedImages, copyUploadedImages } = that.state;
  const isHideUseChecked = !that.state.isHideUseChecked;
  if (isHideUseChecked) {
    const newImages = uploadedImages.filter(item=> {
      return item.usedCount === 0;
    });
    that.setState({
      uploadedImages: newImages,
      isHideUseChecked
    }, () => {
      boundTrackerActions.addTracker('ChangeHideUsed,on');
    });
  } else {
    that.setState({
      uploadedImages: copyUploadedImages,
      isHideUseChecked
    }, () => {
      boundTrackerActions.addTracker('ChangeHideUsed,off');
    });
  }
};


export const onSorted = (that, param) => {
  const { actions } = that.props;
  const { boundTrackerActions } = actions;
  const { copyUploadedImages } = that.state;
  let uploadedImages = that.state.uploadedImages;
  const { value } = param;

  const valueArr = value.split(',');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];

  // 用户点击 图片排序操作的 埋点  asc 升序， dsc 降序;
  const trackerMessage = diffTag === '<' ? realValue + 'Dsc' : realValue + 'Asc';

  uploadedImages.sort((a, b) => {
    switch (diffTag) {
      case '<' : {
        if (realValue === 'name') {
          return (b[realValue]).localeCompare(a[realValue]);
        } else {
          return b[realValue] - a[realValue];
        }
      }
      default : {
        if (realValue === 'name') {
          return (a[realValue]).localeCompare(b[realValue]);
        } else {
          return a[realValue] - b[realValue];
        }
      }
    }
  });

  if (that.state.isHideUseChecked) {
    const nonUsedImages = uploadedImages.filter(item=> {
      return item.usedCount === 0;
    });
    that.setState({
      uploadedImages: nonUsedImages,
      sortValue: value
    }, () => {
      boundTrackerActions.addTracker('ChangeSort,' + trackerMessage);
    });
  } else {
    that.setState({
      uploadedImages: uploadedImages,
      sortValue: value
    }, () => {
      boundTrackerActions.addTracker('ChangeSort,' + trackerMessage);
    });
  }
}


export const uploadFileClicked = (that) => {
  const { actions } = that.props;
  const { boundImagesActions, boundTrackerActions } = actions;
  // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
  // 隔时延迟处理来消除过多的被执行。
  const timerFunc = () => {
    boundTrackerActions.addTracker('ClickAddPhotos');
    boundImagesActions.autoAddPhotoToCanvas({
      status: false,
      elementId: '',
      elementWidth : 0,
      elementHeight : 0
    });
  };
  that.timer && clearTimeout(that.timer);
  let timer = setTimeout(timerFunc, 30);
  that.timer = timer;
};
