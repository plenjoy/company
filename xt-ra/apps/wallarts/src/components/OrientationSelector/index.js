import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import './index.scss';
import rotateIcon from './rotate.svg';
class OrientationSelector extends Component {
  constructor(props) {
    super(props);
    this.rotatePage = this.rotatePage.bind(this);
  }

  rotatePage(newOrientation) {
    const { orientation, changeOrientation, applyRelativeTemplate, boundTrackerActions } = this.props;
    if (orientation !== newOrientation) {
      boundTrackerActions.addTracker(`SwitchTo${ newOrientation }`);
      changeOrientation && changeOrientation({ orientation: newOrientation });
    }
  }

  render() {
    const { orientation } = this.props;
    const landscapeButton = classNames('landscape-button', {
      active: orientation === 'Landscape'
    });
    const portraitButton = classNames('portrait-button', {
      active: orientation === 'Portrait'
    });
    const changeOrientation = orientation === 'Landscape' ? 'Portrait' : 'Landscape';
    return (

      <div className="bottons-wrap">
        {/*<div
          onClick={() => { this.rotatePage('Landscape'); }}
          className={landscapeButton}
        >
          Landscape
        </div>
        <div
          onClick={() => { this.rotatePage('Portrait'); }}
          className={portraitButton}
        >
          Portrait
        </div>*/}
        <img src={rotateIcon} className="rotate_button" onClick={() => { this.rotatePage(changeOrientation); }} />
      </div>
    );
  }
}

export default translate('OrientationSelector')(OrientationSelector);
