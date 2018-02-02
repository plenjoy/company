import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Loader from 'react-loader';

import './index.scss';

class TextPreviewBox extends Component {

  constructor(props) {
    super(props);

    this.onLoad = this.onLoad.bind(this);

    this.state = {
      isLoaded: true
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldImageSrc = this.props.imageSrc;
    const newImageSrc = nextProps.imageSrc;

    if (oldImageSrc !== newImageSrc) {
      this.setState({
        isLoaded: false
      });

      if (!newImageSrc) {
        this.setState({
          imgWidth: 0,
          imgHeight: 0
        });
      }
    }
  }

  onLoad(e) {
    this.setState({
      imgWidth: e.target.naturalWidth,
      imgHeight: e.target.naturalHeight,
      isLoaded: true
    });
  }

  renderPreviewBox() {
    const { imageSrc, backgroundColor } = this.props;
    const options = {
      lines: 13,
      length: 20,
      width: 10,
      radius: 30,
      scale: 0.12,
      corners: 1,
      color: '#7b7b7b',
      opacity: 0.25,
      rotate: 0,
      direction: 1,
      speed: 1,
      trail: 60,
      fps: 20,
      zIndex: 2e9,
      top: '50%',
      left: '-36%',
      shadow: false,
      hwaccel: false,
      position: 'absolute'
    };

    const { previewImgPosition, isLoaded } = this.state;

    const imgStyle = {
      backgroundColor
    };

    const resultHtml = [];

    if (imageSrc) {
      if (!isLoaded) {
        resultHtml.push(
          <div className="load-container" key="0">
            <div className="load-mask" />
            <div className="load-content">
              <Loader loaded={isLoaded} options={options} />
              Loading
            </div>
          </div>
        );
      }
      resultHtml.push(
        <img
          key="1"
          src={imageSrc}
          alt=""
          className="preview-img"
          style={imgStyle}
          draggable="false"
          onLoad={this.onLoad}
        />
      );
    } else {
      resultHtml.push(
        <div className="no-preview" key="2">
          No Preview available
        </div>
      );
    }

    return resultHtml;
  }


  render() {
    const { imgWidth, imgHeight } = this.state;
    const {
      maxImgContainerWidth,
      maxImgContainerHeight,
      initImgContainerWidth,
      initImgContainerHeight,
      backgroundColor
    } = this.props;
    const imgContainerClass = classNames('img-container');

    // 为了解决浏览器渲染时边框的模糊或者消失 如果高度为基数则加1像素
    let imgContainerHeight = imgHeight || initImgContainerHeight;
    if (imgContainerHeight % 2 > 0) {
      imgContainerHeight++;
    }

    const imgContainerStyle = {
      width: imgWidth || initImgContainerWidth,
      height: imgContainerHeight,
      maxHeight: maxImgContainerHeight,
      maxWidth: maxImgContainerWidth,
      border: (imgWidth && imgHeight) ? '1px dashed #7b7b7b' : 'none',
      overflow: 'hidden'
    };

    return (
      <div className="text-preview-box">
        <div
          className={imgContainerClass}
          style={imgContainerStyle}
          ref={(div) => { this.imgContainer = div; }}
        >
          {this.renderPreviewBox()}
        </div>
      </div>
    );
  }
}

TextPreviewBox.propTypes = {
  imageSrc: PropTypes.string,
  maxImgContainerWidth: PropTypes.number,
  maxImgContainerHeight: PropTypes.number,
  initImgContainerWidth: PropTypes.number,
  initImgContainerHeight: PropTypes.number
};

TextPreviewBox.defaultProps = {
  maxImgContainerWidth: 720,
  maxImgContainerHeight: 262,
  initImgContainerHeight: 100,
  initImgContainerWidth: 720
};

export default TextPreviewBox;
