import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XAlert extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { className, textClassName, style, text, children, onClicked } = this.props;

    const xAlertClass = classNames('x-alert', className);
    const xAlertStyle = style;

    const textClass = classNames('text', textClassName);

    return (
      <div
        className={xAlertClass}
        style={xAlertStyle}
        onClick={onClicked}
      >
         {
          text ? (<p className={textClass}>{text}</p>) : null
         }

         { children }
      </div>
    );
  }
}


export default XAlert;
