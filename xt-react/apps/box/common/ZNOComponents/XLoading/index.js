import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import classNames from 'classnames';
import './index.scss';


class XLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown } = this.props;
    const xLoadingStyle = classNames('x-loading', {
      show: isShown
    });

    const options = {
      lines: 13,
      length: 20,
      width: 10,
      radius: 30,
      scale: 0.20,
      corners: 1,
      color: '#f0f0f0',
      opacity: 0.22,
      rotate: 0,
      direction: 1,
      speed: 1,
      trail: 60,
      fps: 20,
      zIndex: 2e9,
      top: '50%',
      left: '-50%',
      shadow: false,
      hwaccel: false,
      position: 'absolute'
    };

    return (
      <div className={xLoadingStyle} data-html2canvas-ignore="true">
        <div className="load-mask" />
        <div className="load-content">
          <Loader loaded={false} options={options} />
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
