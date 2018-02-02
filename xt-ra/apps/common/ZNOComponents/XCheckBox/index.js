import React, { Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class XCheckBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked
    };

    this.onClicked = () => {
      const { onClicked, value } = props;
      const isChecked = !this.checkbox.checked;

      this.checkbox.checked = isChecked;
      this.setState({
        checked: isChecked
      });

      if (typeof onClicked === 'function') {
        onClicked({
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
      text,
      subText,
      contents,

      // checkbox attribute
      name = '',
      value = '',
      disabled = false,
      isShowChecked = false
    } = this.props;

    const checked = this.state.checked;
    const xCheckBoxClass = classNames('x-checkbox', className);
    const xCheckBoxStyle = style;

    return (
      <div
        className={xCheckBoxClass}
        style={xCheckBoxStyle}
        onClick={this.onClicked.bind(this)}
      >
        <input
          className="native-checkbox"
          ref={node => this.checkbox = node}
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={checked}
          checked={checked}
          disabled={disabled}
        />
        <span className="icon" />

        <div className="options">
          <div className="top-title">
            {
            text ? <span className="text">{text}</span> : null
            }

            {
            subText ? <div className="sub-text">{subText}</div> : null
            }
          </div>
          {
            contents ? <div className="contents">{contents}</div> : null
          }
        </div>
      </div>
    );
  }
}


export default XCheckBox;
