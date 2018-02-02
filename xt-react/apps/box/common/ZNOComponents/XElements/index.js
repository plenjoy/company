import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XElements extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, children } = this.props;
    const customClass = classNames('x-elements', className);

    return (
      <div className={customClass}>
        {children}
      </div>
    );
  }
}

XElements.propTypes = {
  className: PropTypes.string
};
