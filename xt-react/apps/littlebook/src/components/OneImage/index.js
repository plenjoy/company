import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import XLoading from '../../../../common/ZNOComponents/XLoading';
import selected from './icon/selected.svg';
import selectHover from './icon/choose-hover.svg';

import './index.scss';

class OneImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      isImgLoading: true
    };
    this.photoSelected = this.photoSelected.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
  }
  photoSelected() {
    const { item, isVideo } = this.props.data;
    const { photoSelect } = this.props.actions;
    if (isVideo) {
      return;
    }
    photoSelect(item);
  }

  onImageError() {
    this.setState({
      isImgLoading: false
    });
  }
  onImageLoad() {
    this.setState({
      isImgLoading: false
    });
  }

  render() {
    const {
      item,
      isSelect,
      isDownloadOrDownloading,
      isVideo
    } = this.props.data;
    const selectedClass = classNames('wrap-image');

    const { isImgLoading } = this.state;

    const imgClass = classNames('item', {
      is_download: isDownloadOrDownloading
    });
    const titleSting = isVideo
      ? 'The filetype is not supported'
      : 'Shift + Click to select multiple photos';
    const allStyle = isVideo ? { opacity: '0.7' } : {};
    return (
      <div className={imgClass} onClick={this.photoSelected}>
        <XLoading isShown={isImgLoading} />
        <div className="img-box" title={titleSting}>
          <div>
            <img
              className="each-photo"
              src={get(item, 'thumbnail.url')}
              onLoad={this.onImageLoad}
              onError={this.onImageError}
            />
            {isVideo ? null : isSelect ? (
              <img className="selected-icon" src={selected} />
            ) : (
              <img className="selectedHover-icon" src={selectHover} />
            )}
          </div>
        </div>

        {isVideo || isSelect || isDownloadOrDownloading ?
          <div className="img-box-disabled" title={titleSting}></div>
        : null}
      </div>
    );
  }
}

export default OneImage;
