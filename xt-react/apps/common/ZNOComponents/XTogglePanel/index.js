import React, { Component, PropTypes } from 'react';
import { merge } from 'lodash';
import XButton from '../XButton';

import classNames from 'classnames';
import './index.scss';

import { onClickMore, onClickLess } from './handler';

class XTogglePanel extends Component {
  constructor(props) {
    super(props);

    this.onClickMore = (e) => onClickMore(this, e);
    this.onClickLess = (e) => onClickLess(this, e);

    const {
      stepCount,
      currentStep,
      steps
    } = props;

    this.state = {
      stepCount,
      currentStep,
      steps
    };
  }

  componentWillReceiveProps(nextProps) {
    // stepCount
    if (this.props.stepCount !== nextProps.stepCount) {
      this.setState({
        stepCount: nextProps.stepCount
      });
    }

    // currentStep
    if (this.props.currentStep !== nextProps.currentStep) {
      this.setState({
        currentStep: nextProps.currentStep
      });
    }

    if (this.props.steps !== nextProps.steps) {
      this.setState({
        steps: nextProps.steps
      });
    }
  }

  render() {
    const { children, style, className, hasIcons } = this.props;
    const { stepCount, currentStep, steps } = this.state;

    // wrap
    const wrapClassName = classNames('x-toggle-panel');

    // 确保两个按钮可以点击.
    const wrapHeight = stepCount * currentStep || 25;
    const wrapStyle = merge({}, style, {
      height: `${wrapHeight}px`
    });

    // icons
    const iconsClassName = classNames('icons-bar');

    return (
      <div className={wrapClassName} style={wrapStyle}>
        {/* icons */}
        {
          hasIcons ? (
            <div className={iconsClassName}>
              <label>
                <input disabled={ currentStep >= steps } />
                <span className="more-icon icon" onClick={this.onClickMore}/>
              </label>
              <label>
                <input disabled={ currentStep <= 0 } />
                <span className="less-icon icon" onClick={this.onClickLess}/>
              </label>
            </div>) : null
        }

        {children}
      </div>
    );
  }
}

XTogglePanel.propTypes = {
  hasIcons: PropTypes.bool,
  stepCount: PropTypes.number,
  currentStep: PropTypes.number,
  onChangeStep: PropTypes.func
};

XTogglePanel.defaultProps = {
  hasIcons: true,
  stepCount: 130,

  // 0, 1, 2
  steps: 1,
  currentStep: 1,
  onChangeStep: () => {}
};

export default XTogglePanel;
