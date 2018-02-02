import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import { combine } from '../../utils/url';
import { convertRotateImg } from '../../../../common/utils/image';
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

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const { imageObj, deleteImage, isSelected } = this.props;
    const { name, usedCount, imageId, guid } = imageObj;

    const selectedClass = classNames('wrap-image', {
      selected: isSelected
    });

    const { isImgLoading, imageUrl } = this.state;

    return (
      <div className="image-item">
        <div
          className={selectedClass}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.stopEvent}
          data-guid={guid}
        >
          <div className="loaded-image">
            <XLoading isShown={isImgLoading} />

            <div className="loaded-image-item">
              <img
                className="preview-image"
                src={imageUrl}
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
