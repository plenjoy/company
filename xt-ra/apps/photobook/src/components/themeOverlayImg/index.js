import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import XTextLoading from '../../../../common/ZNOComponents/XTextLoading';

import './index.scss';


class ThemeOverlayImg extends Component {
  constructor(props) {
    super(props);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.tryDown = this.tryDown.bind(this);
    this.state = {
      isImgLoading: true,
      showRefresh: false
    };
  }
  onImageLoad() {
    this.setState({
      isImgLoading: false,
      showRefresh: false
    });
  }

  onImageError() {
    this.setState({
      isImgLoading: false,
      showRefresh: true
    });
  }
  tryDown() {
    this.setState({
      showRefresh: false
    });
  }

  render() {
    const { src } = this.props;
    const { isImgLoading, showRefresh } = this.state;
    return (
      <div>
        <XTextLoading isShown={isImgLoading} hasText />
        {showRefresh ?
        (<div className="show-refresh" onClick={this.tryDown}>
          <div className="failed-text">Photo load failed.<br/> Click to retry</div>
        </div>)
         : null}
        {
          !showRefresh ?
            <img
              src={src}
              onLoad={this.onImageLoad}
              onError={this.onImageError}
            /> : null
      }
      </div>
    );
  }
}


export default ThemeOverlayImg;
