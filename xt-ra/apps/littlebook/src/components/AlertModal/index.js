import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    const { onButtonClick, closeAlertModal } = this.props;
    if (typeof onButtonClick === 'function') {
      onButtonClick();
    }
    closeAlertModal();
  }

  render() {
    const {
      isShown,
      title,
      message,
      buttonText,
      closeAlertModal,
      escapeClose,
      isHideIcon
    } = this.props;
    return (
      <XModal
        className="alert-wrap"
        onClosed={closeAlertModal}
        opened={isShown}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        {
          title
          ? (<div className="alert-title">
            {title}
          </div>
          )
          : null
        }
        <div className="alert-mes">
          { message }
        </div>
        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={this.onButtonClick}
          >
            {buttonText}
          </XButton>
        </div>
      </XModal>
    );
  }
}

AlertModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  closeAlertModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  escapeClose: PropTypes.bool,
  isHideIcon: PropTypes.bool,
  onButtonClick: PropTypes.func
};

AlertModal.defaultProps = {
  buttonText: 'OK'
};

export default AlertModal;

