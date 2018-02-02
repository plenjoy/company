import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import OAuth from '../../../../common/utils/OAuth';
import { merge, get } from 'lodash';
import { is, fromJS } from 'immutable';
import facebookIcon from './icon/facebook.svg';
import googleIcon from './icon/google.svg';
import instagramIcon from './icon/Instagram.svg';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import XAlert from '../../../../common/ZNOComponents/XAlert';
import SortAndFilter from '../SortAndFilter';
import ImageList from '../ImageList';
import { oAuthTypes } from '../../contants/strings';


import {
  onToggleHideUsed,
  onSorted,
  uploadFileClicked,
  checkUsageCount,
  tipClick,
  sortImages,
  getSortOptions
} from './handler';
import emptyIcon from './icon/empty.svg';

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
    const oldImageUsedCountMap = get(this.props, 'data.imageUsedCountMap');
    const imagesUsedCountMap = get(nextProps, 'data.imageUsedCountMap');

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
    const imagesUsedCountMap = get(this.props, 'data.imageUsedCountMap');
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
    const { boundImagesActions, boundProjectActions, toggleModal, login } = actions;
    const { baseUrls, imageUsedCountMap,userInfo } = data;

    const isFilterShow = !!copyUploadedImages.length;

    return (
      <div className="PhotoTab">
        <XFileUpload
          className="add-photo"
          multiple="multiple"
          boundUploadedImagesActions={boundImagesActions}
          toggleModal={toggleModal}
          ref={fileUpload => this.fileUpload = fileUpload}
          uploadFileClicked={this.uploadFileClicked}
        >
          { t('ADD_PHOTOS') }
        </XFileUpload>
        <div className="auth">
          <span className="text">Add photos from:</span>
          <img src={facebookIcon} onClick={() => login('facebook')} />
          <img src={instagramIcon} onClick={() => login('instagram')} />
          <img className="sidebar-google-icon" src={googleIcon} onClick={() => login('google')} />
        </div>
        <SortAndFilter
          onToggleHideUsed={this.onToggleHideUsed}
          onSorted={this.onSorted}
          isShow={isFilterShow}
          sortOptions={sortOptions}
          currentOption={currentOption}
        />

        {
          copyUploadedImages && copyUploadedImages.length ? (
            <ImageList
              uploadedImages={uploadedImages}
              boundProjectActions={boundProjectActions}
              baseUrls={baseUrls}
              userInfo={userInfo}
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
