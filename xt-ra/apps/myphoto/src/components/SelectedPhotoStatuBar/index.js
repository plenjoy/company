import classNames from 'classNames';
import React, { Component } from 'react';

import './style.scss';

class SelectedPhotoStatuBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedImages, unSelectedAllImages } = this.props;
    const barClass = classNames('selected-photo-statu-bar', { 'has-selected': selectedImages.length });

    const photoText = selectedImages.length > 1 ? 'photos' : 'photo';

    return (
      <div className={barClass}>
        {
          selectedImages.length
          ? (<div>
              <span className="has-selected">{ `${selectedImages.length} ${photoText} selected` }</span>
              {/*<a
                title={'Cancel All Selected Photos'}
                onClick={unSelectedAllImages}
              >
                Cancel
              </a>*/}
            </div>
          )
          : (<span className="no-selected">Select photos to create product</span>)
        }
      </div>
    );
  }
}

export default SelectedPhotoStatuBar;
