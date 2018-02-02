import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { TabPanel } from 'react-tabs';
import classNames from 'classnames';
import VolumeCover from '../VolumeCover';
import * as strings from '../../constants/strings';

import './index.scss';

class PanelAlbums extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  selectVolume(volumeIdx) {
    const {
      boundProjectsActions,
      boundIncompleteModalActions,
      boundTrackerActions
    } = this.props.actions;
    const { volumes } = this.props.data;

    // 清除所有pause的TextImage promise
    promisePool.cleanPausePool();
    boundProjectsActions.selectVolume(volumeIdx);
    boundTrackerActions.addTracker('TapVolume');
  }

  render() {
    const { t, data, actions } = this.props;
    const { volumes, pageInfo, summary } = data;
    const maxPageLength = pageInfo.get('max') * 2 - 2;

    return (
      <div className="PanelAlbums">
        {volumes.map((volume, index) => {
          const thumbnailUrl = volume.getIn(['cover', 'photo', 'thumbnail', 'url']);

          const panelAlbumClass = classNames('PanelAlbum', {
            selected: volume.get('isSelected')
          });
          const panelAlbumNameClass = classNames('PanelAlbum__name', {
            selected: volume.get('isSelected')
          });
          const isVolumeIncomplete = !volume.get('isComplete');

          const volumePageLength = volume.get('pages').filter(page => page.get('layout') !== 'empty').size;

          return (
            <div className={panelAlbumClass} key={index} onClick={() => this.selectVolume(volume.get('idx'))}>
              <div className="PanelAlbum__image">
                <VolumeCover
                  width={90}
                  height={90}
                  bgColor='gray'
                  coverUrl={thumbnailUrl}
                  coverType={summary.get('cover')}
                  className="PanelAlbum__image--container"
                />
              </div>
              <div className="PanelAlbum__detail">
                <h1 className={panelAlbumNameClass}>
                  Volume {volume.get('idx') + 1}
                </h1>
                <div className="PanelAlbum__count">
                  <span className="PanelAlbum__count--text">({volumePageLength}/{maxPageLength})</span>
                  {isVolumeIncomplete
                    ? <span className="PanelAlbum__incomplete">{t('INCOMPLETE')}</span>
                    : null}
                </div>
                <div className="PanelAlbum__date">
                  <span className="PanelAlbum__date--text">{volume.get('date')}</span>
                </div>
              </div>
              <div className="PanelAlbum__arrow"></div>
            </div>
          )
        })}
      </div>
    );
  }
}

PanelAlbums.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PanelAlbums')(PanelAlbums);
