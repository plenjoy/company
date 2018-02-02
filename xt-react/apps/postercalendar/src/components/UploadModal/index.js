import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import UploadItemList from '../UploadItemList';

// import * as handler from './handler';
import * as main from './main';

import './index.scss';

class UploadModal extends Component {
	constructor (props) {
	  super(props);

    this.state = {
      allImages: [],
      addMore: false,

      // 控制上传并发的实例.
      instance: initUploadPool(4)
    };

    this.receiveProps = nextProps => main.receiveProps(this, nextProps);
    this.handleUploadModalClosed = isManuClick => main.handleUploadModalClosed(this, isManuClick);
    this.handleUploadModalMinimized = () => main.handleUploadModalMinimized(this);
    this.onUploadMoreClick = () => main.onUploadMoreClick(this);
    this.retryImage = (guid) => main.retryImage(this, guid);
    this.handleDelete = (guid) => main.handleDelete(this, guid);
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  render() {
    const { opened, t, uploadingImages, boundUploadedImagesActions, toggleModal, boundContactUsActions, addStatusCount, useNewUpload = false } = this.props;

    const { allImages, uploadedImagesCounts, instance } = this.state;
    const { countOfCompleted, countOfFailed } = instance;

    return (
      <XModal
        className="upload-modal"
        onClosed={ this.handleUploadModalClosed.bind(this, true) }
        onMinimized={this.handleUploadModalMinimized}
        isHideMinimize={!useNewUpload}
        opened={opened}
      >
        <div className="box-image-upload">
          <h3 className="title">
            { t('UPLOAD_IMAGES') }
          </h3>
          <UploadItemList
              uploadList={ allImages }
              boundContactUsActions={ boundContactUsActions }
              retryImage={this.retryImage}
              instance={instance}
              handleDelete={this.handleDelete}
              boundUploadedImagesActions={ boundUploadedImagesActions } />
          <div className="upload-meta">
            <div className="upload-info">
              <span className="compelete">
                { t('COMPLETE_COUNT', { n: countOfCompleted }) }
              </span>
              <span className="failed">
                { countOfFailed ? t('FILED_COUNT', { n: countOfFailed }) : '' }
              </span>
            </div>
            <div className="upload-buttons">
              <XFileUpload
                  className="white"
                  boundUploadedImagesActions={ boundUploadedImagesActions }
                  toggleModal={ toggleModal }
                  uploadFileClicked={this.onUploadMoreClick}
                  multiple="multiple">
                { t('ADD_MORE_PHOTOS') }
              </XFileUpload>
              <XButton
                onClicked={ this.handleUploadModalClosed.bind(this, true) }
                className="cancel-all"
              >
                { this.state.completeButton }
              </XButton>
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

UploadModal.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  uploadList : PropTypes.array
};

export default translate('UploadModal')(UploadModal);
