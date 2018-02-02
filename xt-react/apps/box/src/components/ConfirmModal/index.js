import React, { Component, PropTypes } from 'react';
import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';
import './index.scss';

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleConfirm() {
    const { onOkClick, onModalClose } = this.props;
    onOkClick();
    onModalClose();
  }

  handleCancel() {
    const { onCancelClick, onModalClose } = this.props;
    onCancelClick && onCancelClick();
    onModalClose();
  }

  render() {
    const {
      isShow,
      confirmMessage,
      okButtonText,
      confirmTitle,
      cancelButtonText,
      onModalClose
    } = this.props;
    return (
      <XModal
        className="confirm-wrap"
        onClosed={onModalClose}
        opened={isShow}
      >
        <div className="confirm-title">
          { confirmTitle }
        </div>
        <div className="confirm-mes">
          { confirmMessage }
        </div>
        <div className="button-wrap">
          <XButton
            onClicked={this.handleConfirm}
          >
            {okButtonText}
          </XButton>
          {
            cancelButtonText
            ? (
              <XButton className="button-white" onClicked={this.handleCancel}>
                {cancelButtonText}
              </XButton>
            )
            : null
          }
        </div>

      </XModal>
    );
  }
}

ConfirmModal.propTypes = {
  isShow: PropTypes.bool.isRequired,
  onOkClick: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  confirmMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  okButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  onCancelClick: PropTypes.func,
  confirmTitle: PropTypes.string
};

ConfirmModal.defaultProps = {
  okButtonText: 'Done'
};

export default ConfirmModal;
