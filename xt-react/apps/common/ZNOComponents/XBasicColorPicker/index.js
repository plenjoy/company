import React, { Component, PropTypes } from 'react';

import './index.scss';

class XBasicColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleClose(e) {
    const { currentTarget } = e;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ displayColorPicker: false });
      }
    }, 0);
  }

  handleChange(color, e) {
    this.props.onColorChange({ hex: color });
  }

  render() {
    const { displayColorPicker } = this.state;
    const { initHexString, colors } = this.props;

    const colorStyle = {
      backgroundColor: initHexString
    };

    return (
      <div className="basic-color-picker">
        <div className="swatch" onClick={this.handleClick}>
          <div className="color" style={colorStyle} />
        </div>

        {displayColorPicker ? (
          <div
            className="popover"
            tabIndex="-1"
            ref={(div) => {
              this.popover = div;
            }}
            onBlur={this.handleClose}
          >
            {colors.map((color) => {
              return (
                <span
                  className="popover-swatch"
                  title={color}
                  style={{ backgroundColor: color }}
                  onClick={this.handleChange.bind(this, color)}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

XBasicColorPicker.propTypes = {
  initHexString: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default XBasicColorPicker;
