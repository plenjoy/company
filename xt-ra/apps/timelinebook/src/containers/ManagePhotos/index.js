import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { is } from 'immutable';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { managePhotoViewTypes } from '../../constants/strings';
import XButton from '../../../../common/ZNOComponents/XButton';
import ImageGrid from '../../components/ImageGrid';
import restoreSrc from './assets/restore.svg';
import excludeSrc from './assets/exclude.svg';
import LazyLoad from 'react-lazy-load';
import {isMac} from '../../../../common/utils/browser'
import XWayPoint from '../../../../common/ZNOComponents/XWayPoint';

// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

import './index.scss';

import * as mainHandle from './handle/main';

class ManagePhotos extends Component {
  constructor(props) {
    super(props);

    const photoArray = props.photoArray;
    const includePhotos = photoArray.filter(photo => photo.get('isIncluded'));
    const excludePhotos = photoArray.filter(photo => !photo.get('isIncluded'));

    this.state = {
      includePhotos,
      excludePhotos,
      includeSelectedPhotoIds: [],
      excludeSelectedPhotoIds: [],
      alwaysShowPhotoIds: []
    };

    this.container = null;
  }
  componentWillReceiveProps(nextProps) {
    const oldPhotoArray = this.props.photoArray;
    const newPhotoArray = nextProps.photoArray;

    if (!is(oldPhotoArray, newPhotoArray)) {
      const includePhotos = newPhotoArray.filter(photo => photo.get('isIncluded'));
      const excludePhotos = newPhotoArray.filter(photo => !photo.get('isIncluded'));

      this.setState({
        includePhotos,
        excludePhotos
      });
    }
  }

  changeViewType(viewType) {
    const { boundSidebarActions } = this.props;
    boundSidebarActions.changeManagePhotoFilterPhotoTab(viewType);
  }

  includePhotos() {
    const {
      boundPhotoArrayActions,
      boundTrackerActions,
      photoArray
    } = this.props;
    let newPhotoArray = photoArray;
    this.state.includeSelectedPhotoIds.forEach((id) => {
      const index = newPhotoArray.findIndex(m => m.get('id') === id);
      if (index !== -1) {
        newPhotoArray = newPhotoArray.setIn([String(index), 'isIncluded'], true);
      }
    });

    const includePhotos = newPhotoArray.filter(photo => photo.get('isIncluded'));
    const excludePhotos = newPhotoArray.filter(photo => !photo.get('isIncluded'));

    this.setState({
      includePhotos,
      excludePhotos
    });
    boundPhotoArrayActions.includePhotos(this.state.includeSelectedPhotoIds);
    boundTrackerActions.addTracker(`TapRestoreInMPS,${this.state.includeSelectedPhotoIds.length}`);
    this.setState({
      includeSelectedPhotoIds: []
    });
  }

  togglePhotoToIncludeList(event, photo) {
    let {
      includeSelectedPhotoIds
    } = this.state;

    const photoId = photo.get('id');
    const isInList = includeSelectedPhotoIds.some(id => id === photoId);
    this.setPhotoAlwaysShow(photoId)

    // if (!event.ctrlKey && !event.metaKey) {
    //   includeSelectedPhotoIds = [];
    // }

    if (isInList) {
      this.setState({
        includeSelectedPhotoIds: includeSelectedPhotoIds.filter(id => id !== photoId)
      });
    } else {
      this.setState({
        includeSelectedPhotoIds: [
          ...includeSelectedPhotoIds,
          photoId
        ]
      });
    }
  }

  excludePhotos() {
    const {
      boundPhotoArrayActions,
      boundTrackerActions,
      photoArray
    } = this.props;

    let newPhotoArray = photoArray;
    this.state.excludeSelectedPhotoIds.forEach((id) => {
      const index = newPhotoArray.findIndex(m => m.get('id') === id);
      if (index !== -1) {
        newPhotoArray = newPhotoArray.setIn([String(index), 'isIncluded'], false);
      }
    });

    const includePhotos = newPhotoArray.filter(photo => photo.get('isIncluded'));
    const excludePhotos = newPhotoArray.filter(photo => !photo.get('isIncluded'));

    this.setState({
      includePhotos,
      excludePhotos
    });


    boundPhotoArrayActions.excludePhotos(this.state.excludeSelectedPhotoIds);
    boundTrackerActions.addTracker(`TapExcludeInMPS,${this.state.excludeSelectedPhotoIds.length}`);

    this.setState({
      excludeSelectedPhotoIds: []
    });
  }

  togglePhotoToExcludeList(event, photo) {
    let {
      excludeSelectedPhotoIds
    } = this.state;

    const photoId = photo.get('id');
    const isInList = excludeSelectedPhotoIds.some(id => id === photoId);
    this.setPhotoAlwaysShow(photoId)

    // if (!event.ctrlKey && !event.metaKey) {
    //   excludeSelectedPhotoIds = [];
    // }

    if (isInList) {
      this.setState({
        excludeSelectedPhotoIds: excludeSelectedPhotoIds.filter(id => id !== photoId)
      });
    } else {
      this.setState({
        excludeSelectedPhotoIds: [
          ...excludeSelectedPhotoIds,
          photoId
        ]
      });
    }
  }

  setPhotoAlwaysShow(photoId) {
    const { alwaysShowPhotoIds } = this.state;

    if(!alwaysShowPhotoIds.includes(photoId)) {
      this.setState({
        alwaysShowPhotoIds: [...alwaysShowPhotoIds, photoId]
      });
    }
  }

