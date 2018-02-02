import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import { convertRotateImg } from '../../../../common/utils/image';
import './index.scss';
const MAX_LENGTH = 400;

class PicMagnifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgLoading: false,
      imageUrl: ''
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
      if (currentUrl) {
        // 明确标识不需要下载到本地或图片的orientation不存在时. 直接使用原来的图片地址即可.
        if (nextProps.data.isIgnore || !nextProps.data.orientation) {
          this.setState({
            isImgLoading: true,
            imageUrl: currentUrl
          });
        } else {
          convertRotateImg(nextProps.data.imageUrl, nextProps.data.orientation)
            .then((imageUrl) => {
              this.setState({
                isImgLoading: true,
                imageUrl
              });
            });
        }
      } else {
        this.setState({
          isImgLoading: false,
          imageUrl: ''
        });
      }
    }
  }

  render() {
    const { data } = this.props;
    const { isMagnifierShow, offset, name, pixel, width, height } = data;
    const { x, y, marginTop } = offset;
    const { imageUrl } = this.state;
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
      width: `${width}px`,
      height: `${height}px`
    };
    return (
      <div className="PicMagnifier" style={style}>
        <XLoading isShown={this.state.isImgLoading} />
        <img src={imageUrl} className="fill" style={imgStyle} />
        <img src={imageUrl}
             style={imgStyle}
             onLoad={this.hideLoading}
             onError={this.hideLoading} />
        {
          pixel ?
            (
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
            ) : null
        }
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
