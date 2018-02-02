import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import './index.scss';

class RichCoverTypesSwitch extends Component {
  constructor(props) {
    super(props);

    this.onSwitch = (value) => {
      props.onSwitch && props.onSwitch(value);
    };
  }

  render() {
    const { className, value } = this.props;
    const btnClass = classNames('rich-cover-type-switch', className);

    // paper cover
    const btn1 = classNames('btn', 'btn1', {
      active: value === 1
    });

    // hard cover
    const btn2 = classNames('btn', 'btn2', {
      active: value === 2
    });

    return (
      <div className={btnClass}>
        <label className={btn1} onClick={this.onSwitch.bind(this, 1)}>
          <span className="icon" />
          <div className="text-wrap">
            <p className="text">Paper</p>
            <p className="text">Cover</p>
          </div>
        </label>

        <label className={btn2} onClick={this.onSwitch.bind(this, 2)}>
          <span className="icon" />
          <div className="text-wrap">
            <p className="text">Hard</p>
            <p className="text">Cover</p>
          </div>
        </label>
      </div>
    );
  }
}

RichCoverTypesSwitch.defaultProps = {
  onSwitch: () => {},
  value: 1
};

export default RichCoverTypesSwitch;
