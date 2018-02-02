import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import './index.scss';

class ConfirmModal extends Component {
  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleConfirm() {
    const { onOkClick, closeConfirmModal, hideOnOk } = this.props;
    onOkClick();

    if (hideOnOk) {
      closeConfirmModal();
    }
  }
  handleCancel() {
    const { onCancelClick, closeConfirmModal } = this.props;
    onCancelClick && onCancelClick();
    closeConfirmModal();
  }

  render() {
    const {
      isShown,
      confirmTitle,
      confirmMessage,
      okButtonText,
      okButtonClass,
      cancelButtonText,
      closeConfirmModal,
      closeConfirmModalByX
    } = this.props;
    const confirmMessageData = confirmMessage.toJS ? confirmMessage.toJS() : confirmMessage;
    const OKButtonClass = classNames('height-30', { okButtonClass });
    return (
      <XModal
        className="confirm-wrap"
        onClosed={closeConfirmModalByX}
        opened={isShown}
      >
        <div className="confirm-title">
          { confirmTitle }
        </div>
        <div className="confirm-mes">
          { confirmMessageData }
        </div>
        <div className="button-wrap">
          {
            cancelButtonText
            ? (
              <XButton
                className="button-white"
                onClicked={this.handleCancel}
              >
                {cancelButtonText}
              </XButton>
            )
            : null
          }
          <XButton
            onClicked={this.handleConfirm}
            className={OKButtonClass}
          >
            {okButtonText}
          </XButton>
        </div>

      </XModal>
    );
  }
}

ConfirmModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  onOkClick: PropTypes.func.isRequired,
  closeConfirmModal: PropTypes.func.isRequired,
  confirmTitle: PropTypes.string,
  confirmMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  okButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  onCancelClick: PropTypes.func,
  okButtonClass: PropTypes.string,
  hideOnOk: PropTypes.bool
};

ConfirmModal.defaultProps = {
  okButtonText: 'Done'
};

export default ConfirmModal;

