import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import * as handler from './handler.js';
import classNames from 'classnames';
import XUsageCount from '../../../../common/ZNOComponents/XUsageCount';
import './index.scss';
import whiteBg from './white-bg.png';

class BackgroundItem extends Component {
  constructor(props) {
    super(props);
    const { usedCount } = this.props;
    this.state = {
      usedCount,
    };
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onImageError() {
    this.props.setImgLoading && this.props.setImgLoading();
  }
  onImageLoad() {
    this.props.setImgLoading && this.props.setImgLoading();
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

  onClick() {
    const { background, applyBackground, applyDefaultBackground, selectedBackgrounds,boundTrackerActions } = this.props;
    const { code } = background;
    boundTrackerActions.addTracker('DragAndDropBackground');
    if (background.isDefaultBackground) {
      applyDefaultBackground && applyDefaultBackground();
      selectedBackgrounds && selectedBackgrounds(code);
    } else {
      applyBackground && applyBackground(background);
      selectedBackgrounds && selectedBackgrounds(code);
    }
  }
  render() {
    const { background, isSelected, } = this.props;
    const { usedCount, isImgLoading } = this.state;
    let { backgroundUrl, isDefaultBackground } = background;
    if (isDefaultBackground) {
      backgroundUrl = whiteBg;
    }
    const itemClass = classNames('background-item', {
      selected: isSelected
    });
    return (
      <div className={itemClass} >
        <div className="background-wrap"  onClick={this.onClick} >
          <img
            src={backgroundUrl}
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

BackgroundItem.proptype = {

};

export default BackgroundItem;
