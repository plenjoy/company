import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

class XNotify extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      autoHideTimer: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldGuid = this.props.guid;
    const newGuid = nextProps.guid;

    if (oldGuid !== newGuid) {
      const { autoHideTimer } = this.state;
      const { hideNotify, hideDelay } = this.props;

      clearTimeout(autoHideTimer);

      const timer = setTimeout(hideNotify, hideDelay);
      this.setState({
        autoHideTimer: timer
      });
    }
  }

  render() {
    const { notifyMessage, isShow, hideNotify } = this.props;

    const cName = classNames('notify-top', { show: isShow })
    return (
      <div className={cName}>
        <span>◆</span>
        <a
          href="javascript:void(0)"
          className="icon-close"
          onClick={hideNotify}
        ></a>
        <div className="notify-mes">{notifyMessage}</div>
      </div>
    );
  }
}

XNotify.propTypes = {
  guid: PropTypes.string.isRequired,
  hideNotify: PropTypes.func.isRequired,
  notifyMessage: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
  hideDelay: PropTypes.number
};

XNotify.defaultProps = {
  hideDelay: 3000
};

export default XNotify;
