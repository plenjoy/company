import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XUsageCount extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { className, style, count } = this.props;

    const newClassName = classNames('x-usage-count', className);
    const newStyle = style;

    return (
      <div
        className={newClassName}
        style={newStyle}
      >
        <div className="text">{ count }</div>
      </div>
    );
  }
}

XUsageCount.defaultProps = {
  count: 0
};


export default XUsageCount;
