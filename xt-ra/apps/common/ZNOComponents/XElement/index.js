import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, children } = this.props;
    const customClass = classNames('x-element', className);

    return (
      <div className={customClass}>
        {children}
      </div>
    );
  }
}

XElement.propTypes = {
  className: PropTypes.string
};
