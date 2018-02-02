import React, { Component, PropTypes } from 'react';

import './index.scss';


class XImageCropCornerArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { outCrop, imageCornerRatios } = this.props;
    const { x, y, width, height } = outCrop;
    const containerStyle = {
      top: `${y}%`,
      left: `${x}%`,
      width: `${width}%`,
      height: `${height}%`
    };
    const topStyle = {
      height: `${imageCornerRatios.top}%`
    };
    const rightStyle = {
      width: `${imageCornerRatios.right}%`
    };
    const bottomStyle = {
      height: `${imageCornerRatios.bottom}%`
    };
    const leftStyle = {
      width: `${imageCornerRatios.left}%`
    };
    return (
      <div className="image-corner-area" style={containerStyle} >
        <div className="image-corner top" style={topStyle} ></div>
        <div className="image-corner right" style={rightStyle} ></div>
        <div className="image-corner bottom" style={bottomStyle} ></div>
        <div className="image-corner left" style={leftStyle} ></div>
      </div>);
  }
}

XImageCropCornerArea.propTypes = {

};

XImageCropCornerArea.defaultProps = {

};

export default XImageCropCornerArea;
