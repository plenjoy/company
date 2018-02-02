import React, { Component, PropTypes } from 'react';
// import SortAndFilter from '../SortAndFilter';
import ImageItem from '../ImageItem';
import { combine } from '../../../common/utils/url';
import { set, get, template } from 'lodash';
import { IMAGE_SRC } from '../../contants/apiUrl';
import XDrag from '../../../common/ZNOComponents/XDrag';
import securityString from '../../../../common/utils/securityString';
import './index.scss';

class ImageList extends Component {
  constructor(props) {
    super(props);
  }

  onDragStarted(imageObj, event) {
    const { encImgId, width, height, id, orientation } = imageObj;
    const data = JSON.stringify({
      encImgId,
      width,
      height,
      imageid: id,
      orientation
    });
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', data);
    } else {
      // ie11 dataTransfer不支持，使用节点传值
      document.querySelector('body').setAttribute('data-drag', data);
    }
  }

  deleteImage(imageObj) {
    const { boundProjectActions } = this.props;
    if (imageObj.id) {
      boundProjectActions.deleteProjectImage(imageObj.id);
    }
  }

  render() {
    const { uploadedImages, baseUrls, userInfo } = this.props;
    const images = uploadedImages.map(v => {
      const value = v;
      value.src = combine(get(baseUrls, 'uploadBaseUrl'), IMAGE_SRC, {
        qaulityLevel: 0,
        puid: v.encImgId || v.id,
        rendersize: 'fit350',
        ...securityString
      });

      return value;
    });
    return (
      <div className="image-list">
        {images
          ? images.map((imageObj, index) => {
              return (
                <div key={index}>
                  <XDrag
                    onDragStarted={this.onDragStarted.bind(this, imageObj)}
                  >
                    <ImageItem
                      imageObj={imageObj}
                      deleteImage={this.deleteImage.bind(this, imageObj)}
                    />
                  </XDrag>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

ImageList.propTypes = {};

export default ImageList;
