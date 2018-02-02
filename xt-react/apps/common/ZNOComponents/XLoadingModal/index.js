import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XLoadingModal extends Component {
  constructor(props) {
    super(props);

    this.stopEvent = this.stopEvent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onBackDropClick = this.onBackDropClick.bind(this);
    this.stopDragEvent = (ev) => {
      const event = ev || window.event;
      event.stopPropagation();
      event.preventDefault();
    };
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

  onBackDropClick() {
    const { closeByBackDropClick, onClosed } = this.props;
    if (closeByBackDropClick) {
      onClosed();
    }
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const { children, className, opened, onClosed, isHideIcon, isHideBackdrop, offsetTop, total, current } = this.props;
    const modalClassName = classNames('x-loading-modal', {
      show: opened
    });
    const iconClassName = classNames('icon-close', {
      hide: isHideIcon
    });
    const contentClassName = classNames('content', className);

    const backdropStyle = {
      top: offsetTop || 0
    };
    const currentProgressStyle = {
      width: `${parseFloat(current) / parseFloat(total) * 100}%`
    };

    return (
      <div
        ref={(div) => { this.modalContainer = div; }}
        tabIndex="-1"
        className={modalClassName}
        onClick={this.stopEvent}
        onMouseDown={this.stopEvent}
        onKeyDown={this.handleKeyDown}
      >
        <div className='backdrop' style={backdropStyle} onClick={this.onBackDropClick} />
        <div className={contentClassName} onDragStart={this.stopDragEvent} >
          <span className={iconClassName} onClick={onClosed} />

          <div className='progress'>
            <div className='progress-current' style={currentProgressStyle}></div>
          </div>

          <div className='content-text'>{children}</div>
        </div>
      </div>
    );
  }
}

XLoadingModal.defaultProps = {
  escapeClose: true,
  closeByBackDropClick: false
};

XLoadingModal.propTypes = {
  onClosed: PropTypes.func,
  className: PropTypes.string,
  opened: PropTypes.bool,
  escapeClose: PropTypes.bool,
  isHideIcon: PropTypes.bool,
  closeByBackDropClick: PropTypes.bool,
  total: PropTypes.number,
  current: PropTypes.number
};
