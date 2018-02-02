import React, { Component, PropTypes } from 'react';
import XButton from '../XButton';

import classNames from 'classnames';
import './index.scss';

class XToggle extends Component {
  constructor(props) {
    super(props);

    const { firstText, secondText, value = 1 } = props;

    this.state = {
      // 1: toggle on
      // 2: toggle off
      value,
      firstText,
      secondText
    };

    this.onClickBtn = () => {
      const value = this.state.value === 1 ? 2 : 1;
      this.setState({
        value
      });

      const { onClicked } = this.props;
      onClicked && onClicked(value);
    };
  }

  componentWillReceiveProps(nextProps) {
    const { firstText, secondText, value = 1 } = nextProps;

    if (this.props.value !== value) {
      this.setState({
        value: nextProps.value
      });
    }

    if (this.props.firstText !== firstText) {
      this.setState({
        firstText
      });
    }

    if (this.props.secondText !== secondText) {
      this.setState({
        secondText
      });
    }
  }

  render() {
    const { className } = this.props;
    const btnClass = classNames('x-toggle', className);

    const { firstText, secondText, value } = this.state;
    const text = value  === 1 ? secondText : firstText;

    return (
      <XButton className={btnClass} onClicked={this.onClickBtn}>
        <span>{text}</span>
      </XButton>
    );
  }
}

XToggle.propTypes = {
  value: PropTypes.number,
  firstText: PropTypes.string,
  secondText: PropTypes.string,
  onClicked: PropTypes.func
};

XToggle.defaultProps = {
  value: 1,
  firstText: 'Text 1',
  secondText: 'Text 2',
  onClicked: () => {}
};

export default XToggle;
