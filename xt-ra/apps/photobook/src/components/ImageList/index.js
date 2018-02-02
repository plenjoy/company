import React, { Component, PropTypes } from 'react';
// import SortAndFilter from '../SortAndFilter';
import ImageItem from '../ImageItem';
import { combine } from '../../../../common/utils/url';
import { set, get, template, isEqual } from 'lodash';
import { IMAGE_SRC } from '../../contants/apiUrl';
import XDrag from '../../../../common/ZNOComponents/XDrag';
import PicMagnifier from '../PicMagnifier';
import Selection from '../Selection';
import LazyLoad from 'react-lazy-load';
import classNames from 'classnames';
import add from './add.svg';
import {
  convertImageData,
  convertGroupImageData,
  onOverImageItem,
  onOutImageItem,
  toggleImageItemSelected,
  onImageListDown,
  onDragStarted,
  deleteImage,
  onSelect,
  addGroupElement,
  addGroupElements,
  onSelectStop
} from './handler';
import './index.scss';

class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      magnifierParams: {
        isMagnifierShow: false,
        imageUrl: '',
        name: '',
        pixel: '',
        orientation: 0,
        offset: {
          x: 0,
          y: 0,
          marginTop: 0
        }
      },
      magnifierShowTime: 500,
      selectedImageIds: [],

      // 是否显示add图标.
      isShownAddIcon: false
    };

    this.onOverImageItem = imageUrl => onOverImageItem(this, imageUrl);
    this.onOutImageItem = () => onOutImageItem(this);
    this.onImageListDown = event => onImageListDown(this, event);
    this.toggleImageItemSelected = (id, event) =>
      toggleImageItemSelected(this, id, event);
    this.onDragStarted = (id, event) => onDragStarted(this, id, event);
    this.deleteImage = imageObj => deleteImage(this, imageObj);
    this.onSelect = selectionBox => onSelect(this, selectionBox);
    this.onSelectStop = selectionBox => onSelectStop(this, selectionBox);

    this.addGroupElement = imageObj => addGroupElement(this, imageObj);
    this.addGroupElements = key => addGroupElements(this, key);

    this.onMouseEnterGroup = (key, ev) => {
      const event = ev || window.event;
      event.stopPropagation();

      this.setState({
        [`isShownAddIcon-${key}`]: true
      });
    };

    this.onMouseLeaveGroup = (key, ev) => {
      const event = ev || window.event;
      const newState = {};
      event.stopPropagation();

      for (let key in this.state) {
        if (key.startsWith('isShownAddIcon-')) {
          newState[key] = false;
        }
      }

      this.setState(newState);
    };

    this.getImagesRenderHtml = this.getImagesRenderHtml.bind(this);
    this.getRenderHtml = this.getRenderHtml.bind(this);
  }

  getImagesRenderHtml(twoDimenImagesArr) {
    const { selectedImageIds } = this.state;

    const onOverImageItem = this.onOverImageItem;
    const onOutImageItem = this.onOutImageItem;
    const toggleImageItemSelected = this.toggleImageItemSelected;
    const imageItemActions = {
      onOutImageItem,
      onOverImageItem,
      toggleImageItemSelected
    };

    const html = [];

    if (twoDimenImagesArr && twoDimenImagesArr.length) {
      twoDimenImagesArr.forEach((imageInRow, index) => {
        const subHtml = [];
        const hasTwoItems =
          index === twoDimenImagesArr.length - 1 && imageInRow.length === 2;

        imageInRow.forEach((imageObj, i) => {
          const isSelected = selectedImageIds.indexOf(imageObj.guid) >= 0;
          const isSelectedStyle = isSelected
            ? { background: '#d6d6d6', borderRadius: '5px' }
            : {};

          subHtml.push(
            <div
              key={imageObj.guid}
              className="lazy-item"
              style={isSelectedStyle}
            >
              <XDrag
                onDragStarted={this.onDragStarted.bind(this, imageObj.guid)}
              >
                <LazyLoad height={80} offset={0}>
                  <ImageItem
                    imageObj={imageObj}
                    addGroupElement={this.addGroupElement}
                    deleteImage={this.deleteImage.bind(this, imageObj)}
                    actions={imageItemActions}
                  />
                </LazyLoad>
              </XDrag>
            </div>
          );
        });

        html.push(
          <div className="image-row" key={index}>
            {subHtml}
          </div>
        );
      });
    }

    return html;
  }

  getRenderHtml(images) {
    const { selectedImageIds } = this.state;

    const onOverImageItem = this.onOverImageItem;
    const onOutImageItem = this.onOutImageItem;
    const toggleImageItemSelected = this.toggleImageItemSelected;
    const imageItemActions = {
      onOutImageItem,
      onOverImageItem,
      toggleImageItemSelected
    };

    const html = [];
    for (const key in images) {
      const itemArr = images[key];
      if (itemArr.length) {
        const tHtml = [];
        const addGroupClassName = classNames('add-group-image', {
          show: this.state[`isShownAddIcon-${key}`]
        });

        tHtml.push(
          <div className="group-title">
            {key}
            <img
              src={add}
              width="16px"
              height="16px"
              className={addGroupClassName}
              onClick={this.addGroupElements.bind(this, key)}
            />
          </div>
        );
        const sHtml = [];
        itemArr.forEach((imageObj, index) => {
          const itemKey = `${key}-${index}`;
          const subHtml = [];

          const isSelected = selectedImageIds.indexOf(imageObj.guid) >= 0;
          const isSelectedStyle = isSelected
            ? { background: '#d6d6d6', borderRadius: '5px' }
            : {};

          subHtml.push(
            <div
              key={imageObj.guid}
              className="lazy-item group-image"
              style={isSelectedStyle}
            >
              <XDrag
                onDragStarted={this.onDragStarted.bind(this, imageObj.guid)}
              >
                <LazyLoad height={75} offset={0}>
                  <ImageItem
                    imageObj={imageObj}
                    addGroupElement={this.addGroupElement}
                    deleteImage={this.deleteImage.bind(this, imageObj)}
                    isUsePhotoGroup
                    actions={imageItemActions}
                  />
                </LazyLoad>
              </XDrag>
            </div>
          );

          sHtml.push(
            <div className="image-col" key={itemKey}>
              {subHtml}
            </div>
          );
        });
        tHtml.push(
          <div className="group-items" key={key}>
            {sHtml}
          </div>
        );
        tHtml.push(<div className="clear" />);
        html.push(
          <div
            className="group-row"
            onMouseOver={this.onMouseEnterGroup.bind(this, key)}
            onMouseOut={this.onMouseLeaveGroup.bind(this, key)}
          >
            {tHtml}
          </div>
        );
      }
    }

    return html;
  }

  componentDidMount() {
    window.onscroll = this.onOutImageItem;
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  render() {
    const {
      uploadedImages,
      baseUrls,
      className,
      isUsePhotoGroup,
      userInfo
    } = this.props;
    const { magnifierParams, isShownAddIcon } = this.state;
    let imageArr = [];
    if (isUsePhotoGroup) {
      imageArr = convertGroupImageData(
        uploadedImages,
        baseUrls.get('uploadBaseUrl'),
        userInfo
      );
    } else {
      imageArr = convertImageData(
        uploadedImages,
        baseUrls.get('uploadBaseUrl'),
        userInfo
      );
    }
    const imageListClass = classNames('image-list', className);
    return (
      <div>
        <div
          className={imageListClass}
          ref="imageList"
          onMouseUp={this.onImageListDown}
        >
          {imageArr && imageArr.length && !isUsePhotoGroup
            ? this.getImagesRenderHtml(imageArr)
            : null}
          {imageArr && isUsePhotoGroup ? this.getRenderHtml(imageArr) : null}
          <PicMagnifier data={magnifierParams} />
        </div>
      </div>
    );
  }
}

ImageList.propTypes = {};

export default ImageList;
