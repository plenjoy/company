import React, { PropTypes } from 'react';

import './index.scss';

const Tooltip = ({ children, style }) => (
  <div className="tooltip" style={style} data-html2canvas-ignore="true">
    {children}
  </div>
);

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object.isRequired
};

export default Tooltip;
