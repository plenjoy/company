import React, { Component, PropTypes } from 'react';

const OPACITY = 0.3;

const MAX_WIDTH = 300;
const MAX_HEIGHT = 300;

import './index.scss';

class ExchangeImage extends Component {
  render() {
    const { exchangeThumbnailRect, exchangeImageThumbnail } = this.props;
    const { x, y } = exchangeThumbnailRect;
    const { src } = exchangeImageThumbnail;
    const style = {
      left: `${x}px`,
      top: `${y}px`,
      width: `${MAX_WIDTH}px`,
      height: `${MAX_HEIGHT}px`,
      opacity: OPACITY
    };

    return (
      <div className="exchange-thumbnail" style={style}>
        <img src={src} />
      </div>
    );
  }
}

export default ExchangeImage;
