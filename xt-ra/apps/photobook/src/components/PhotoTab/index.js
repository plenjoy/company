import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import { merge, get } from 'lodash';
import { is, fromJS } from 'immutable';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import SortAndFilter from '../SortAndFilter';
import GroupImages from '../GroupImages';
import UploadStatus from '../UploadStatus';
import ImageList from '../ImageList';

import {
  onToggleHideUsed,
  onSorted,
  onGrouped,
  uploadFileClicked,
  checkUsageCount,
  tipClick,
  sortImages,
  groupImages,
  getSortOptions,
  getGroupOptions,
  onSelectFile,
  addGroupElements,
  addGroupElement
} from './handler';
import emptyIcon from './empty.svg';

import './index.scss';


class PhotoTab extends Component {
  constructor(props) {
    super(props);
    const { data, t } = this.props;
    let { uploadedImages, isUsePhotoGroup } = data;

    uploadedImages = uploadedImages.map((item) => {
      return merge({}, item, {
        usedCount: 0
      });
    });

    this.onToggleHideUsed = () => onToggleHideUsed(this);
    this.onSorted = param => onSorted(this, param);
    this.onGrouped = param => onGrouped(this, param);
    this.uploadFileClicked = () => uploadFileClicked(this);
    this.tipClick = () => tipClick(this);
    this.getSortOptions = () => getSortOptions(t);
    this.getGroupOptions = () => getGroupOptions(t);
    this.onSelectFile = (files) => onSelectFile(this, files);
    this.addGroupElements = (groupTitle) => addGroupElements(this, groupTitle);
    this.addGroupElement = (groupTitle) => addGroupElement(this, groupTitle);

    this.checkUsageCount = (imageArr, imageUsedCountMap) => checkUsageCount(imageArr, imageUsedCountMap);

    const sortOptions = this.getSortOptions();
    const groupOptions = this.getGroupOptions();

    // 照片默认按照拍摄时间依次从旧到新进行排序. 即Date Taken (oldest to newest)
    const currentOption = sortOptions[0];

    const currentGroupOption = groupOptions[0];

    this.state = {
      uploadedImages,
      sortOptions,
      groupOptions,
      currentGroupOption,
      copyUploadedImages: uploadedImages,
      isHideUseChecked: isUsePhotoGroup,
      isNoneGroup: true,
      currentOption
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldElements = get(this.props, 'data.uploadedImages');
    const newElements = get(nextProps, 'data.uploadedImages');
    const oldImageUsedCountMap = get(this.props, 'data.imageUsedMap');
    const imagesUsedCountMap = get(nextProps, 'data.imageUsedMap');

    const isUsePhotoGroup = get(nextProps, 'data.isUsePhotoGroup');

    const { currentGroupOption, isNoneGroup } = this.state;


    if (!is(fromJS(oldElements), fromJS(newElements)) ||
      !is(oldImageUsedCountMap, imagesUsedCountMap)) {
      let newImages = this.checkUsageCount(merge([], newElements), imagesUsedCountMap.toJS());

      newImages = sortImages(newImages, this.state.currentOption);

      if (this.state.isHideUseChecked) {
        const nonUsedImages = newImages.filter((item) => {
          return item.usedCount === 0;
        });
        const groupedImages = (isUsePhotoGroup && isNoneGroup) ? groupImages(nonUsedImages, currentGroupOption.value) : nonUsedImages;
        this.setState({
          uploadedImages: groupedImages,
          copyUploadedImages: newImages
        });
      } else {
        const groupedImages = (isUsePhotoGroup && isNoneGroup) ? groupImages(newImages, currentGroupOption.value) : newImages;
        this.setState({
          uploadedImages: groupedImages,
          copyUploadedImages: newImages
        });
      }
    }
  }

  compo

  componentDidMount() {
    const { currentGroupOption, isNoneGroup } = this.state;
    const elements = get(this.props, 'data.uploadedImages');
    const imagesUsedCountMap = get(this.props, 'data.imageUsedMap');

    const isUsePhotoGroup = get(this.props, 'data.isUsePhotoGroup');

    let newImages = this.checkUsageCount(merge([], elements), imagesUsedCountMap.toJS());
    newImages.map((item) => {
      if (!item.shotTime) {
        item.shotTime = new Date().getTime();
      }
    });

    newImages = sortImages(newImages, this.state.currentOption);

    const groupedImages = (isUsePhotoGroup && isNoneGroup) ? groupImages(newImages, currentGroupOption.value) : newImages;

    this.setState({
      uploadedImages: groupedImages,
      copyUploadedImages: newImages
    });
  }

  render() {
    const { t, actions, data } = this.props;
    const {
      uploadedImages,
      copyUploadedImages,
      sortOptions,
      currentOption,
      groupOptions,
      currentGroupOption,
      isHideUseChecked,
      isNoneGroup
    } = this.state;
    const { boundImagesActions, boundProjectActions, toggleModal, boundTrackerActions } = actions;
    const { baseUrls, imageUsedCountMap, uploadStatus, useNewUpload, isUsePhotoGroup,userInfo } = data;

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

    const usePhotoGroup = isUsePhotoGroup && isNoneGroup;

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
        <SortAndFilter
          onToggleHideUsed={this.onToggleHideUsed}
          onSorted={this.onSorted}
          isHideUseChecked={isHideUseChecked}
          isShow={isFilterShow}
          sortOptions={sortOptions}
          currentOption={currentOption}
        />
        {
          isUsePhotoGroup ?
            <GroupImages
              onGrouped={this.onGrouped}
              isShow={isFilterShow}
              groupOptions={groupOptions}
              currentOption={currentGroupOption}
            /> : null
        }
        {
          copyUploadedImages && copyUploadedImages.length ? (
            <ImageList
              uploadedImages={uploadedImages}
              boundProjectActions={boundProjectActions}
              addGroupElements={this.addGroupElements}
              addGroupElement={this.addGroupElement}
              baseUrls={baseUrls}
              className={imageListClass}
              isUsePhotoGroup={usePhotoGroup}
              imageUsedCountMap={imageUsedCountMap}
              userInfo ={userInfo}
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
