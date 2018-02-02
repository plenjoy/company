import React, { Component, PropTypes } from 'react';
import { merge } from 'lodash';
import { SketchPicker } from 'react-color';

import {
  hexToRGB,
} from '../../utils/colorConverter';

import './index.scss';

class XColorPicker extends Component {
  constructor(props) {
    super(props);

    const { initHexString } = this.props;
    const defaultColor = {
      r: '255',
      g: '255',
      b: '255'
    };

    let color = defaultColor;
    if (initHexString) {
      const [r, g, b] = hexToRGB(initHexString);
      color = merge({}, defaultColor, { r, g, b });
    }

    this.state = {
      displayColorPicker: false,
      color
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldNeedResetColor = this.props.needResetColor;
    const newNeedResetColor = nextProps.needResetColor;

    if (oldNeedResetColor !== newNeedResetColor && newNeedResetColor) {
      const [r, g, b] = hexToRGB(nextProps.initHexString);
      this.setState({
        color: { r, g, b }
      });
    }
  }

  handleClick() {
    this.setState(
      { displayColorPicker: !this.state.displayColorPicker },
      () => {
        if (this.state.displayColorPicker) {
          this.popover.focus();
        }
      }
    );
  }

  handleChange(color) {
    this.setState({ color: color.rgb });

    this.props.onColorChange(color);
  }

  handleClose(e) {
    const { currentTarget } = e;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ displayColorPicker: false });
      }
    }, 0);
  }

  render() {
    const { displayColorPicker, color } = this.state;

    const colorStyle = {
      background: `rgb(${color.r}, ${color.g}, ${color.b})`
    };

    const presetColors = [
      '#E5F1E1', '#F6D8DA', '#7CE0D3', '#FF9999', '#ADC1E4', '#E2DAC8',
      '#93B55A', '#FFCE43', '#CC000E', '#71000A', '#155B4D', '#4D8BF5',
      '#121639', '#000000', '#E3E3E3', '#FFFFFF',
    ];

    return (
      <div className="color-picker">
        <div className="swatch" onClick={this.handleClick}>
          <div className="color" style={colorStyle} />
        </div>

        {
          displayColorPicker
          ? (
            <div
              className="popover"
              tabIndex="-1"
              ref={(div) => { this.popover = div; }}
              onBlur={this.handleClose}
            >
              <SketchPicker
                color={color}
                onChange={this.handleChange}
                presetColors={presetColors}
                disableAlpha
              />
            </div>
          )
          : null
        }

      </div>
    );
  }
}

XColorPicker.propTypes = {
  onColorChange: PropTypes.func.isRequired,
  initHexString: PropTypes.string,
  needResetColor: PropTypes.bool,
};

export default XColorPicker;
