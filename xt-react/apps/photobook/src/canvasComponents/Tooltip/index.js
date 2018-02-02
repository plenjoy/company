import React, { PropTypes } from 'react';

import { Group, Rect, Text } from 'react-konva';

const Tooltip = ({ content, tooltipWidth, elementRect, containerHeight }) => {
  const TOOLTIP_HEIGHT = 28;
  const TOOLTIP_OFFSET = 15;

  const { x, y, width, height } = elementRect;

  const halfWidth = width / 2;
  const haveEnoughBottomSpace = (y + height + TOOLTIP_HEIGHT + TOOLTIP_OFFSET)
    < containerHeight;

  const tooltipX = (x + halfWidth) - (tooltipWidth / 2);
  let tooltipY = 0;

  if (haveEnoughBottomSpace) {
    tooltipY = y + height + TOOLTIP_OFFSET;
  } else {
    tooltipY = y - TOOLTIP_OFFSET - TOOLTIP_HEIGHT;
  }


  const rectProps = {
    x: tooltipX,
    y: tooltipY,
    width: tooltipWidth,
    height: TOOLTIP_HEIGHT,
    cornerRadius: 3,
    fill: '#e2e2e2'
  };

  const textProps = {
    x: tooltipX,
    y: tooltipY,
    width: tooltipWidth,
    text: content,
    fontSize: 12,
    fontFamily: 'Gotham SSm A',
    fill: '#3a3a3a',
    padding: 8,
    align: 'center'
  };

  return (
    <Group>
      <Rect {...rectProps} />
      <Text {...textProps} />
    </Group>
  );
};

Tooltip.propTypes = {
  content: PropTypes.string.isRequired,
  elementRect: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  containerHeight: PropTypes.number.isRequired,
  tooltipWidth: PropTypes.number
};

Tooltip.defaultProps = {
  tooltipWidth: 168
};

export default Tooltip;
