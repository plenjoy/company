import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import LazyLoad from 'react-lazy-load';
import selectedIcon from './assets/selectedIcon.svg';
import noImage from './assets/noImage.svg';

import './index.scss';

class ImageGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImageLoaded: false
    };
  }

  showImage() {
    this.setState({
      isImageLoaded: true
    });
  }

  render() {
    const {
      t,
      src,
      gridWidth,
      gridHeight,
      imageWidth,
      imageHeight,
      className,
      onClick,
      title
    } = this.props;

    let width = 0;
    let height = 0;

    const ratioH = gridHeight / imageHeight;

    height = gridHeight;
    width = imageWidth * ratioH;

    const imageGridStyle = {
      width,
      height
    };

    const imageStyle = {
      position: 'absolute',
      width: '100%',
      top: 0
    };

    const imageGridClass = classNames('image-grid', className);
    const imageClass = classNames('image', {
      hide: !this.state.isImageLoaded
    });
    const noImageClass = classNames('image-loading', {
      hide: this.state.isImageLoaded
    });
    const paddingStyle = {
      display: 'block',
      paddingBottom: `${height/width*100}%`
    };

    return (
      <div className={imageGridClass}>
        <LazyLoad width="100%" style={imageStyle}>
          <img className={imageClass} src={src} style={imageStyle} onLoad={this.showImage.bind(this)}/>
        </LazyLoad>
        <img className={noImageClass} src={noImage} />
        <i style={paddingStyle}></i>

        <div className="handler" onClick={event => onClick(event)} title={title}>
          <img className="selectedIcon" src={selectedIcon} />
        </div>
      </div>
    );
  }
}

ImageGrid.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('ImageGrid')(ImageGrid);
