import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import img1 from './icon/1.svg';
import img2 from './icon/2.svg';
import img3 from './icon/3.svg';
import img4 from './icon/4.svg';
import img5 from './icon/5.svg';


import './index.scss';

class UseSpecModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, closeUseSpecModal, t, useSpecModal } = this.props;
    const downloadUrl = useSpecModal.toJS().url.url;
    return (
      <XModal
        className="how-this-work-modal"
        onClosed={closeUseSpecModal}
        opened={isShown}
      >
        <div className="modal-title">How to use the spec file?</div>
        <div className="line-item">
          <img className="line-num" src={img1}/>
          <div className="use-spec-content">
              Download the spec file and unzip.
            </div>
        </div>
        <div className="line-item">
           <img className="line-num" src={img2}/>
          <div className="use-spec-content">
             Open the .psd file to use as template to design each spread in your book.
            </div>
        </div>
        <div className="line-item">
           <img className="line-num" src={img3}/>
          <div className="use-spec-content">
             Once your design is completed, remove all guide lines and save as a .jpg file.
            </div>
        </div>
        <div className="line-item">
           <img className="line-num" src={img4}/>
          <div className="use-spec-content">
            Upload your completed spreads into design app and drag it to the page. We will auto layout the image file.
            </div>
        </div>
        <div className="line-item">
          <img className="line-num" src={img5}/>
          <div className="use-spec-content">
          Review all pages and place order.
            </div>
        </div>
        <div className="button-wrap">
          <a href={downloadUrl} download>
            <XButton
              className="little-button"
              onClicked={closeUseSpecModal}
            >
              Download spec file
            </XButton>
          </a>
        </div>
      </XModal>
    );
  }
}

UseSpecModal.propTypes = {
  isShown: PropTypes.bool.isRequired
};

export default UseSpecModal;
