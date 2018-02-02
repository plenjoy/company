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
    this.getButtonHtml = this.getButtonHtml.bind(this);
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

  getButtonHtml() {
    const {
      okButtonText,
      okButtonClass,
      cancelButtonText,
      cancelInFirst,
      activeButton = 'ok'
    } = this.props;
    const html = [];

    const OKButtonClass = classNames(okButtonClass, {
      'button-white': activeButton !== 'ok'
    });

    const cancelButtonClass = classNames({
      'button-white': activeButton === 'ok'
    });

    const cancelHtml = cancelButtonText ? (
      <XButton
        key="cancel"
        className={cancelButtonClass}
        onClicked={this.handleCancel}
      >
        {cancelButtonText}
      </XButton>
      ) : null;

    const okHtml = okButtonText ? (
      <XButton
        key="ok"
        onClicked={this.handleConfirm}
        className={OKButtonClass}
      >
        {okButtonText}
      </XButton>
    ) : null;

    if (cancelInFirst) {
      if (cancelHtml) {
        html.push(cancelHtml);
      }
      if (okHtml) {
        html.push(okHtml);
      }
    } else {
      if (okHtml) {
        html.push(okHtml);
      }
      if (cancelHtml) {
        html.push(cancelHtml);
      }
    }

    return html;
  }

  render() {
    const {
      isShown,
      confirmTitle,
      confirmMessage,
      closeConfirmModalByX
    } = this.props;
    const confirmMessageData = confirmMessage.toJS ? confirmMessage.toJS() : confirmMessage;

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
          { this.getButtonHtml() }
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
    PropTypes.node,
    PropTypes.object
  ]),
  okButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  onCancelClick: PropTypes.func,
  okButtonClass: PropTypes.string,
  cancelButtonClass: PropTypes.string,
  activeButton: PropTypes.string,
  hideOnOk: PropTypes.bool,
  cancelInFirst: PropTypes.bool,
};

ConfirmModal.defaultProps = {
  okButtonText: 'Done',
  activeButton: 'ok',
  cancelInFirst: true
};

export default ConfirmModal;

