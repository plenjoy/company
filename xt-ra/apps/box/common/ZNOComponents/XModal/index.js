import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XModal extends Component {
  constructor(props) {
    super(props);

    this.stopEvent = this.stopEvent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onBackDropClick = this.onBackDropClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const oldOpened = prevProps.opened;
    const newOpened = this.props.opened;

    if (oldOpened !== newOpened && newOpened) {
      this.modalContainer.focus();
    }
  }

  handleKeyDown(event) {
    if (this.props.escapeClose && event.keyCode === 27) {
      event.preventDefault();
      this.props.onClosed();
    }
  }

  onBackDropClick(){
    const { closeByBackDropClick, onClosed } = this.props;
    if (closeByBackDropClick) {
      onClosed();
    }
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const { children, className, opened, onClosed, isHideIcon, contentStyle } = this.props;
    const modalClassName = classNames('x-modal', {
      'show': opened
    });
    const iconClassName = classNames('icon-close', {
      'hide': isHideIcon
    });

    const contentClassName = classNames('content', className);

    return (
      <div
        ref={(div) => { this.modalContainer = div; }}
        tabIndex="-1"
        className={modalClassName}
        onClick={this.stopEvent}
        onMouseDown={this.stopEvent}
        onKeyDown={this.handleKeyDown}
      >
        <div className="backdrop" onClick={this.onBackDropClick} />
        <div className={contentClassName} style={contentStyle}>
          <span className={iconClassName} onClick={onClosed} />
          {children}
        </div>
      </div>
    );
  }
}

XModal.defaultProps = {
  escapeClose: true,
  closeByBackDropClick: false
};

XModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  className: PropTypes.string,
  opened: PropTypes.bool.isRequired,
  escapeClose: PropTypes.bool,
  isHideIcon: PropTypes.bool,
  closeByBackDropClick: PropTypes.bool,
  contentStyle: PropTypes.object
};
