import classNames from 'classnames';
import React, { Component } from 'react';

import uploadIcon from './upload-icon.svg';

class BgUploadImage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { viewWidth, viewHeight, hasImage } = this.props;
    const bgCloudClass = classNames('bg-cloud', { hide: hasImage });

    let imageWidth = viewWidth / 6;
    let imageHeight = viewHeight / 6;

    imageWidth = imageWidth > 200 ? 200 : (imageWidth < 140 ? 140 : imageWidth);
    imageHeight = imageHeight > 200 ? 200 : (imageHeight < 140 ? 140 : imageHeight);

    const imageSize = Math.max(imageWidth, imageHeight) > Math.min(viewWidth, viewHeight)
      ? Math.min(viewWidth, viewHeight)
      : Math.max(imageWidth, imageHeight);

    const uploadIconStyle = {
      position: 'absolute',
      width: `${imageSize}px`,
      height: `${imageSize}px`,
      left: `${(viewWidth - imageSize) / 2}px`,
      top: `${(viewHeight - imageSize) / 2}px`,
    };

    return (
      <img
        className={bgCloudClass}
        src={uploadIcon}
        style={uploadIconStyle}
      />
    );
  }
}

export default BgUploadImage;
