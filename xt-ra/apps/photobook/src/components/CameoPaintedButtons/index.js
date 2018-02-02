import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { merge } from 'lodash';

import XButton from '../../../../common/ZNOComponents/XButton';
import './index.scss';

class CameoPaintedButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaintedText: false
    };
    this.showPaintedTextPanel = this.showPaintedTextPanel.bind(this);
    this.hidePaintedTextPanel = this.hidePaintedTextPanel.bind(this);
    this.onAddSpineText = this.onAddSpineText.bind(this);
    this.onAddCoverText = this.onAddCoverText.bind(this);
  }

  showPaintedTextPanel() {
    this.setState({
      showSpineText: true
    });
  }

  hidePaintedTextPanel() {
    this.setState({
      showSpineText: false
    });
  }

  onAddSpineText() {
    const { actions } = this.props;
    actions.onAddSpineText();
    this.hidePaintedTextPanel();
  }

  onAddCoverText() {
    const { actions } = this.props;
    actions.onAddCoverText();
    this.hidePaintedTextPanel();
  }

  render() {
    const {
      showSpineText
    } = this.state;
    const { t } = this.props;
    const { actions, data } = this.props;
    const {
      isShowCameo,
      isShowAddCameoBtn,
      isShowPaintedText,
      isShowSaveTemplate,
      isSupportSpinePaintedText,
      isShowSpineText,
      style,
      className,
      spineCount
    } = data;
    const btnsListClassName = classNames(className, 'cameo-painted-btns');

    const addCameoClassName = classNames('cameo-btn cp-btn show');
    const removeCameoClassName = classNames('cameo-btn cp-btn show');
    const paintedTextClassName = classNames('painted-text-btn cp-btn show');
    const topPanelClassName = classNames('top-panel', { show: showSpineText });
    const shouldShowSpineText = (isSupportSpinePaintedText && !spineCount);
    const topPanelStyle = {
      top: shouldShowSpineText ? '-41px' : '-21px',
      height: shouldShowSpineText ? '41px' : '21px'
    };

    const newStyle = merge({}, style, {
      display: isShowPaintedText || isShowCameo ||  isShowSpineText ? 'block' : 'none'
    });

    return (
      <div className={btnsListClassName} style={newStyle}>
        {
        isShowPaintedText ? (
          <div className={paintedTextClassName} onMouseOver={this.showPaintedTextPanel} onMouseOut={this.hidePaintedTextPanel}>
            {t('PAINTED_TEXT')}
            <ul className={topPanelClassName} style={topPanelStyle}>
              {
                shouldShowSpineText ?
                (<li onClick={this.onAddSpineText}>{t('SPINE_TEXT')}</li>)
                : null
              }
              <li onClick={this.onAddCoverText}>{t('COVER_TEXT')}</li>
            </ul>
          </div>
        ) : null
      }

      {
        isShowCameo && isShowAddCameoBtn ? (
          <XButton className={addCameoClassName} onClicked={actions.onAddCameo}>{t('ADD_CAMEO')}</XButton>
        ) : null
      }

      {
        isShowCameo && !isShowAddCameoBtn ? (
          <XButton className={removeCameoClassName} onClicked={actions.onRemoveCameo}>{t('REMOVE_CAMEO')}</XButton>
        ) : null
      }
        {/* 虽然这个也叫SPINE_TEXT 但是 实际内容却不一样 */}
      {
       isShowSpineText && !spineCount ? (
         <XButton className={addCameoClassName} onClicked={this.onAddSpineText}>{t('SPINE_TEXT')}</XButton>
        ) : null
      }

      </div>
    );
  }
}

CameoPaintedButtons.propTypes = {
  actions: PropTypes.shape({
    onAddCameo: PropTypes.func.isRequired,
    onRemoveCameo: PropTypes.func.isRequired
  }),
  data: PropTypes.shape({
    isShowCameo: PropTypes.bool,
    isShowAddCameoBtn: PropTypes.bool,
    isShowPaintedText: PropTypes.bool
  })
};

CameoPaintedButtons.defaultProps = {
  data: {
    isShowAddCameo: true,
    isShowPaintedText: true
  }
};

export default translate('CameoPaintedButtons')(CameoPaintedButtons);

