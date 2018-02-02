import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import UploadItemList from '../UploadItemList';
import { leastUploadImagesCount } from '../../../../common/utils/strings';
import * as mainHandle from './main';

import './index.scss';

class UploadModal extends Component {
  constructor(props) {
	  super(props);

    this.state = {
      allImages: [],
      addMore: false,
      showAttention: true,

      // 控制上传并发的实例.
      instance: initUploadPool(4)
    };

     // this.receiveProps = nextProps => handler.receiveProps(this, nextProps);
    this.receiveProps = nextProps => mainHandle.receiveProps(this, nextProps);
    this.handleUploadModalClosed = isManuClick => mainHandle.handleUploadModalClosed(this, isManuClick);
    this.onUploadMoreClick = () => mainHandle.onUploadMoreClick(this);
    this.retryImage = (guid) => mainHandle.retryImage(this, guid);
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  render() {
    const { opened, t, uploadingImages, boundUploadedImagesActions, boundContactUsActions, toggleModal, project } = this.props;
    const { allImages, uploadedImagesCounts, showAttention, instance } = this.state;

    const { countOfCompleted, countOfFailed } = instance;

    // 已经存在store并且下载好了的图片个数
    const totalUploadedImages = uploadedImagesCounts || project.get('imageArray').count();


    const needImagesCount = leastUploadImagesCount - totalUploadedImages;

    return (
      <XModal
        className="upload-modal"
        onClosed={this.handleUploadModalClosed.bind(this, true)}
        opened={opened}
      >
        <div className="box-image-upload">
          <h3 className="title">
            { t('UPLOAD_IMAGES') }
          </h3>
          <UploadItemList
            uploadList={allImages}
            boundContactUsActions={boundContactUsActions}
            retryImage={this.retryImage}
            instance={instance}
          />
          <div className="upload-meta">
            <div className="upload-info">
              <span className="compelete">
                { t('COMPLETE_COUNT', { n: countOfCompleted }) }
              </span>
              <span className="failed">
                { countOfFailed ? t('FILED_COUNT', { n: countOfFailed }) : '' }
              </span>
            </div>

            {
              (totalUploadedImages < leastUploadImagesCount) && showAttention ?
              (
                <div className="attention">
                  {t('ATTENTION', { count: needImagesCount })}
                </div>
              )
              : null
            }

            <div className="upload-buttons">
              <XFileUpload
                className="white"
                boundUploadedImagesActions={boundUploadedImagesActions}
                toggleModal={toggleModal}
                uploadFileClicked={this.onUploadMoreClick}
                multiple="multiple"
              >
                { t('ADD_MORE_PHOTOS') }
              </XFileUpload>
              <XButton
                onClicked={this.handleUploadModalClosed.bind(this, true)}
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
  uploadList: PropTypes.array
};

export default translate('UploadModal')(UploadModal);
