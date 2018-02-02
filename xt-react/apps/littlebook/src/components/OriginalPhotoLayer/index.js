import React, { Component, PropTypes } from 'react';
import './index.scss';

class OriginalPhotoLayer extends Component {
  render() {
    const { isShown, x, y, imageUrl } = this.props;

    const layerStyle = {
      left: x,
      top: y
    };

    return isShown
      ? <div className="original-photo-layer" style={layerStyle}>
        <img src={imageUrl} />
      </div>
      : null;
  }
}

OriginalPhotoLayer.propTypes = {
  isShown: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired
};

export default OriginalPhotoLayer;
