import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class PageHover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, data,  children } = this.props;
    const {
      className,
      style
    } = data;

    const customClass = classNames('page-hover', className);

    return (
      <div
        style={style}
        className={customClass}
      >
        {children}
      </div>
    );
  }
}

PageHover.propTypes = {
  actions: PropTypes.shape({
  }),
  data: PropTypes.shape({
    style: PropTypes.object,
    className: PropTypes.object
  })
};
