import React from 'react';
import ToolTip from 'react-portal-tooltip';

export const renderSteps = (that) => {
  const { steps } = that.props;
  const html = [];

  if (steps) {
    steps.forEach((step, i) => {
      const toolTip = (
        <ToolTip
          key={i}
          active={that.state.current === i}
          position={step.position || 'top'}
          arrow={step.arrow || 'right'}
          parent={step.parent}
          style={step.style}
          tooltipTimeout={step.tooltipTimeout || 0}
        >
          {step.ele}
        </ToolTip>
      );

      html.push(toolTip);
    });
  }

  return html;
};
