import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import XSlider from '../../../../common/ZNOComponents/XSlider';
import classNames from 'classnames';
require("./index.scss");

class FontSize extends Component {

  constructor(props) {
    super(props);
    this.state = {
      labelhide: false,
      inputShow: false,
      sliderShow: false,
      min: 4,
      max: 120,
      step: 1
    }
  }

  handleLabelClick() {
    this.setState({
      labelhide: true,
      inputShow: true,
      sliderShow: true
    });
  }

  handleBlur() {
    this.setState({
      labelhide: false,
      inputShow: false,
      sliderShow: false
    });
  }

  handleChange(event) {
    const { handleSizeChange } = this.props;
    let value = event.target.value;
    if(/^\d+$/.test(value)){
      if(value>this.state.max){
        value = this.state.max;
      }else if(value<this.state.min){
        value = this.state.min;
      }
    }
    handleSizeChange(value);
  }

  render() {
    const { value, handleSliderChange } = this.props;
    const labelClass = classNames('label', {
      hide: this.state.labelhide
    });
    const inputClass = classNames('fontsize', {
      show: this.state.inputShow
    });
    const sliderClass = classNames('slider', {
      show: this.state.sliderShow
    });
    return (
      <div className="select-size">
        <input type="text"
               value={ value }
               className={inputClass}
               id="select-size"
               onBlur={this.handleBlur.bind(this)}
               onChange={this.handleChange.bind(this)} />
        <label className={labelClass}
               onClick={this.handleLabelClick.bind(this)}
               htmlFor="select-size">
          { `${value} pt` }
        </label>
        <span className="Select-arrow-zone"
              onClick={this.handleLabelClick.bind(this)}>
          <span className="Select-arrow"></span>
        </span>
        <div className={sliderClass}>
          <XSlider value={value}
             min={this.state.min}
             max={this.state.max}
             step={this.state.step}
             handleSliderChange={handleSliderChange}/>
        </div>
      </div>
    )
  }
}

FontSize.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  tipFormatter: PropTypes.func,
  vertical: PropTypes.bool,
  handleSliderChange: PropTypes.func
}

export default FontSize;
