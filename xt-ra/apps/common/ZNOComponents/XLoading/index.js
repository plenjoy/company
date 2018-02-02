import React, { Component, PropTypes } from 'react';
import loadImg from './icon/loading-3.svg';
import bigLoadImg from './icon/loading-1.svg';
import Loader from 'react-loader';
import classNames from 'classnames';
import './index.scss';


class XLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, hasText, zIndex } = this.props;
    const xLoadingStyle = classNames('x-loading', {
      show: isShown
    });

    const loadStyle = {
      zIndex: zIndex || 2e9
    };


    const maskStyle = {};
    if (zIndex) {
      maskStyle.zIndex = zIndex;
    }

    const loadImgUrl = hasText ? bigLoadImg : loadImg;

    return (
      <div className={xLoadingStyle} data-html2canvas-ignore="true" style={maskStyle}>
        <div className="load-mask" style={maskStyle} />
        <div className="load-content" style={loadStyle}>
          <img src={loadImgUrl} />
        </div>
      </div>
    );
  }
}

XLoading.propTypes = {
  isShown: PropTypes.bool.isRequired
};

XLoading.defaultProps = {
  isShown: true
};

export default XLoading;
