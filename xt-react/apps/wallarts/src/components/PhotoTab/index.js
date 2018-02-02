import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import { merge, get } from 'lodash';
import { is, fromJS } from 'immutable';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import SortAndFilter from '../SortAndFilter';
import UploadStatus from '../UploadStatus';
import ImageList from '../ImageList';

import {
  onToggleHideUsed,
  onSorted,
  uploadFileClicked,
  checkUsageCount,
  tipClick,
  sortImages,
  getSortOptions,
  onSelectFile
} from './handler';
import emptyIcon from './empty.svg';

import './index.scss';


class PhotoTab extends Component {
  constructor(props) {
    super(props);
    const { data, t } = this.props;
    let { uploadedImages } = data;

    uploadedImages = uploadedImages.map((item) => {
      return merge({}, item, {
        usedCount: 0
      });
    });

    this.onToggleHideUsed = () => onToggleHideUsed(this);
    this.onSorted = param => onSorted(this, param);
    this.uploadFileClicked = () => uploadFileClicked(this);
    this.tipClick = () => tipClick(this);
    this.getSortOptions = () => getSortOptions(t);
    this.onSelectFile = (files) => onSelectFile(this, files);

    this.checkUsageCount = (imageArr, imageUsedCountMap) => checkUsageCount(imageArr, imageUsedCountMap);

    const sortOptions = this.getSortOptions();

    // 照片默认按照拍摄时间依次从旧到新进行排序. 即Date Taken (oldest to newest)
    const currentOption = sortOptions[0];

    this.state = {
      uploadedImages,
      sortOptions,
      copyUploadedImages: uploadedImages,
      isHideUseChecked: false,
      currentOption
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldElements = get(this.props, 'data.uploadedImages');
    const newElements = get(nextProps, 'data.uploadedImages');
    const oldImageUsedCountMap = get(this.props, 'data.imageUsedMap');
    const imagesUsedCountMap = get(nextProps, 'data.imageUsedMap');

    if (!is(fromJS(oldElements), fromJS(newElements)) ||
      !is(oldImageUsedCountMap, imagesUsedCountMap)) {
      let newImages = this.checkUsageCount(merge([], newElements), imagesUsedCountMap.toJS());

      newImages = sortImages(newImages, this.state.currentOption);

      if (this.state.isHideUseChecked) {
        const nonUsedImages = newImages.filter((item) => {
          return item.usedCount === 0;
        });
        this.setState({
          uploadedImages: nonUsedImages,
          copyUploadedImages: newImages
        });
      } else {
        this.setState({
          uploadedImages: newImages,
          copyUploadedImages: newImages
        });
      }
    }
  }

  componentDidMount() {
    const elements = get(this.props, 'data.uploadedImages');
    const imagesUsedCountMap = get(this.props, 'data.imageUsedMap');
    let newImages = this.checkUsageCount(merge([], elements), imagesUsedCountMap.toJS());
    newImages.map((item) => {
      if (!item.shotTime) {
        item.shotTime = new Date().getTime();
      }
    });

    newImages = sortImages(newImages, this.state.currentOption);

    this.setState({
      uploadedImages: newImages,
      copyUploadedImages: newImages
    });
  }

  render() {
    const { t, actions, data } = this.props;
    const {
      uploadedImages,
      copyUploadedImages,
      sortOptions,
      currentOption
    } = this.state;
    const { boundImagesActions, boundProjectActions, toggleModal, boundTrackerActions } = actions;
    const { baseUrls, imageUsedCountMap, uploadStatus, useNewUpload } = data;

    const { total, uploaded, errored } = uploadStatus;

    const isFilterShow = !!copyUploadedImages.length;

    const uploading = !!total;
    const completedWithError = errored > 0 && (errored + uploaded === total);

    const imageListClass = {
      'row-1': (uploading || completedWithError) && useNewUpload,
      'row-2': (!!errored && !completedWithError) && useNewUpload
    };

    const uploadStatusData = {
      total,
      uploaded,
      errored
    };

    const uplaodStatusActions = {
      toggleModal,
      boundTrackerActions
    };

    return (
      <div className="PhotoTab" draggable="false">
        <XFileUpload
          id="addPhotoBtn"
          className="add-photo"
          multiple="multiple"
          boundUploadedImagesActions={boundImagesActions}
          toggleModal={toggleModal}
          useNewUpload={useNewUpload}
          ref={fileUpload => this.fileUpload = fileUpload}
          uploadFileClicked={this.uploadFileClicked}
          onSelectFile={this.onSelectFile}
        >
         { t('ADD_PHOTOS') }
        </XFileUpload>
        {
          useNewUpload ?
            <UploadStatus data={uploadStatusData} actions={uplaodStatusActions} /> : null
        }

        {/*<SortAndFilter
          onToggleHideUsed={this.onToggleHideUsed}
          onSorted={this.onSorted}
          isShow={isFilterShow}
          sortOptions={sortOptions}
          currentOption={currentOption}
        />*/}
        

        {
          copyUploadedImages && copyUploadedImages.length ? (
            <ImageList
              uploadedImages={uploadedImages}
              boundProjectActions={boundProjectActions}
              baseUrls={baseUrls}
              className={imageListClass}
              imageUsedCountMap={imageUsedCountMap}
            />
          ) : (
          <div className="empty-image-list">
            <img className="empty-icon" src={emptyIcon} />
            <span className="text">{t('EMPTY_IMAGE_LIST_TIP')}</span>
          </div>)
        }

      </div>
    );
  }
}

PhotoTab.proptype = {

};

export default translate('PhotoTab')(PhotoTab);
