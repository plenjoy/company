import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { combine } from '../../utils/url';
import classNames from 'classnames';
import { convertRotateImg } from '../../../../common/utils/image';
import './index.scss';


class ImageItem extends Component{
  constructor(props){
    super(props)
     this.state = {
      src: null,
      isImgLoading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldUrl = get(this.props, 'imageObj.src');
    const currentUrl = get(nextProps, 'imageObj.src');
    const orientation = get(nextProps, 'imageObj.orientation');
    if (oldUrl !== currentUrl) {
      if (currentUrl) {
        if (orientation) {
          convertRotateImg(currentUrl, orientation)
            .then((imageUrl) => {
              this.setState({
                imageUrl,
                isImgLoading: false
              });
            });
        } else {
          this.setState({
            imageUrl: currentUrl,
            isImgLoading: false
          });
        }
      } else {
        this.setState({
          imageUrl: '',
          isImgLoading: false
        });
      }
    }
  }

  componentDidMount() {
    const { imageObj } = this.props;
    const { src, orientation } = imageObj;
    if (src) {
      if (orientation) {
        convertRotateImg(src, orientation)
          .then((imageUrl) => {
            this.setState({
              imageUrl,
              isImgLoading: false
            });
          });
      } else {
        this.setState({
          imageUrl: src,
          isImgLoading: false
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldImgUrl = get(this.state, 'imageUrl');
    const newImgUrl = get(nextState, 'imageUrl');
    const oldCount = get(this.props, 'imageObj.usedCount');
    const newCount = get(nextProps, 'imageObj.usedCount');
    const oldImgLoading = get(this.state, 'isImgLoading');
    const newImgLoading = get(nextState, 'isImgLoading');
    const oldSelected = get(this.props, 'isSelected');
    const newSelected = get(nextProps, 'isSelected');
    if (oldImgUrl === newImgUrl && oldCount === newCount && oldImgLoading === newImgLoading && oldSelected === newSelected) {
      return false;
    }

    return true;
  }

  handleImageName(name) {
    return name = name.length > 15 ? name.substr(0,5) + "..." + name.substr(name.length-6) : name;
  }

  render() {
    const { imageObj, deleteImage } = this.props;
    const { isImgLoading, imageUrl } = this.state;
    const { name, src, usedCount, imageId } = imageObj;
    const countIconClass = classNames('icon-count',{
      'hide' : usedCount===0
    })
    const deleteIconClass = classNames('icon-delete',{
      'show' : usedCount!==0
    })
    // const src = [url,'&rendersize=fit140'].join('');
    //const src = combine(url,'','&rendersize=fit140');
    return (
      <div className="image-item">
        <div className="wrap-image">
          <div className="loaded-image">
            <img
              className="preview-image"
              src={imageUrl}
            />
            <div className={countIconClass}>
              <span>{ usedCount }</span>
            </div>
            <div
              className={ deleteIconClass }
              title="delete"
              onClick={ deleteImage }
            >
            </div>
          </div>
        </div>
        <div
          className="preview-image-tip"
          title={name}>
          {
            this.handleImageName(name)
          }
        </div>
      </div>
    );
  }
}


export default ImageItem;
