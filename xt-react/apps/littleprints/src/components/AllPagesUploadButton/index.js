import { get } from 'lodash';
import React, { Component } from 'react';
import classNames from 'classnames';

import { limitedPageNum } from '../../constants/strings';

import './index.scss';
import addPhotoImage from './add-normal.svg';
import addPhotoImageofHover from './add-hover.svg';

class AllPagesUploadButton extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {
      onAddPhotos,
      usefullPageNum,
      size
    } = this.props;

    const containerClass = classNames('add-photo-button-wrap', {
      center: !usefullPageNum,
      float: usefullPageNum
    });
    const containerWidth = get(size, 'renderInnerSize.width');
    const containerHeight = get(size, 'renderInnerSize.height');
    const sheetWithoutBleedWidth = get(size, 'renderInnerSheetSizeWithoutBleed.width');
    const sheetWithoutBleedHeight = get(size, 'renderInnerSheetSizeWithoutBleed.height');
    const containerStyle = {
      width: `${Math.max(containerWidth, containerHeight)}px`,
      height: `${Math.max(containerWidth, containerHeight)}px`
    };
    const innerContainerStyle = {
      width: `${Math.min(sheetWithoutBleedWidth, sheetWithoutBleedHeight)}px`,
      height: `${Math.max(sheetWithoutBleedWidth, sheetWithoutBleedHeight)}px`,
      margin: `${(parseInt(containerStyle.height) - Math.max(sheetWithoutBleedWidth, sheetWithoutBleedHeight))/2}px auto`
    };
    return (
      <div className={containerClass} style={containerStyle}>
        <div className="inner-container" style={innerContainerStyle} onClick={onAddPhotos}>
          <div className="add-photo-content">
            <img src={addPhotoImage} />
            <span>Click to add {limitedPageNum - usefullPageNum} photo(s)</span>
          </div>
        </div>
      </div>
    )
  }
}

export default AllPagesUploadButton;
