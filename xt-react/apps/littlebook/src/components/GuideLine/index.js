import React, { PropTypes, Component } from 'react';

import classNames from 'classnames';

import { merge } from 'lodash';

import './index.scss';

class GuideLine extends Component {

  render() {
    let { isShown, style, direction, lineColor, lineStyle, lineWidth } = this.props;
    const guideLineStyle = classNames('guide-line', {
      isShown
    });
    const lineStyleStr = `${lineWidth}px ${lineStyle} ${lineColor}`;
    const borderStyle = direction === 'horizontal' ?
    {
      borderTop: lineStyleStr
    } :
    {
      borderLeft: lineStyleStr
    };
    style = merge({}, style, borderStyle);
    return (
      <div className={guideLineStyle} style={style} data-html2canvas-ignore="true" />
    );
  }
}

GuideLine.propTypes = {
  lineStyle: PropTypes.string,
  lineColor: PropTypes.string,
  direction: PropTypes.string,
  isShown: PropTypes.bool.isRequired,
  style: PropTypes.shape({
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number
  }).isRequired,
};

GuideLine.defaultProps = {
  direction: 'horizontal',
  lineStyle: 'solid',
  lineColor: '#4CC1FC',
  lineWidth: 1
};

export default GuideLine;
