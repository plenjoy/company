import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';
import {
  closeContactUsModal,
  handleSubmit,
  checkBlank
} from './handler';

class ContactUsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBlank: true
    };
    this.checkBlank = () => checkBlank(this);
    this.handleSubmit = () => handleSubmit(this);
    this.closeContactUsModal = () => closeContactUsModal(this);
  }

  render() {
    const { isShown, t } = this.props;
    return (
      <XModal
        className="contact-us-modal"
        onClosed={this.closeContactUsModal}
        opened={isShown}
      >
        <p className="modal-title">{t('TITLE')}</p>
        <p className="modal-item">{t('QUESTION_TITLE')}</p>
        <textarea
          className="item-textarea"
          ref="questionInputer"
          onChange={this.checkBlank}
          placeholder={t('QUESTION_PLACEHOLDER')}
        />
        <p className="modal-item">{t('REQUEST_TITLE')}</p>
        <textarea
          className="item-textarea"
          ref="requestInputer"
          onChange={this.checkBlank}
          placeholder={t('REQUEST_PLACEHOLDER')}
        />
        <p className="modal-item">{t('BUG_TITLE')}</p>
        <textarea
          className="item-textarea"
          ref="bugInputer"
          onChange={this.checkBlank}
          placeholder={t('BUG_PLACEHOLDER')}
        />
        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={this.closeContactUsModal}
          >{t('CANCEL')}</XButton>
          <XButton
            className="little-button"
            onClicked={this.handleSubmit}
            disabled={this.state.isBlank}
          >{t('SUBMIT')}</XButton>
        </div>
      </XModal>
    );
  }
}

ContactUsModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default translate('ContactUsModal')(ContactUsModal);
