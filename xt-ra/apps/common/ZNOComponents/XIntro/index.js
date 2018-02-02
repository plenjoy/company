import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import * as mainHandle from './handle/main';
import './index.scss';

export default class XIntro extends Component {
  constructor(props) {
    super(props);

    this.stopEvent = this.stopEvent.bind(this);
    this.renderSteps = () => mainHandle.renderSteps(this);

    this.state = {
      // 当前显示的step的索引.
      current: props.current || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    // 设置显示的step.
    if (nextProps.current !== this.state.current) {
      this.setState({
        current: nextProps.current
      });
    }
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const {
      className,
      opened,
      styles
    } = this.props;
    const modalClassName = classNames('x-modal x-intro', {
      show: opened
    });
    const contentClassName = classNames('content', className);

    return (
      <div
        ref={(div) => {
          this.modalContainer = div;
        }}
        tabIndex="-1"
        className={modalClassName}
        onClick={this.stopEvent}
      >
        <div className="backdrop" />
        <div
          className={contentClassName}
          style={styles}
        >
          { this.renderSteps() }
        </div>
      </div>
    );
  }
}

XIntro.defaultProps = {
  current: 0,
  steps: []
};

XIntro.propTypes = {
  // 当前显示的step的索引.
  current: PropTypes.number,
  className: PropTypes.string,
  opened: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf({
    position: PropTypes.string,
    arrow: PropTypes.string,
    parent: PropTypes.string,
    style: PropTypes.object,
    tooltipTimeout: PropTypes.number,
    ele: PropTypes.object
  })
};
