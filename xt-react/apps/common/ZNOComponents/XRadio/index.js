import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XRadio extends Component {

  constructor(props) {
    super(props);

    this.onClicked = () => {
      const { onClicked, value } = props;

      this.radio.checked = true;

      if (typeof onClicked === 'function') {
        onClicked(value);
      }
    };
  }

  render() {
    const {
      className,
      style,
      text,

      // radio attribute
      name = '',
      checked = false,
      disabled = false,
      value = ''
    } = this.props;

    const xRadioClass = classNames('x-radio', className);
    const xRadioStyle = style;

    return (
      <div
        className={xRadioClass}
        style={xRadioStyle}
        onClick={this.onClicked.bind(this)}
      >
        <input
          className="native-radio"
          ref={node => this.radio = node}
          type="radio"
          name={name}
          value={value}
          defaultChecked={checked}
          checked={checked}
          disabled={disabled}
        />
        <span className="icon" />

        {
          text ? <span className="text" title={text}>{text}</span> : null
        }

      </div>
    );
  }
}


export default XRadio;
