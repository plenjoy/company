import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XAddText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { className, onClicked, text } = this.props;
    const customClass = classNames('x-add-text', className);

    return (
      <div className={customClass} onClick={onClicked}>
        {text || 'Add Text'}
      </div>
    );
  }
}

XAddText.propTypes = {
  onClicked: PropTypes.func,
  className: PropTypes.string,
  text: PropTypes.string
};
