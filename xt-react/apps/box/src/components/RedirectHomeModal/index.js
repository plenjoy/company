import React, { Component, PropTypes } from 'react';
import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';
import './index.scss';

class RedirectHomeModal extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleSave() {
    alert('预留的保存接口');
    window.location = '//www.zno.com.dd';
  }

  handleRedirect() {
    window.location = '//www.zno.com.dd';
  }

  render() {
    return (
      <XModal
        className="popup-wrap"
        onClosed={this.props.onClosed}
        opened={this.props.opened}
      >
        <div className="popup-mes">
          { this.props.mes }
        </div>
        <div className="button-wrap">
          <XButton onClicked={this.handleSave}>Save</XButton>
          <XButton
            className="button-white"
            onClicked={this.handleRedirect}
          >Don't Save</XButton>
        </div>

      </XModal>
    );
  }
}

RedirectHomeModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  mes: PropTypes.element
};

export default RedirectHomeModal;
