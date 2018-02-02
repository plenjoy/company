import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import UploadItemList from '../UploadItemList';
import { limitedPageNum } from '../../constants/strings';

// import * as handler from './handler';
import * as main from './main';

import './index.scss';

class UploadModal extends Component {
	constructor (props) {
	  super(props);

    this.state = {
      allImages: [],
      addMore: false,
      showAttention: true,

      total: 0,
      isShowOverImageAttention: false,

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
    const { opened, t, project, uploadingImages, boundUploadedImagesActions, toggleModal, boundContactUsActions, addStatusCount, useNewUpload = false, autoAddPhotoToCanvas } = this.props;

    const { allImages, uploadedImagesCounts, instance, showAttention, isShowOverImageAttention, total } = this.state;
    const { countOfCompleted, countOfFailed } = instance;

    // 已经存在store并且下载好了的图片个数
    const totalUploadedImages = uploadedImagesCounts || project.imageArray.count();
    const needImagesCount = limitedPageNum - totalUploadedImages;
    const autoAddPhotoToCanvasStatus = autoAddPhotoToCanvas && autoAddPhotoToCanvas.status;

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
          {
            isShowOverImageAttention ?
              (<div className="over-image-attention">
                {
                  t('OVER_IMAGES_ATTENTION', {total, count: limitedPageNum})
                }
                </div>) : null
          }
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
            {
              (totalUploadedImages < limitedPageNum) && showAttention && !autoAddPhotoToCanvasStatus?
              (
                <div className="attention">
                  {t('ATTENTION', { count: needImagesCount })}
                </div>
              )
              : null
            }
            <div className="upload-buttons">
              {
                autoAddPhotoToCanvasStatus
                  ? null
                  : (
                    <XFileUpload
                      className="white"
                      boundUploadedImagesActions={boundUploadedImagesActions}
                      toggleModal={toggleModal}
                      uploadFileClicked={this.onUploadMoreClick}
                      multiple="multiple"
                    >
                      { t('ADD_MORE_PHOTOS') }
                    </XFileUpload>
                    )
              }

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
  uploadList : PropTypes.array
};

export default translate('UploadModal')(UploadModal);
