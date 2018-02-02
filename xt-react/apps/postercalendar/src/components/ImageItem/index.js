import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { convertRotateImg } from '../../../../common/utils/image';
import { combine } from '../../utils/url';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XDeleteIcon from '../../../../common/ZNOComponents/XDeleteIcon';
import XUsageCount from '../../../../common/ZNOComponents/XUsageCount';
import { handleMouseOver, handleMouseOut, handleImageName, handleMouseDown, lazyLoadingImage, imgLoaded, imgErrored } from './handler';

import './index.scss';


class ImageItem extends Component {
  constructor(props) {
    super(props);

    this.handleMouseOver = () => handleMouseOver(this);
    this.handleMouseOut = () => handleMouseOut(this);
    this.imgLoaded = () => imgLoaded(this);
    this.imgErrored = () => imgErrored(this);
    this.handleImageName = name => handleImageName(name);
    this.handleMouseDown = event => handleMouseDown(this, event);

    this.state = {
      src: null,
      isImgLoading: true
    };
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


  shouldComponentUpdate(nextProps, nextState) {
    const oldImgUrl = get(this.props, 'imageObj.src');
    const newImgUrl = get(nextProps, 'imageObj.src');
    const oldCount = get(this.props, 'imageObj.usedCount');
    const newCount = get(nextProps, 'imageObj.usedCount');
    const oldImgLoading = get(this.state, 'isImgLoading');
    const newImgLoading = get(nextState, 'isImgLoading');
    if (oldImgUrl === newImgUrl && oldCount === newCount && oldImgLoading === newImgLoading ) {
      return false;
    }

    return true;
  }

  render() {
    const { imageObj, deleteImage,  } = this.props;
    const { name, usedCount, imageId, guid, src } = imageObj;

    const selectedClass = classNames('wrap-image');

    const { isImgLoading,imageUrl } = this.state;

    // const src = [url,'&rendersize=fit140'].join('');
    // const src = combine(url,'','&rendersize=fit140');
    return (
      <div className="image-item">
        <div
          className={selectedClass}
          onMouseUp={this.handleMouseDown}
          data-guid={guid}
        >
          <div className="loaded-image">
            <XLoading isShown={isImgLoading} />
            <div className="loaded-image-item">
              <img
                className="preview-image"
                src={imageUrl}
                id={`img-${guid}`}
                onLoad={this.imgLoaded}
                onError={this.imgErrored}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
              />
              {
                usedCount ? (<XUsageCount count={usedCount} />) : null
              }

              {
                !usedCount ? (
                  <XDeleteIcon onClicked={deleteImage} />
                ) : null
              }
            </div>
          </div>
        </div>
        <div
          className="preview-image-tip"
          title={name}
        />
      </div>
    );
  }
}


export default ImageItem;
