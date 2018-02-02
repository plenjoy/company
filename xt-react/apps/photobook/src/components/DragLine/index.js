import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {merge} from 'lodash';
import './index.scss';

export default class DragLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, data,  children } = this.props;
    const {
      className,
      style,
      isShown
    } = data;

    const customClass = classNames('drag-line', className);
    const newStyle = merge({}, style, {
      display: isShown ? 'block' : 'none'
    });

    return (
      <div
        style={newStyle}
        className={customClass}
      >
        {children}
      </div>
    );
  }
}

DragLine.propTypes = {
  actions: PropTypes.shape({
  }),
  data: PropTypes.shape({
    style: PropTypes.object,
    className: PropTypes.object
  })
};
