import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { get } from 'lodash';

import XSlider from '../../../../common/ZNOComponents/XSlider';

import './index.scss';

class SliderChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      showStatus: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldValue = get(this.props, 'value');
    const newValue = get(nextProps, 'value');
    if (oldValue !== newValue) {
      this.setState({
        value: newValue
      });
    }
  }

  handleInput(event) {
    const { min, max } = this.props;
    let value = parseFloat(event.target.value);
    if (value <= min) {
      value = min;
    } else if (value >= max) {
      value = max;
    }
    this.handleOnChange(value);
  }

  handleOnChange(value) {
    const { onChange } = this.props;
    this.setState({
      value
    });
    if (this.timer) {
      clearTimeout(this.timer);
    }
   this.timer = setTimeout(() => {
      onChange && onChange(value);
    }, 500);
  }

  handleBeforeChange() {
    this.setState({
      showStatus: true
    });
  }

  handleAfterChange() {
    this.setState({
      showStatus: false
    });
  }

  render() {
    const { t, label, min, max, step, prefix, subfix, needShowStatus } = this.props;
    const { value, showStatus } = this.state;

    const showStatusStyle = {
      left: `${170 * value / max + 47}px`,
      display: showStatus ? 'block' : 'none'
    };

    return (
      <div className="change-value">
        <label>{label}</label>
        <XSlider
          value={value}
          min={min}
          max={max}
          step={step}
          handleSliderChange={this.handleOnChange}
          handleAfterChange={this.handleAfterChange}
          handleBeforeChange={this.handleBeforeChange}
        />
        <input type="number" value={`${value}`} onChange={this.handleInput} />
        {
          needShowStatus ?
            (
              <div className="show-value" style={showStatusStyle}>
                {`${prefix}${value}${subfix}`}
              </div>
            ) :
            null
        }
      </div>
    );
  }
}

SliderChange.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string,
  prefix: PropTypes.string,
  subfix: PropTypes.string,
  needShowStatus: PropTypes.bool
};

SliderChange.defaultProps = {
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  prefix: '',
  subfix: '',
  needShowStatus: true
};

SliderChange.timer = null;

export default translate('SliderChange')(SliderChange);
