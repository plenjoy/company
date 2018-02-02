import React, { Component, PropTypes } from 'react';
import Slider from 'rc-slider';
require("./index.css");

class XSlider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultValue: 0,
      defaultStep: 1,
      defaultMin: 0,
      defaultMax: 100,
      defaultVertical: false
    }
  }

  percentFormatter(v) {
    return `${v} in.`;
  }

  render() {
    const { value, min, vertical, step, max, tipFormatter, handleSliderChange, handleAfterChange, handleBeforeChange } = this.props;
    return (
      <Slider value={value}
              defaultValue={this.state.defaultValue}
              min={min?min:this.state.defaultMin}
              max={max?max:this.state.defaultMax}
              step={step?step:this.state.defaultStep}
              tipFormatter={tipFormatter?tipFormatter:this.percentFormatter.bind(this)}
              vertical={vertical?vertical:this.state.defaultVertical}
              onChange={handleSliderChange}
              onAfterChange={handleAfterChange}
              onBeforeChange={handleBeforeChange} />
    )
  }
}

XSlider.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  tipFormatter: PropTypes.func,
  vertical: PropTypes.bool,
  handleSliderChange: PropTypes.func
}

export default XSlider;
