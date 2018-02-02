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
    let imageProps = {
      width: 18,
      height: 18,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    };
    if (parentHeight) {
     imageProps.x = 8;
     imageProps.y = parentHeight - 8 - 18;
    }
    let warnStyle={
      position: 'absolute',
      left: 8+'px',
      top: parentHeight - 8 - 18+'px',
      width: 18+'px',
      height: 18+'px'
    }

    return (
      <img src={warnIcon} title={title} style={warnStyle}/>
    );
  }
}

WarnTip.propTypes = {
  parentHeight: PropTypes.number,
  parentWidth: PropTypes.number,
  title: PropTypes.string.isRequired
};

export default WarnTip;
