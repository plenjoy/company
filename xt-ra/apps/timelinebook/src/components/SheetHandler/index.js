import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import deleteSrc from './assets/delete.svg';
import useForCoverSrc from './assets/useforcover.svg';
import switchCoverSrc from './assets/switchcover.svg';

import './index.scss';

class SheetHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onChangeToCover() {
    const { t, data, actions } = this.props;
    const { photoId } = data;
    const { boundProjectsActions,boundTrackerActions } = actions;

    boundProjectsActions.changePageToCover(photoId);
     boundTrackerActions.addTracker('TapUseForCover')
  }

  onExcludePhoto() {
    const { t, data, actions } = this.props;
    const { photoId } = data;
    const { boundPhotoArrayActions,boundTrackerActions } = actions;

    boundPhotoArrayActions.excludePhotos([photoId]);
    boundTrackerActions.addTracker('TapExclude')
  }

  onChangeCoverType() {
    const { t, data, actions } = this.props;
    const { boundViewPropertiesActions, boundProjectsActions } = actions;

    boundViewPropertiesActions.showViewIsRending();

    // 异步改变渲染区，渲染完成隐藏page is loading
    setTimeout(() => {
      boundProjectsActions.toggleCover();
    });
  }

  render() {
    const { t, data, actions } = this.props;

    const {
      isLeft,
      element,
      isCover,
      summary
    } = data;

    const computedSize = element.get('computedSize');
    const photoSize = computedSize.get('photoSize');

    const handlerClass = classNames('sheet-hanlder', {
      left: isLeft,
      right: !isLeft
    });

    const elementStyle = {
      top: computedSize.get('y'),
      left: computedSize.get('x'),
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    const deleteStyle = {
      top: photoSize.get('y'),
      left: photoSize.get('x'),
      width: photoSize.get('width'),
      height: photoSize.get('height')
    }

    return (
      <div className={handlerClass} style={elementStyle}>
        {isCover
          ? <div className="sheet-hanlder-reminder">{t(summary.get('cover'))}</div>
          : (
            <div className="sheet-hanlder-photoSize" style={deleteStyle}>
              <img className="sheet-hanlder-delete" src={deleteSrc} onClick={this.onExcludePhoto.bind(this)} />
            </div>
          )}

        {isCover
          ? (
            <div className="sheet-hanlder-footer" onClick={this.onChangeCoverType.bind(this)}>
              <span className="sheet-hanlder-text">
                <img className="sheet-handler-icon" src={switchCoverSrc} />
                {t('SWITCH_COVER')}
              </span>
            </div>
          ) : (
            <div className="sheet-hanlder-footer" onClick={this.onChangeToCover.bind(this)}>
              <span className="sheet-hanlder-text">
                <img className="sheet-handler-icon" src={useForCoverSrc} />
                {t('USE_FOR_COVER')}
              </span>
            </div>
          )}
      </div>
    );
  }
}

SheetHandler.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('SheetHandler')(SheetHandler);
