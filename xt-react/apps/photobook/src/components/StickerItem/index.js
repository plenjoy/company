import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import * as handler from './handler.js';
import classNames from 'classnames';
import XUsageCount from '../../../../common/ZNOComponents/XUsageCount';
import './index.scss';
import XLoading from '../../../../common/ZNOComponents/XLoading';
class StickerItem extends Component {
  constructor(props) {
    super(props);
    const { usedCount } = this.props;
    this.state = {
      usedCount,
      isImgLoading: true
    };
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);
  }

  onImageError() {
    this.setState({
      isImgLoading: false
    });
  }
  onImageLoad() {
    this.setState({
      isImgLoading: false
    });
  }

  componentWillReceiveProps(nextProps) {
    const oldUsedCount = get(this.props, 'usedCount');
    const newUsedCount = get(nextProps, 'usedCount');
    if (oldUsedCount != newUsedCount) {
      this.setState({
        usedCount: newUsedCount
      });
    }
  }
  onMouseUp() {
    const { sticker, selectSticker } = this.props;
    selectSticker(sticker.stickerCode);
  }

  render() {
    const { sticker, isSelected } = this.props;
    const { usedCount, isImgLoading } = this.state;
    const { stickerUrl } = sticker;
    const itemClass = classNames('sticker-item', {
      selected: isSelected
    });
    return (
      <div className={itemClass} >
        <XLoading isShown={isImgLoading} />
        <div className="sticker-wrap" onMouseUp={this.onMouseUp} >
          <img
            src={stickerUrl}
            onLoad={this.onImageLoad}
            onError={this.onImageError}
          />
          {
              usedCount ? (<XUsageCount count={usedCount} />) : null
          }
        </div>
      </div>
    );
  }
}

StickerItem.proptype = {

};

export default StickerItem;
