import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import * as mianHandle from './handle/main';
import './index.scss';

export default class XStep extends Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.onSkip = () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.props.onSkip && this.props.onSkip();
      }, 30);
    };

    this.onPrevious = () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.props.onPrevious && this.props.onPrevious();
      }, 30);
    };

    this.onNext = () => {
      clearTimeout(this.timer);

      // 避免触发两次短时间.
      this.timer = setTimeout(() => {
        this.props.onNext && this.props.onNext();
      }, 30);
    };
  }

  stopEvent(e) {
    e.stopPropagation();
  }

  render() {
    const {
      children,
      className,
      style,

      skipText,
      prevText,
      nextText,
      isShowSkip,
      isShowPrev,
      isShowNext
    } = this.props;

    const stepClassName = classNames('x-step', className);

    return (
      <div className={stepClassName} style={style} >
        { children }

        <div className="steps-btns">
          {
            isShowSkip ? <span className="step-btn skip" onClick={this.onSkip}>{skipText}</span> : null
          }

          {
            isShowPrev ? <span className="step-btn previous" onClick={this.onPrevious}>{prevText}</span> : null
          }

          {
            isShowNext ? <span className="step-btn next" onClick={this.onNext}>{nextText}</span> : null
          }
        </div>
      </div>
    );
  }
}

XStep.defaultProps = {
  skipText: 'Skip',
  prevText: 'Previous',
  nextText: 'Next',
  isShowSkip: true,
  isShowPrev: false,
  isShowNext: true
};

XStep.propTypes = {
  className: PropTypes.string,
  onSkip: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,

  skipText: PropTypes.string,
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  isShowSkip: PropTypes.bool,
  isShowPrev: PropTypes.bool,
  isShowNext: PropTypes.bool
};
