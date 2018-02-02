import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

class XTextLoading extends Component {
  render() {
    const { hasText } = this.props;
    const loadClassName = classNames('icon', {
      'has-text': hasText
    });
    return (
      this.props.isShown
      ? (
        <div className="text-loading">
          <i className={loadClassName} />
        </div>
      )
      : null
    );
  }
}

XTextLoading.propTypes = {
  isShown: PropTypes.bool.isRequired,
};

export default XTextLoading;
