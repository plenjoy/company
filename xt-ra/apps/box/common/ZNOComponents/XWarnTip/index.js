import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';

class XWarnTip extends Component {
  render () {
    const { isShown, title, left, bottom } = this.props;

    const warnTipStyle = classNames('warn-tip', {
      show: isShown
    });

    const positionStyle = {
      left: left ? `${left}px` : '8px',
      bottom: bottom ? `${bottom}px` : '8px'
    };

    return (
      <div data-html2canvas-ignore="true" className={warnTipStyle} title={title} style={positionStyle} />
    );
  }
}


XWarnTip.propTypes = {
  isShown: PropTypes.bool.isRequired,
  title: PropTypes.string
};


export default XWarnTip;
