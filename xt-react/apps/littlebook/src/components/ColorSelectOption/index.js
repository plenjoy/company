import React, { Component } from 'react';
import { coverNames } from '../../contants/strings';
import { allImgColors } from './handle';
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
    let colorImgObj = {};
    switch (cover.toLowerCase()) {
      case coverNames.bling.toLowerCase(): {
         colorImgObj = allImgColors['bling'];
         break;
      }
      case coverNames.linen.toLowerCase(): {
          colorImgObj = allImgColors['linen'];
          break;
      }
      case coverNames.genuineCrystalLeather.toLowerCase():
      case coverNames.metalGenuineLeather.toLowerCase():
      case coverNames.genuineLeather.toLowerCase(): {
          colorImgObj = allImgColors['genuineLeather'];
          break;
      }
      case coverNames.leatherette.toLowerCase():
      case coverNames.metalLeatherette.toLowerCase():
      case coverNames.crystalLeather.toLowerCase(): {
          colorImgObj = allImgColors['leatherette'];
          break;
      }

    }
    return (
      <div
        className='each-color'
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
