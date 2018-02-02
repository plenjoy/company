import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import './index.scss';

class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blobSrc: null,
      isImgLoading: false
    };
  }

  componentDidMount() {
    const imageUrl = this.getElementUrl(this.props);
    this.getImageFromPool(imageUrl);
  }

  componentWillReceiveProps(nextProps) {
    const imageUrl = this.getElementUrl(this.props);
    const nextImageUrl = this.getElementUrl(nextProps);

    if(imageUrl !== nextImageUrl) {
      this.getImageFromPool(nextImageUrl);
    }
  }

  getElementUrl(props) {
    const { t, data, actions } = props;
    const { element } = data;
    const computedSize = element.get('computedSize');
    const photoSize = computedSize.get('photoSize');
    return photoSize.get('url');
  }

  getImageFromPool(imageUrl) {
    imagePool.load(imageUrl, {
      success: blobSrc => this.setState({ blobSrc, isImgLoading: false }),
      error: blobSrc => this.setState({ isImgLoading: false })
    });
  }

  render() {
    const { t, data, actions } = this.props;
    const { element } = data;

    const computedSize = element.get('computedSize');
    const photoSize = computedSize.get('photoSize');

    const elementStyle = {
      top: computedSize.get('y'),
      left: computedSize.get('x'),
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    const photoStyle = {
      top: photoSize.get('y'),
      left: photoSize.get('x'),
      width: photoSize.get('width'),
      height: photoSize.get('height')
    };

    return (
      <div className="photo-element" style={elementStyle}>
        <img className="photo-element-photo" style={photoStyle} src={this.state.blobSrc} />
      </div>
    );
  }
}

PhotoElement.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PhotoElement')(PhotoElement);
