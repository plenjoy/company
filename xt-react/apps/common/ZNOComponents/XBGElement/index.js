import React, { Component, PropTypes } from 'react';
import { drawRect, drawTextInCenter, clear , drawImage} from '../../utils/draw';
import XHandler from '../XHandler';
import classNames from 'classnames';
import './index.scss';

export default class XBGElement extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { bgColor, canvasId, width, height, textInCenter } = this.props;

    // 绘制背景
    clear(canvasId, 0, 0, width, height);
    drawRect(canvasId, bgColor, 0, 0, width, height, false, 0);
  }

  handleMouseOver() {
    const { isHide } = this.props;
  }

  render() {
    const { className, children, canvasId, width, height, handleClick, isHide, isHideUploadIcon } = this.props;
    const customClass = classNames('x-bg-element', className, {hide: isHide});

    const uploadIcon = require('./upload-icon.svg');
    let imageWidth = width / 6;
    let imageHeight = width / 6;

    imageWidth = imageWidth > 200 ? 200 : (imageWidth < 140 ? 140 : imageWidth);
    imageHeight = imageHeight > 200 ? 200 : (imageHeight < 140 ? 140 : imageHeight);

    const uploadIconStyle = {
      position: 'absolute',
      width: imageWidth + 'px',
      height: imageHeight + 'px',
      left: ((width - imageWidth) / 2) + 'px',
      top: ((height - imageHeight) / 2) + 'px',
      display: isHideUploadIcon ? 'none' : 'block'
    };

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        <img src={uploadIcon} className="upload-icon" style={uploadIconStyle}/>
        <XHandler handleClick={handleClick}
                  cursor={"pointer"}
                  handleMouseOver={this.handleMouseOver.bind(this)}/>
        {children}
      </div>
    );
  }
}

XBGElement.propTypes = {
  canvasId: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,

  // 是否隐藏整个bgelement
  isHide: PropTypes.bool,

  // 是否隐藏上传图片
  isHideUploadIcon: PropTypes.bool
};
