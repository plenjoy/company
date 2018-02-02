import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import { merge, get, isEqual, isNumber } from 'lodash';
import Immutable from 'immutable';

import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import XButton from '../../../../common/ZNOComponents/XButton';

import SortAndFilter from '../SortAndFilter';
import ImageList from '../ImageList';

import { onToggleHideUsed, onSorted, uploadFileClicked } from './handler';

import './index.scss';


class PhotoTab extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    let { uploadedImages } = data;
    uploadedImages = uploadedImages.map((item) => {
      return merge({}, item, {
        usedCount: 0,
        uploadTime: new Date().getTime()
      });
    });
    this.state = {
      uploadedImages,
      copyUploadedImages: uploadedImages,
      isHideUseChecked: false,
      sortValue: '<,uploadTime'
    };

    this.onToggleHideUsed = () => onToggleHideUsed(this);
    this.onSorted = param => onSorted(this, param);
    this.uploadFileClicked = () => uploadFileClicked(this);
  }

  getNewElements(oldElements, newElements) {
    const oldImageIds = [];
    oldElements.map((element) => {
      oldImageIds.push(element.id);
    });
    return newElements.filter((element) => {
      return oldImageIds.indexOf(element.id) === -1;
    });
  }

    /**
   * 设置图片的使用次数.
   * @param imageArr 图片数组
   * @param imageUsedMap 包含使用次数的对象.
   */
  checkUsageCount(imageArr, imageUsedMap) {
    if (imageArr && imageArr.length) {
      imageArr.forEach((v) => {
        const count = imageUsedMap && imageUsedMap[v.encImgId] ? imageUsedMap[v.encImgId] : 0;
        v.usedCount = count;
        v.uploadedImages = new Date().getTime();
      });
    }

    return imageArr;
  }

  componentWillReceiveProps(nextProps) {
    const oldElements = get(this.props, 'data.uploadedImages');
    const newElements = get(nextProps, 'data.uploadedImages');
    const oldImageUsedMap = get(this.props, 'data.imageUsedMap');
    const imagesUsedMap = get(nextProps, 'data.imageUsedMap');
    if (oldElements != newElements || oldImageUsedMap != imagesUsedMap) {
      const newImages = this.checkUsageCount(merge([], newElements), imagesUsedMap.toJS());
      newImages.map((item) => {
        if (!item.shotTime) {
          item.shotTime = new Date().getTime();
        }
      });
      const valueArr = this.state.sortValue.split(',');

      const diffTag = valueArr[0];
      const realValue = valueArr[1];
      newImages.sort((a, b) => {
        switch (diffTag) {
          case '<' : {
            if (realValue === 'name') {
              return (b[realValue]).localeCompare(a[realValue]);
            }
            return b[realValue] - a[realValue];
          }
          default : {
            if (realValue === 'name') {
              return (a[realValue]).localeCompare(b[realValue]);
            }
            return a[realValue] - b[realValue];
          }
        }
      });

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
    const imagesUsedMap = get(this.props, 'data.imageUsedMap');
    const newImages = this.checkUsageCount(merge([], elements), imagesUsedMap.toJS());
    newImages.map((item) => {
      if (!item.shotTime) {
        item.shotTime = new Date().getTime();
      }
    });
    const valueArr = this.state.sortValue.split(',');

    const diffTag = valueArr[0];
    const realValue = valueArr[1];
    newImages.sort((a, b) => {
      switch (diffTag) {
        case '<' : {
          if (realValue === 'name') {
            return (b[realValue]).localeCompare(a[realValue]);
          }
          return b[realValue] - a[realValue];
        }
        default : {
          if (realValue === 'name') {
            return (a[realValue]).localeCompare(b[realValue]);
          }
          return a[realValue] - b[realValue];
        }
      }
    });
    this.setState({
      uploadedImages: newImages,
      copyUploadedImages: newImages
    });
  }

  render() {
    const { t, actions, data } = this.props;
    const { uploadedImages, isHideUseChecked, copyUploadedImages } = this.state;
    const { boundImagesActions, boundProjectActions, toggleModal } = actions;
    const { baseUrls, imageUsedMap, allImages,userInfo } = data;
    const isFilterShow = !!copyUploadedImages.length;
    return (
      <div className="PhotoTab">
        <XFileUpload
          className="add-photo"
          multiple="multiple"
          inputId="file-upload"
          boundUploadedImagesActions={boundImagesActions}
          toggleModal={toggleModal}
          uploadFileClicked={this.uploadFileClicked}
        >
          { t('ADD_PHOTOS') }
        </XFileUpload>
        <SortAndFilter
          onToggleHideUsed={this.onToggleHideUsed}
          onSorted={this.onSorted}
          isShow={isFilterShow}
        />
        {
          allImages && allImages.size
            ? <ImageList
              uploadedImages={uploadedImages}
              boundProjectActions={boundProjectActions}
              baseUrls={baseUrls}
              imageUsedMap={imageUsedMap}
              userInfo ={userInfo}
            />
            : <label
              className="empty-list-tip"
              htmlFor="file-upload"
            >{ t('ADD_PHOTOS_TIP') }</label>
        }

      </div>
    );
  }
}

PhotoTab.proptype = {

};

export default translate('PhotoTab')(PhotoTab);
