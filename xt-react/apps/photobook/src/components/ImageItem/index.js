import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { convertRotateImg } from '../../../../common/utils/image';

import add from './add.svg';

import { combine } from '../../utils/url';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XDeleteIcon from '../../../../common/ZNOComponents/XDeleteIcon';
import XUsageCount from '../../../../common/ZNOComponents/XUsageCount';

import { handleMouseOver, handleMouseOut, handleImageName, handleMouseDown, lazyLoadingImage, imgLoaded, imgErrored } from './handler';

import './index.scss';


class ImageItem extends Component {
  constructor(props) {
    super(props);

    this.handleMouseOver = (ev) => {
      const event = ev || window.event;
      event.stopPropagation();

      this.setState({ isShown: true });
      handleMouseOver(this);
    };
    this.handleMouseOut = (ev) => {
      const event = ev || window.event;
      event.stopPropagation();

      this.setState({ isShown: false });
      handleMouseOut(this);
    };
    this.imgLoaded = () => imgLoaded(this);
    this.imgErrored = () => imgErrored(this);
    this.handleImageName = name => handleImageName(name);
    this.handleMouseDown = event => handleMouseDown(this, event);

    this.state = {
      imageUrl: null,
      isImgLoading: true,

      // 是否显示添加的按钮.
      isShown: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldImgUrl = get(this.state, 'imageUrl');
    const newImgUrl = get(nextState, 'imageUrl');
    const oldCount = get(this.props, 'imageObj.usedCount');
    const newCount = get(nextProps, 'imageObj.usedCount');
    const oldImgLoading = get(this.state, 'isImgLoading');
    const newImgLoading = get(nextState, 'isImgLoading');

    const oldAddIsShown = get(this.state, 'isShown');
    const newAddIsShown = get(nextState, 'isShown');

    if (oldImgUrl === newImgUrl &&
        oldCount === newCount &&
        oldImgLoading === newImgLoading &&
        oldAddIsShown === newAddIsShown) {
      return false;
    }

    return true;
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

  render() {
    const { imageObj, deleteImage, addGroupElement, isUsePhotoGroup = false } = this.props;
    const { name, usedCount, imageId, guid } = imageObj;

    const selectedClass = classNames('wrap-image');
    const { isImgLoading, imageUrl } = this.state;

    const previewImageStyle = {
      // transform: `rotate(${imageObj.orientation || 0}deg)`
    };

    const addIconClass = classNames('add', {
      show: this.state.isShown
    });

    // const src = [url,'&rendersize=fit140'].join('');
    // const src = combine(url,'','&rendersize=fit140');
    return (
      <div className="image-item"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <img src={add} width="16px" height="16px" draggable="false" className={addIconClass} onClick={addGroupElement.bind(this, imageObj)} />
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
                style={previewImageStyle}
                src={imageUrl}
                id={`img-${guid}`}
                onLoad={this.imgLoaded}
                onError={this.imgErrored}
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
