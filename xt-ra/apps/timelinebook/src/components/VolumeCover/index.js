import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import * as materials from '../../sources/material';

import './index.scss';

class VolumeCover extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      coverUrl,
      coverType,
      width = 200,
      height = 200,
      className = '',
      isFullOfPhoto = false,
      bgColor = 'white'
    } = this.props;

    const VolumeCoverContainerStyle = { width, height };
    let coverBgImage;

    switch(bgColor) {
      case 'gray':
        coverBgImage = materials[coverType]['6X6'].frontCoverGray;
        break;
      case 'white':
      default:
        coverBgImage = materials[coverType]['6X6'].frontCover;
    }

    const ratioX = width / coverBgImage.width;
    const ratioY = height / coverBgImage.height;
    const ratio = ratioX > ratioY ? ratioX : ratioY;

    // 素材图可视区
    const bgWidth = coverBgImage.width * ratio;
    const bgHeight = coverBgImage.height * ratio;

    const backgroundImageStyle = {
      width: bgWidth,
      height: bgHeight,
      top: (height - bgHeight) / 2 * ratio,
      left: (width - bgWidth) / 2 * ratio,
      zIndex: isFullOfPhoto ? 1 : 0
    };

    const coverImageStyle = !isFullOfPhoto
      ? {
        top: ((coverBgImage.height - coverBgImage.imageHeight - coverBgImage.top - coverBgImage.bottom) / 2 + coverBgImage.top) * ratio,
        left: (coverBgImage.left + coverBgImage.spineExpand + (coverBgImage.width - coverBgImage.left - coverBgImage.right - coverBgImage.spineExpand - coverBgImage.imageWidth) / 2) * ratio,
        width: coverBgImage.imageWidth * ratio,
        height: coverBgImage.imageHeight * ratio
      } : {
        top: 0,
        left: 0,
        width: bgWidth,
        height: bgHeight
      };

    const containerClass = classNames('volume-cover-container', className);

    return (
      <div className={containerClass} style={VolumeCoverContainerStyle}>
        <img className="volume-cover-backgroundImage" style={backgroundImageStyle} src={coverBgImage.url} />
        <div className="volume-cover-image" style={coverImageStyle}>
          <img src={coverUrl} />
        </div>
      </div>
    );
  }
}

VolumeCover.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('VolumeCover')(VolumeCover);
