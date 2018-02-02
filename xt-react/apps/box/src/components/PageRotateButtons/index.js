import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import './index.scss';

class PageRotateButtons extends Component {
  constructor(props) {
    super(props);
    this.rotatePage = this.rotatePage.bind(this);
  }

  rotatePage(bool) {
    const { rotation, rotateCover } = this.props;
    if (rotation !== bool) {
      rotateCover && rotateCover(bool);
    }
  }

  render() {
    const { rotation } = this.props;
    const landscapeButton = classNames('landscape-button', {
      active: !rotation
    });
    const portraitButton = classNames('portrait-button', {
      active: rotation
    });

    return (
      <div className="bottons-wrap">
        <div
          onClick={() => { this.rotatePage(false); }}
          className={landscapeButton}
        >
          Landscape
        </div>
        <div
          onClick={() => { this.rotatePage(true); }}
          className={portraitButton}
        >
          Portrait
        </div>
      </div>
    );
  }
}

export default translate('PageRotateButtons')(PageRotateButtons);
