import React, { Component, PropTypes } from 'react';
import './index.scss';

export default class XProgress extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height, percent } = this.props;

    return (
     <span className="progress-c"
           style={{
            width: width ? width + 'px' : "",
            height: height ? height + 'px' : ""
           }}>
        <span className="progress"
              style={{
                width: percent + "%"
              }}>
        </span>
      </span>
    );
  }
}

XProgress.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};
