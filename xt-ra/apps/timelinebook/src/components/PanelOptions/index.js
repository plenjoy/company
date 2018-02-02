import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { TabPanel } from 'react-tabs';
import classNames from 'classnames';
import checkboxSrc from './assets/checkbox.svg';
import checkboxSelectedSrc from './assets/checkbox-selected.svg';
import radioSrc from './assets/radio.svg';
import radioSelectedSrc from './assets/radio-selected.svg';
import OAuth from '../../../../common/utils/OAuth';

import './index.scss';

class PanelOptions extends Component {
  constructor(props) {
    super(props);

    const { data } = props;
    const { summary } = data
    const settings = summary.get('settings');

    this.state = {
      isLocked: false,
      settings: {
        isShowDate: settings.get('isShowDate'),
        isShowLocation: settings.get('isShowLocation'),
        isShowCaption: settings.get('isShowCaption')
      },
      summary: {
        cover: summary.get('cover')
      }
    };
    this.addTracker=this.addTracker.bind(this);
  }

  changeSettings(settings) {
    const {
      boundProjectsActions,
      boundViewPropertiesActions
    } = this.props.actions;

    // 先设置当前checkbox的状态
    this.setState({
      settings: {
        ...this.state.settings,
        ...settings
      }
    });
    this.addTracker(settings);

    // 显示page is loading
    // boundViewPropertiesActions.showViewIsRending();

    // 异步改变渲染区，渲染完成隐藏page is loading
    setTimeout(() => {
      boundProjectsActions.changeSettings(settings);
      // boundViewPropertiesActions.hideViewIsRending();
    }, 20);
  }

  changeSummary(summary) {
    const {
      boundProjectsActions,
      boundViewPropertiesActions
    } = this.props.actions;

    // 先设置当前checkbox的状态
    this.setState({
      summary: {
        ...this.state.summary,
        ...summary
      }
    });
    this.addTracker(summary);

    // 显示page is loading
    boundViewPropertiesActions.showViewIsRending();

    // 异步改变渲染区，渲染完成隐藏page is loading
    setTimeout(() => {
      boundProjectsActions.changeSummary(summary);
    });
  }

  addTracker(settings) {
    const { boundTrackerActions } = this.props.actions;
    const settingsName = Object.keys(settings)[0];
    if (settingsName == 'cover') {
      const Toggle = this.state.summary.cover == 'TLBHC' ? 'true' : 'false';
      boundTrackerActions.addTracker(`ToggleCover,${Toggle},${OAuth.authType}`);
    } else {
      const Toggle = settings[settingsName] ? 'true' : 'false';
      const ToggleString = settingsName == 'isShowDate' ? 'ToggleDate' : settingsName == 'isShowLocation' ? 'ToggleLocation' : 'ToggleCaption';
      boundTrackerActions.addTracker(`${ToggleString},${Toggle},${OAuth.authType}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { summary: nextSummary } = nextProps.data;
    const nextSettings = nextSummary.get('settings');

    this.setState({
      summary: {
        ...this.state.summary,
        cover: nextSummary.get('cover')
      },
      settings: {
        ...this.state.settings,
        ...nextSettings.toJS()
      }
    });
  }

  render() {
    const { t, data, actions } = this.props;
    const {
      settings: { isShowDate, isShowLocation, isShowCaption },
      summary: { cover }
    } = this.state;

    const dateCheckboxSrc = isShowDate ? checkboxSelectedSrc : checkboxSrc;
    const locationCheckboxSrc = isShowLocation ? checkboxSelectedSrc : checkboxSrc;
    const captionCheckboxSrc = isShowCaption ? checkboxSelectedSrc : checkboxSrc;

    const softCoverRadioSrc = cover === 'TLBSC' ? radioSelectedSrc : radioSrc;
    const hardCoverRadioSrc = cover === 'TLBHC' ? radioSelectedSrc : radioSrc;

    const showDateClass = classNames('PanelOption__item', { selected: isShowDate });
    const showLocationClass = classNames('PanelOption__item', { selected: isShowLocation });
    const showCaptionClass = classNames('PanelOption__item', { selected: isShowCaption });
    const softCoverClass = classNames('PanelOption__item', { selected: cover === 'TLBSC' });
    const hardCoverClass = classNames('PanelOption__item', { selected: cover === 'TLBHC' });

    return (
      <div className="PanelOptions__group">
        <div className="PanelOption">
          <h1 className="PanelOption__header">{t('LAYOUT_SETTINGS')}</h1>

          <div
            className={showDateClass}
            onClick={() => this.changeSettings({isShowDate: !isShowDate})}
          >
            <img className="PanelOption__select" src={dateCheckboxSrc} />
            <span className="PanelOption__text">{t('SHOW_DATE')}</span>
          </div>

          <div
            className={showLocationClass}
            onClick={() => this.changeSettings({isShowLocation: !isShowLocation})}
          >
            <img className="PanelOption__select" src={locationCheckboxSrc} />
            <span className="PanelOption__text">{t('SHOW_LOCATION')}</span>
          </div>

          <div
            className={showCaptionClass}
            onClick={() => this.changeSettings({isShowCaption: !isShowCaption})}
          >
            <img className="PanelOption__select" src={captionCheckboxSrc} />
            <span className="PanelOption__text">{t('SHOW_CAPTION')}</span>
          </div>
        </div>

        <div className="PanelOption">
          <h1 className="PanelOption__header">{t('UPGRADE_COVER')}</h1>

          <div
            className={softCoverClass}
            onClick={() => this.changeSummary({cover: 'TLBSC'})}
          >
            <img className="PanelOption__select" src={softCoverRadioSrc} />
            <span className="PanelOption__text">{t('SOFT_COVER')}</span>
          </div>

          <div
            className={hardCoverClass}
            onClick={() => this.changeSummary({cover: 'TLBHC'})}
          >
            <img className="PanelOption__select" src={hardCoverRadioSrc} />
            <span className="PanelOption__text">
              {t('HARD_COVER')}
              <i className="PanelOption__text--additional">{t('HARD_COVER_ADDITIONAL')}</i>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

PanelOptions.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PanelOptions')(PanelOptions);
