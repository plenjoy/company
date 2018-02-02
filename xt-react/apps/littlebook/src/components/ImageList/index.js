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
import {
  convertImageData,
  onOverImageItem,
  onOutImageItem,
  toggleImageItemSelected,
  onImageListDown,
  onDragStarted,
  deleteImage,
  onSelect,
  onSelectStop } from './handler';
import './index.scss';

class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      magnifierParams: {
        isMagnifierShow: false,
        imageUrl: '',
        orientation: 0,
        offset: {
          x: 0,
          y: 0,
          marginTop: 0
        }
      },
      magnifierShowTime: 1,
      selectedImageIds: []
    };

    this.onOverImageItem = imageUrl => onOverImageItem(this, imageUrl);
    this.onOutImageItem = () => onOutImageItem(this);
    this.onImageListDown = event => onImageListDown(this, event);
    this.toggleImageItemSelected = (id, event) => toggleImageItemSelected(this, id, event);
    this.onDragStarted = event => onDragStarted(this, event);
    this.deleteImage = imageObj => deleteImage(this, imageObj);
    this.onSelect = selectionBox => onSelect(this, selectionBox);
    this.onSelectStop = selectionBox => onSelectStop(this, selectionBox);
  }

  getImagesRenderHtml(twoDimenImagesArr) {
    const { selectedImageIds } = this.state;
    const onOverImageItem = this.onOverImageItem;
    const onOutImageItem = this.onOutImageItem;
    const toggleImageItemSelected = this.toggleImageItemSelected;
    const imageItemActions = { onOutImageItem, onOverImageItem, toggleImageItemSelected };

    const html = [];

    if (twoDimenImagesArr && twoDimenImagesArr.length) {
      twoDimenImagesArr.forEach((imageInRow, index) => {
        const subHtml = [];
        const hasTwoItems = index === (twoDimenImagesArr.length - 1) && imageInRow.length === 2;

        imageInRow.forEach((imageObj, i) => {
          const isSelected = selectedImageIds.indexOf(imageObj.guid) >= 0;
          const isSelectedStyle = isSelected ? { background: '#d6d6d6', borderRadius: '5px' } : {};

          subHtml.push(
            <div key={imageObj.guid} className="lazy-item" style={isSelectedStyle}>
              <XDrag onDragStarted={this.onDragStarted.bind(this)}>
                <LazyLoad height={80} offset={0}>
                  <ImageItem
                    imageObj={imageObj}
                    deleteImage={this.deleteImage.bind(this, imageObj)}
                    actions={imageItemActions}
                  />
                </LazyLoad>
              </XDrag>
            </div>
          );
        });

        html.push(<div className="image-row" key={index}>{subHtml}</div>);
      });
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
    const { uploadedImages, baseUrls,userInfo } = this.props;
    const { magnifierParams } = this.state;
    const twoDimenImagesArr = convertImageData(uploadedImages, baseUrls.get('uploadBaseUrl'),userInfo);

    return (
      <div>
        <div className="image-list" ref="imageList" onMouseUp={this.onImageListDown}>
          {
            twoDimenImagesArr && twoDimenImagesArr.length ? this.getImagesRenderHtml(twoDimenImagesArr) : null
          }
          <PicMagnifier data={magnifierParams} />
        </div>
      </div>
    );
  }
}

ImageList.propTypes = {};

export default ImageList;
