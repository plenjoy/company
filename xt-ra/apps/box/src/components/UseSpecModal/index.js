import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';


import './index.scss';

class UseSpecModal extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { isShown, onClone, useSpecModal } = this.props;
    const downloadUrl = useSpecModal.toJS();
    const url = downloadUrl && downloadUrl.url && downloadUrl.url.url;
    return (
      <XModal
        className="how-this-work-modal"
        onClosed={onClone}
        opened={isShown}
      >
        <div className="modal-title">How to use the spec file?</div>
        <div className="line-item">
          <div className="line-num" >1</div>
          <div className="use-spec-content">
              Download the spec file and unzip.
            </div>
        </div>
        <div className="line-item">
          <div className="line-num" >2</div>
          <div className="use-spec-content">
             Open the .psd file to use as template to design each spread in your book.
            </div>
        </div>
        <div className="line-item">
          <div className="line-num" >3</div>
          <div className="use-spec-content">
             Once your design is completed, remove all guide lines and save as a .jpg file.
            </div>
        </div>
        <div className="line-item">
          <div className="line-num" >4</div>
          <div className="use-spec-content">
            Upload your completed spreads into design app and drag it to the page. We will auto layout the image file.
            </div>
        </div>
        <div className="line-item">
          <div className="line-num" >5</div>
          <div className="use-spec-content">
          Review all pages and place order.
            </div>
        </div>
        <div className="button-wrap">
          <a href={url} download>
            <XButton
              className="little-button"
              onClicked={onClone}
            >
              Download spec file
            </XButton>
          </a>
        </div>
      </XModal>
    );
  }
}


export default UseSpecModal;
