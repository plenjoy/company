import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

import * as handler from './handle';

class SimplePagination extends Component {

  constructor(props, context) {
    super(props, context);

    const { data } = this.props;
    const { total, current = 0 } = data;

    // 计时器.
    this.timer = null;

    this.state = {
      // 总页数
      total,

      // 当前的页数, 0: 封面
      current
    };

    this.goPrevious = (ev) => {
      const event = ev || window.event;
      event.preventDefault();
      handler.goPrevious(this);
    };

    this.goNext = (ev) => {
      const event = ev || window.event;
      event.preventDefault();
      handler.goNext(this);
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const { total, current } = data;

    if (total !== nextProps.data.total) {
      this.setState({
        total: nextProps.data.total
      });
    }

    if (current !== nextProps.data.current) {
      this.setState({
        current: nextProps.data.current
      });
    }
  }

  render() {
    const { data, } = this.props;
    const { className, style, iconCaleStyle, minSheetIndex } = data;
    const cName = classNames('x-simple-pagination', className);
    const newMinSheetIndex = minSheetIndex || 0;

    const total = this.state.total;
    const current = this.state.current;

    const disablePrevious = current === newMinSheetIndex;
    const disableNext = current === total;

    return (
      <div className={cName} style={style}>
        {
          disablePrevious ? null : (
            <label>
              <input disabled={disablePrevious} />
              <span className="previous-icon icon" onClick={this.goPrevious} style={iconCaleStyle} />
            </label>
          )
        }

        {
          disableNext ? null : (
            <label>
              <input disabled={disableNext} />
              <span className="next-icon icon" onClick={this.goNext} style={iconCaleStyle} />
            </label>
          )
        }
      </div>
    );
  }
}

SimplePagination.propTypes = {
  actions: PropTypes.shape({
    onPage: PropTypes.func
  }),
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    current: PropTypes.number
  })
};

SimplePagination.defaultProps = {
  data: {
    total: 1,
    current: 0
  }
};

export default SimplePagination;
