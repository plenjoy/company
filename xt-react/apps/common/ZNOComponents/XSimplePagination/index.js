import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

import * as handler from './handle';

class XSimplePagination extends Component {

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
    const { className, style, iconCaleStyle } = data;
    const cName = classNames('x-simple-pagination', className);

    const total = this.state.total;
    const current = this.state.current;

    const disablePrevious = current === 0;
    const disableNext = current === total;

    return (
      <div className={cName} style={style}>
        {
          disablePrevious ? null : (
            <label className="previous">
              <input disabled={disablePrevious} />
              <span className="previous-icon icon" onClick={this.goPrevious} style={iconCaleStyle} />
            </label>
          )
        }

        {
          disableNext ? null : (
            <label className="next">
              <input disabled={disableNext} />
              <span className="next-icon icon" onClick={this.goNext} style={iconCaleStyle} />
            </label>
          )
        }
      </div>
    );
  }
}

XSimplePagination.propTypes = {
  actions: PropTypes.shape({
    onPage: PropTypes.func
  }),
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    current: PropTypes.number
  })
};

XSimplePagination.defaultProps = {
  data: {
    total: 1,
    current: 0
  }
};

export default XSimplePagination;
