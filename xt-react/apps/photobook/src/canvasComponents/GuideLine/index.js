import React, { PropTypes, Component } from 'react';

import { Line } from 'react-konva';


class GuideLine extends Component {

  render() {
    const { isShown, style, lineColor, lineWidth, lineStyle } = this.props;

    const { left, top, width, height } = style;

    const lineProps = {
      points: [left, top, left + width, top + height],
      stroke: lineColor,
      strokeWidth: lineWidth,
      tension: 1
    };

    if (lineStyle === 'dashed') {
      lineProps.dash = [8, 4];
    }

    return (
      isShown
      ? <Line {...lineProps} />
      : <Line />
    );
  }
}

GuideLine.propTypes = {
  lineStyle: PropTypes.string,
  lineColor: PropTypes.string,
  lineWidth: PropTypes.number,
  isShown: PropTypes.bool.isRequired,
  style: PropTypes.shape({
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number
  }).isRequired,
};

GuideLine.defaultProps = {
  lineStyle: 'solid',
  lineColor: '#4CC1FC',
  lineWidth: 1
};

export default GuideLine;
