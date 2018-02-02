import React, { Component } from 'react';
import { allImgColors } from '../CoverColorIcon/index';
import './index.scss';

class ColorSelectOptions extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(event) {
    const { onSelect, option } = this.props;
    onSelect(option, event);
    event.preventDefault();
    event.stopPropagation();
  }

  handleMouseEnter(event) {
    const { onFocus, option } = this.props;
    onFocus(option, event);
  }

  handleMouseMove(event) {
    const { onFocus, option } = this.props;
    onFocus(option, event);
  }

  render() {
    const { className } = this.props;
    const { label, value, cover } = this.props.option;
    const colorImgObj = allImgColors[cover];

    return (
      <div
        className="each-color"
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleonMouseOut}
      >
        <span>{label}</span>
        <img src={colorImgObj[value]} />
      </div>
    );
  }
}

export default ColorSelectOptions;
