import { isNumber } from 'lodash';
import { onSortImages } from '../../../../common/utils/sort';

export const getSortOptions = (t) => {
  return [
    {
      label: t('DATE_TOKEN_O_T_N'),
      value: '>-shotTime'
    },
    {
      label: t('DATE_TOKEN_N_T_O'),
      value: '<-shotTime'
    },
    {
      label: t('UPLOAD_TIME_O_T_N'),
      value: '>-uploadTime'
    },
    {
      label: t('UPLOAD_TIME_N_T_O'),
      value: '<-uploadTime'
    },
    {
      label: t('TITLE_A_Z'),
      value: '>-name'
    },
    {
      label: t('TITLE_Z_A'),
      value: '<-name'
    },
  ];
};

export const onToggleHideUsed = (that) => {
  const { actions, data } = that.props;
  const { boundTrackerActions } = actions;
  const { uploadedImages, copyUploadedImages } = that.state;
  const isHideUseChecked = !that.state.isHideUseChecked;
  if (isHideUseChecked) {
    const newImages = uploadedImages.filter((item) => {
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

export const sortImages = (uploadedImages, param) => {
  const { value } = param;

  const valueArr = value.split('-');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];

  // 判断是否升序.
  const asc = diffTag === '>';
  return onSortImages(uploadedImages, realValue, asc);
};

export const onSorted = (that, param) => {
  const { actions } = that.props;
  const { boundTrackerActions } = actions;

  const uploadedImages = sortImages(that.state.uploadedImages || [], param);

  // 用户点击 图片排序操作的 埋点  asc 升序， dsc 降序;
  const { value } = param;
  const valueArr = value.split('-');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];
  const trackerMessage = diffTag === '<' ? `${realValue}Dsc` : `${realValue}Asc`;

  if (that.state.isHideUseChecked) {
    const nonUsedImages = uploadedImages.filter((item) => {
      return item.usedCount === 0;
    });
    that.setState({
      uploadedImages: nonUsedImages,
      currentOption: param
    }, () => {
      boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
    });
  } else {
    that.setState({
      uploadedImages,
      currentOption: param
    }, () => {
      boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`);
    });
  }
};

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
      elementWidth: 0,
      elementHeight: 0
    });
  };
  that.timer && clearTimeout(that.timer);
  const timer = setTimeout(timerFunc, 30);

  that.timer = timer;
};

/**
 * 设置图片的使用次数.
 * @param imageArr 图片数组
 * @param imageUsedCountMap 包含使用次数的对象.
 */
export const checkUsageCount = (imageArr, imageUsedCountMap) => {
  if (imageArr && imageArr.length) {
    imageArr.forEach((v) => {
      const count = imageUsedCountMap && imageUsedCountMap[v.encImgId] ? imageUsedCountMap[v.encImgId] : 0;
      v.usedCount = count;
    });
  }

  return imageArr;
};

export const tipClick = (that) => {
  that.fileUpload.onClickInput();
  that.uploadFileClicked();
};
