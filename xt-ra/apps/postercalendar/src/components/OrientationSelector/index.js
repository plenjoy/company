import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import './index.scss';

class OrientationSelector extends Component {
  constructor(props) {
    super(props);
    this.rotatePage = this.rotatePage.bind(this);
  }

  rotatePage(newOrientation) {
    const { orientation, changeOrientation, applyRelativeTemplate } = this.props;
    if (orientation !== newOrientation) {
      changeOrientation && changeOrientation({ orientation: newOrientation }).then(() => {
        applyRelativeTemplate({ orientation: newOrientation });
      });
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

    return (
      <div className="bottons-wrap">
        <div
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
        </div>
      </div>
    );
  }
}

export default translate('OrientationSelector')(OrientationSelector);