  render() {
    const {
      t,
      photoArray,
      managePhotoFilterPhotoTab
    } = this.props;

    const {
      includeSelectedPhotoIds,
      excludeSelectedPhotoIds,
      includePhotos,
      excludePhotos
    } = this.state;

    const includePhotoCount = includePhotos.size;
    const excludePhotoCount = excludePhotos.size;

    // Include页面选中/隐藏样式
    const includeCountClass = classNames('manage-photos-count', {
      selected: managePhotoViewTypes.included === managePhotoFilterPhotoTab
    });
    const includePhotosClass = classNames('manage-photos-list', {
      hide: managePhotoViewTypes.included !== managePhotoFilterPhotoTab
    });

    // Exclude页面选中/隐藏样式
    const excludeCountClass = classNames('manage-photos-count', {
      selected: managePhotoViewTypes.exclude === managePhotoFilterPhotoTab
    });
    const excludePhotosClass = classNames('manage-photos-list', {
      hide: managePhotoViewTypes.exclude !== managePhotoFilterPhotoTab
    });

    // 选中图片id数量
    const selectPhotoIds = managePhotoViewTypes.included === managePhotoFilterPhotoTab
      ? excludeSelectedPhotoIds
      : includeSelectedPhotoIds;

    const selectPhotoText = selectPhotoIds.length > 1 ? 'Photos Selected' : 'Photo Selected';

    // 按钮文字/执行动作
    const isButtonDisabled = selectPhotoIds.length === 0;
    const buttonText = managePhotoViewTypes.included === managePhotoFilterPhotoTab
      ? 'Exclude'
      : 'Restore';
    const buttonAction = managePhotoViewTypes.included === managePhotoFilterPhotoTab
      ? this.excludePhotos.bind(this)
      : this.includePhotos.bind(this);
    const icon = managePhotoViewTypes.included === managePhotoFilterPhotoTab
      ? <img className="manage-photos-button-icon" src={excludeSrc} />
      : <img className="manage-photos-button-icon" src={restoreSrc} />;

    const lazyItemStyle = {
      float: 'left'
    };

    const CtrlOrcommandString = isMac ? 'command' : 'Ctrl';

    return (
      <div className="manage-photos" ref={container => this.container = container}>
        <div className="manage-photos-header">
          <div
            className={includeCountClass}
            onClick={() => this.changeViewType(managePhotoViewTypes.included)}
          >
            {t('INCLUDED')}({includePhotoCount})
          </div>

          <div
            className={excludeCountClass}
            onClick={() => this.changeViewType(managePhotoViewTypes.exclude)}
          >
            {t('EXCLUDED')}({excludePhotoCount})
          </div>

          <div className="manage-photos-right">
            <span className="manage-photos-select-count">
              {selectPhotoIds.length} {selectPhotoText}
            </span>
            <XButton className="manage-photos-button" onClicked={buttonAction} disabled={isButtonDisabled}>
              {icon}
              {buttonText}
            </XButton>
          </div>
        </div>

        <div className="manage-photos-body">
          <div className={includePhotosClass}>
              {includePhotos.map((photo, index) => {
                const imageGridClass = classNames('manage-photos-image-grid', {
                  selected: this.state.excludeSelectedPhotoIds.some(photoId => photoId === photo.get('id'))
                });
                const lazyItemStyle = {
                  width: `${photo.get('width') * 140 / photo.get('height')}px`,
                  flexGrow: photo.get('width') * 140 / photo.get('height')
                };

                return (
                  <XWayPoint
                    key={photo.get('id')}
                    container={this.container}
                    className={imageGridClass}
                    style={lazyItemStyle}
                    isAlwaysShow={this.state.alwaysShowPhotoIds.includes(photo.get('id'))}
                  >
                    <ImageGrid
                      gridHeight={140.921}
                      imageWidth={photo.get('width')}
                      imageHeight={photo.get('height')}
                      src={photo.getIn(['thumbnail', 'url'])}
                      onClick={event => this.togglePhotoToExcludeList(event, photo)}
                      title={CtrlOrcommandString + t('MULTIPLE_SELECT')}
                    />
                  </XWayPoint>
                );
              })}
              <div className="clearfix" />


            { !includePhotos.size ? <div className="manage-photos-empty">{t('NO_INCLUDED_PHOTO')}</div> : null }
          </div>

          <div className={excludePhotosClass}>
              {excludePhotos.map((photo, index) => {
                const imageGridClass = classNames('manage-photos-image-grid', {
                  selected: this.state.includeSelectedPhotoIds.some(photoId => photoId === photo.get('id'))
                });

                const lazyItemStyle = {
                  width: `${photo.get('width') * 140 / photo.get('height')}px`,
                  flexGrow: photo.get('width') * 140 / photo.get('height')
                };

                return (
                  <XWayPoint
                    key={photo.get('id')}
                    container={this.container}
                    className={imageGridClass}
                    style={lazyItemStyle}
                    onEnter={() => this.setPhotoAlwaysShow(photo.get('id'))}
                    isAlwaysShow={this.state.alwaysShowPhotoIds.includes(photo.get('id'))}
                  >
                    <ImageGrid
                      gridHeight={140.921}
                      imageWidth={photo.get('width')}
                      imageHeight={photo.get('height')}
                      src={photo.getIn(['thumbnail', 'url'])}
                      onClick={event => this.togglePhotoToIncludeList(event, photo)}
                      title={CtrlOrcommandString + t('MULTIPLE_SELECT')}
                    />
                  </XWayPoint>
                );
              })}
              <div className="clearfix" />


            { !excludePhotos.size ? <div className="manage-photos-empty">{t('NO_EXCLUDED_PHOTO')}</div> : null }
          </div>
        </div>
      </div>
    );
  }
}

ManagePhotos.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapAppDispatchToProps)(
  translate('ManagePhotos')(ManagePhotos)
);
