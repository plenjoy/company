import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import './index.scss';
const MAX_LENGTH = 400;

class PicMagnifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgLoading: false
    }

    this.hideLoading = this.hideLoading.bind(this);
  }

  hideLoading() {
    this.setState({
      isImgLoading: false
    });
  }

  componentWillReceiveProps(nextProps) {
    const oldUrl = this.props.data.imageUrl;
    const currentUrl = nextProps.data.imageUrl;
    if (oldUrl !== currentUrl) {
      this.setState({
        isImgLoading: true
      });
    }
  }

  render() {
    const { data } = this.props;
    const { isMagnifierShow, imageUrl, offset, name, pixel, width, height } = data;
    const { x, y, marginTop } = offset;
    const style = {
      display: isMagnifierShow ? 'block' : 'none',
      left: x +'px',
      top: y + 'px',
    };
    const arrowStyle = {
      marginTop: marginTop*2/3 + 'px'
    };
    const extraClass = classNames('extra-info', {
      'removeFloat': width / height < 0.5
    });
    const imgStyle = {
      width: width >= height ? `${MAX_LENGTH}px` : 'auto',
      height: height >= width ? `${MAX_LENGTH}px` : 'auto'
    };
    return (
      <div className="PicMagnifier" style={style}>
        <XLoading isShown={this.state.isImgLoading} />
        <img src={imageUrl} className="fill" style={imgStyle} />
        <img src={imageUrl}
             style={imgStyle}
             onLoad={this.hideLoading}
             onError={this.hideLoading} />
        <div className={extraClass}>
          <div className="image-name" title={name}>
            {
              name ? (name.length <= 20 ? name : `${name.substr(0, 10)}...${name.substr(name.length - 7)}`) : ''
            }
          </div>
          <div className="image-size">
            { pixel }
          </div>
        </div>
        <div className="arrow" style={arrowStyle}></div>
        <div className="arrow-filter" style={arrowStyle}></div>
      </div>
    );
  }
}

PicMagnifier.proptype = {
  data: PropTypes.object
}

export default PicMagnifier;
