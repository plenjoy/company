import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XToggleSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked
    };

    this.onChange = () => {
      const { onChange, value } = props;
      const isChecked = !this.checkbox.checked;

      this.checkbox.checked = isChecked;
      this.setState({
        checked: isChecked
      });

      if (typeof onChange === 'function') {
        onChange({
          value,
          checked: isChecked
        });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.checked !== nextProps.checked) {
      this.setState({
        checked: nextProps.checked
      });
    }
  }

  render() {
    const {
      className,
      style,

      // checkbox attribute
      name = '',
      value = '',
      disabled = false,
      isShowChecked = false,

      // sm/lg
      size = 'sm'
    } = this.props;

    const checked = this.state.checked;
    const xToggleSwitchClass = classNames('x-toggle-switch', className, size);
    const xToggleSwitchStyle = style;

    return (
      <div
        className={xToggleSwitchClass}
        style={xToggleSwitchStyle}
        onClick={this.onChange.bind(this)}
      >
        <input
          className="native-checkbox"
          ref={node => (this.checkbox = node)}
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={checked}
          checked={checked}
          disabled={disabled}
        />
        <span className="icon" />
      </div>
    );
  }
}

export default XToggleSwitch;
