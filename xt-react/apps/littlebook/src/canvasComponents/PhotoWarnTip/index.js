import React, { Component, PropTypes } from 'react';
import WarnTip from '../WarnTip';

class PhotoWarnTip extends Component {
  render() {
    const { parentHeight, parentWith } = this.props;
    const BEYOND_SIZE_TIP = 'Photo has low resolution and may look poor in print';
    const warnTipTextArray = [];
    warnTipTextArray.push(BEYOND_SIZE_TIP);
    const warnTipProps = { parentHeight, title: warnTipTextArray.join('\n'), parentWith };
    return (
      <WarnTip {...warnTipProps} />
    );
  }
}


export default PhotoWarnTip;
