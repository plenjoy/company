import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { zIndex, oAuthTypes } from '../../constants/strings';
import OAuth from '../../../../common/utils/OAuth';
import XLoadingModal from '../../../../common/ZNOComponents/XLoadingModal';
import XModal from '../../../../common/ZNOComponents/XModal';
import FontCalculator from '../FontCalculator';

import './index.scss';

class OAuthLoading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalCount: 100,
      currentCount: 0,
      photoArray: [],
      photoArrayCaptionSizeMap: {},
      canLoadingMainPage: false
    };
  }

  componentDidMount() {
    // 准备获取项目图片
    this.perpareProjectData();
  }

  render() {
    const { t, isShown, data } = this.props;
    const { totalCount, currentCount, photoArray } = this.state;
    const { fontCalculator } = data;

    return (
      <XLoadingModal
        className="OAuthLoading"
        offsetTop={38}
        isHideIcon
        opened={isShown}
        total={totalCount}
        current={currentCount}
      >
        {t('PREPARING_PHOTOS')}

        {/* 文字高度计算 */}
        {photoArray.map(photo => {

          const fontCalculatorData = { photo, fontCalculator };
          const fontCalculatorActions = {
            setIsCaptionOutOfSize: this.setIsCaptionOutOfSize.bind(this)
          };

          if(photo.isCalculated) return null;

          return (
            <FontCalculator
              key={photo.id}
              data={fontCalculatorData}
              actions={fontCalculatorActions}
            />
          );
        })}
      </XLoadingModal>
    );
  }

  componentDidUpdate() {
    const {
      boundProjectsActions,
      boundOAuthLoadingActions,
      boundTrackerActions,
      boundPhotoArrayActions
    } = this.props.actions;
    const { photoArray, canLoadingMainPage, photoArrayCaptionSizeMap } = this.state;
    const allPhotoIsCalculated = photoArray.every(photo => photo.isCalculated);

    if(canLoadingMainPage && allPhotoIsCalculated) {
      this.setState({canLoadingMainPage: false});

      boundPhotoArrayActions.setIsCaptionOutOfSize(photoArrayCaptionSizeMap)
        .then(() => {
          // 生成volumes
          boundTrackerActions.addTracker(`ImagePrepareComplete,${OAuth.authType},${this.state.totalCount}`);
          return boundProjectsActions.generateVolumes();
        })
        .then(() => {
          const { volumes } = this.props.data;
          boundTrackerActions.addTracker(`VolumesRenderComplete,${OAuth.authType},${volumes.count()}`);
          // 设置一下空的summary，触发刷新价格功能
          return boundProjectsActions.changeSummary({});
        })
        .then(() => {
          // 隐藏loading页面
          boundOAuthLoadingActions.hideOAuthLoading();
        })
        .catch((e) => {
          // 报错
          this.popupErrorWindow();
          console.log(e);
        });
    }
  }

  popupErrorWindow() {
    const { boundConfirmModalActions } = this.props.actions;

    boundConfirmModalActions.showConfirm({
      confirmMessage: (
        <div className="text-center">
          Network has some error, please reselect photo source.
        </div>
      ),
      onOkClick: () => {
        window.location.reload();
      },
      okButtonText: 'OK',
    });
  }

  setIsCaptionOutOfSize(photoId, isCaptionOutOfSize, newCaption) {
    let { photoArray } = this.state;

    photoArray = photoArray.map(photo => {
      if(photo.id === photoId) {
        photo.isCalculated = true;
      }

      return photo;
    });

    this.setState({
      photoArrayCaptionSizeMap: {
        ...this.state.photoArrayCaptionSizeMap,
        [photoId]: {
          isCaptionOutOfSize,
          newCaption
        }
      },
      photoArray
    });
  }

  async perpareProjectData() {
    const {
      boundPhotoArrayActions,
      boundTrackerActions
    } = this.props.actions;

    const albumsName = OAuth.authType !== oAuthTypes.FACEBOOK
      ? ['Timeline Photos']
      : ['Timeline Photos', 'Mobile Uploads'];

    try {
      // 获取用户账户下的所有TimeLine图片张数
      const count = await OAuth.getTimeLinePhotosCount();
      // 设置进度条总大小，埋点
      this.setProgressBarTotalCount(count);
      boundTrackerActions.addTracker(`StartPrepareImages,${OAuth.authType}`);

      for(const albumName of albumsName) {
        // 获取用户timeline相册图片：图片从新到旧
        await OAuth.getTimeLinePhotos(albumName, async photos => {
          await boundPhotoArrayActions.addPhotos(photos);

          this.setState({
            photoArray: [ ...this.state.photoArray, ...photos ]
          });

          // 设置进度条
          this.setProgressBar(photos.length);
        });
      }

      // 图片从老到新排序/获取服务器中的Exclude图片
      await boundPhotoArrayActions.sortPhotos();
      await boundPhotoArrayActions.getRemoteExcludePhotos();

      this.setState({canLoadingMainPage: true});
    } catch(e) {
      this.popupErrorWindow();
      console.log(e);
    }
  }

  setProgressBarTotalCount(totalCount) {
    this.setState({
      totalCount
    });
  }

  setProgressBar(currentCount) {
    this.setState({
      currentCount: this.state.currentCount + currentCount
    });
  }
}

export default translate('OAuthLoading')(OAuthLoading);
