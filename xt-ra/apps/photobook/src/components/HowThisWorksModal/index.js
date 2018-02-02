import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

class HowThisWorksModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, closeHowThisWorksModal, t } = this.props;
    return (
      <XModal
        className="how-this-work-modal"
        onClosed={closeHowThisWorksModal}
        opened={isShown}
      >
        <div className="content-wrap">
          <p className="modal-title">{t('TITLE')}</p>
          <p className="modal-welcome">{t('DESCRIPTION')}</p>
          <p className="modal-step">{t('STEP_1')}</p>
          <p className="modal-text">{t('STEP_1_CONTENT')}</p>
          <p className="modal-step">{t('STEP_2')}</p>
          <p className="modal-text">{t('STEP_2_CONTENT')}</p>
        </div>
        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={closeHowThisWorksModal}
          >
            {t('BUTTON_TEXT')}
          </XButton>
        </div>
      </XModal>
    );
  }
}

HowThisWorksModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  closeHowThisWorksModal: PropTypes.func.isRequired
};

export default translate('HowThisWorksModal')(HowThisWorksModal);
