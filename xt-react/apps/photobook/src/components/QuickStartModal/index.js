import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

class QuickStartModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, closeQuickStartModal, t } = this.props;
    return (
      <XModal
        className="quick-start-modal"
        onClosed={closeQuickStartModal}
        opened={isShown}
      >
        <p className="modal-title">{t('TITLE')}</p>
        <p className="modal-step">{t('STEP_1')}</p>
        <p className="modal-text">
          {t('STEP_1_CONTENT1')}
          <br />
          {t('STEP_1_CONTENT2')}
          <br />
          {t('STEP_1_CONTENT3')}
        </p>
        {/*
          <p className="modal-step">
            Design Service Users:
          </p>
          <p className="modal-text">
            1. Upload photos
            <br/>
            2. Request design service
          </p>
        */}
        <p className="modal-step">{t('STEP_2')}</p>
        <p className="modal-text">
          {t('STEP_2_CONTENT1')}
          <br />
          {t('STEP_2_CONTENT2')}
          <br />
          {t('STEP_2_CONTENT3')}
          <br />
          {t('STEP_2_CONTENT4')}
        </p>
        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={closeQuickStartModal}
          >{t('BUTTON_TEXT')}</XButton>
        </div>
      </XModal>
    );
  }
}

QuickStartModal.propTypes = {
  t: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  closeQuickStartModal: PropTypes.func.isRequired
};

export default translate('QuickStartModal')(QuickStartModal);
