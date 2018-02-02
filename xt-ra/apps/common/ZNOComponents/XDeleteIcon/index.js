import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XDeleteIcon extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { className, style, onClicked, title, isShow = false, isBlack = false } = this.props;

    const newClassName = classNames('x-delete-icon', className, {
      show: isShow,

      // 使用红色还是黑色的按钮.
      black: isBlack
    });

    const newStyle = style;

    return (
      <div
        className={newClassName}
        style={newStyle}
        onClick={onClicked}
        title={title}
      />
    );
  }
}

XDeleteIcon.defaultProps = {
  isShow: false,
  isBlack: false,
  title: 'Delete',
  onClicked: () => {}
};


export default XDeleteIcon;
