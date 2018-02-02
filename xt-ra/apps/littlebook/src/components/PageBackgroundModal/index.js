// import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';

import './index.scss';

class PageBackgroundModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: this.props.bgColor
    };
    this.onBgColorChange = this.onBgColorChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onBgColorChange(color) {
    this.setState({
      bgColor: color.hex
    });
  }

  onSubmit() {
    const { closeModal, selectedPageId, updatePageInfo } = this.props;
    updatePageInfo(selectedPageId, this.state.bgColor);
    closeModal();
  }

  render() {
    const { isShown, closeModal, bgColor, selectedPageId, t } = this.props;
    const needResetColor = isShown;
    const initBgColor = bgColor || '#FFFFFF';
    return (
      <XModal
        className="page-background-modal"
        onClosed={closeModal}
        opened={isShown}
      >
        <p className="modal-title">{t('TITLE')}</p>
        <div className="setting-box">
          <span>{t('CONTENT_LABEL')}</span>
          <XColorPicker
            needResetColor={needResetColor}
            initHexString={initBgColor}
            onColorChange={this.onBgColorChange}
          />
        </div>
        <div className="button-wrap">
          <XButton
            className="little-button white"
            onClicked={closeModal}
          >{t('CANCEL')}</XButton>
          <XButton
            className="little-button"
            onClicked={this.onSubmit}
          >{t('DONE')}</XButton>
        </div>
      </XModal>
    );
  }
}

PageBackgroundModal.propTypes = {
  // isShown: PropTypes.bool.isRequired
};

export default translate('PageBackgroundModal')(PageBackgroundModal);
