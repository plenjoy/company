import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { pageTypes } from '../../contants/strings';

import XButton from '../../../common/ZNOComponents/XButton';
import './index.scss';

class PaintedTextButtons extends Component {
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

  onAddCoverText(pageType) {
    const { actions } = this.props;
    actions.onAddCoverText(pageType);
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
      isTwoDvdType,
      isSupportSpinePaintedText,
      spineCount,
      style,
      className
    } = data;
    const btnsListClassName = classNames(className, 'cameo-painted-btns');

    const addCameoClassName = classNames('cameo-btn cp-btn show');
    const removeCameoClassName = classNames('cameo-btn cp-btn show');
    const paintedTextClassName = classNames('painted-text-btn cp-btn show');
    const topPanelClassName = classNames('top-panel', { show: showSpineText });
    const shouldShowSpineText = (isSupportSpinePaintedText && !spineCount);
    const topPanelStyle = {
      top: shouldShowSpineText ? '-74px' : '-49px',
      height: shouldShowSpineText ? '74px' : '49px'
    };

    return (
      <div className={btnsListClassName} style={style}>
        {
          isShowPaintedText ? (
            <div className={paintedTextClassName} onMouseOver={this.showPaintedTextPanel} onMouseOut={this.hidePaintedTextPanel}>
              {t('PAINTED_TEXT')}
              <ul className={topPanelClassName} style={topPanelStyle}>
                <li onClick={() => { this.onAddCoverText(pageTypes.front) }}>{t('FRONT_COVER_TEXT')}</li>
                <li onClick={() => { this.onAddCoverText(pageTypes.back) }}>{t('BACK_COVER_TEXT')}</li>
                {
                  shouldShowSpineText
                  ? <li onClick={this.onAddSpineText}>{t('SPINE_TEXT')}</li>
                  : null
                }
              </ul>
            </div>
          ) : null
        }

        {
          isShowCameo && isShowAddCameoBtn && !isTwoDvdType
            ? (
              <XButton className={addCameoClassName} onClicked={actions.onAddCameo}>{t('ADD_CAMEO')}</XButton>
            )
            : null
        }

        {
          isShowCameo && !isShowAddCameoBtn
            ? (
              <XButton className={removeCameoClassName} onClicked={actions.onRemoveCameo}>{t('REMOVE_CAMEO')}</XButton>
            )
            : null
        }
      </div>
    );
  }
}

PaintedTextButtons.propTypes = {
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

PaintedTextButtons.defaultProps = {
  data: {
    isShowAddCameo: true,
    isShowPaintedText: true
  }
};

export default translate('PaintedTextButtons')(PaintedTextButtons);

