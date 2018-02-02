import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';

class XWarnTip extends Component {
  render () {
    const { isShown, title, style } = this.props;

    const warnTipStyle = classNames('warn-tip', {
      show: isShown
    });

    return (
      <div className={warnTipStyle} title={title} style={style}/>
    );
  }
}


XWarnTip.propTypes = {
  isShown: PropTypes.bool.isRequired,
  title: PropTypes.string
};


export default XWarnTip;
