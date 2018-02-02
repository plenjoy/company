import React, { Component, PropTypes } from 'react';

import warnIcon from './icon-warn.svg';

class WarnTip extends Component {
  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    const { title } = this.props;

    this.imageNode.getStage().content.title = title;
  }

  onMouseLeave() {
    this.imageNode.getStage().content.title = '';
  }

  render() {
    const { parentWidth, parentHeight, title } = this.props;
    const warnStyle = {
      position: 'absolute',
      left: parentWidth ? `${parentWidth - 8 - 18}px` : '8px',
      top: parentWidth ? '8px' : `${parentHeight - 8 - 18}px`,
      width: '18px',
      height: '18px'
    };

    return (
      <img src={warnIcon} title={title} style={warnStyle} />
    );
  }
}

WarnTip.propTypes = {
  parentHeight: PropTypes.number,
  parentWidth: PropTypes.number,
  title: PropTypes.string.isRequired
};

export default WarnTip;
