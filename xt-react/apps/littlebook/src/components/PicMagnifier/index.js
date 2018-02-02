import React, { Component, PropTypes } from 'react';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import { convertRotateImg } from '../../../../common/utils/image';
import './index.scss';

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
    const { isMagnifierShow, offset, orientation = 0 } = data;
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
    return (
      <div className="PicMagnifier" style={style}>
        <XLoading isShown={this.state.isImgLoading} />
        <img src={imageUrl} className="fill" />
        <img src={imageUrl}
             onLoad={this.hideLoading}
             onError={this.hideLoading} />
        <div className="arrow" style={arrowStyle}></div>
      </div>
    );
  }
}

PicMagnifier.proptype = {
  data: PropTypes.object
}

export default PicMagnifier;
