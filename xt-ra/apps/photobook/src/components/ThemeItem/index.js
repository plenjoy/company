import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import * as handler from './handler.js';
import classNames from 'classnames';
import './index.scss';
import XTextLoading from '../../../../common/ZNOComponents/XTextLoading';

class ThemeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgLoading: true,
      isActived: false
    };
    this.onClicked = this.onClicked.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onImageLoad() {
    this.setState({
      isImgLoading: false
    });
  }

  onImageError() {
    this.setState({
      isImgLoading: false
    });
  }

  onClicked() {
    const { theme, onClicked } = this.props;
    onClicked && onClicked(theme);
  }
  onMouseOver() {
    this.setState({
      isActived: true
    });
  }
  onMouseOut() {
    this.setState({
      isActived: false
    });
  }

  render() {
    let { theme, style, isActived } = this.props;
    const { isImgLoading } = this.state;
    isActived = isActived || this.state.isActived;
    const itemClass = classNames('theme-item', {
      active: isActived
    });

    return (
      <div
        className={itemClass}
        onClick={this.onClicked}
        style={style}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <XTextLoading isShown={isImgLoading} hasText />
        <img
          className="img"
          src={theme.get('coverScreenshot')}
          onLoad={this.onImageLoad}
          onError={this.onImageError}
        />
        <span className="title" title={theme.get('themeTitle')}>{theme.get('themeTitle')}</span>
      </div>
    );
  }
}

ThemeItem.proptype = {
};

export default ThemeItem;
