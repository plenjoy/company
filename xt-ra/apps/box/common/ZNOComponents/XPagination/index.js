import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from "react-translate";
import './index.scss';

import * as handler from './handle';

class XPagination extends Component {

  constructor(props, context) {
    super(props, context);

    const { data} = this.props;
    const { total, current = 0, pageStep = 2 } = data;

    // 计时器.
    this.timer = null;

    this.state = {
      // 总页数
      total,

      // 当前的页数, 0: 封面
      current,

      // 每一sheet的子页的数量.
      pageStep
    };

    this.goFirst = (ev) => {
      const event = ev || window.event;
      event.preventDefault();
      handler.goFirst(this);
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

    this.goLast = (ev) => {
      const event = ev || window.event;
      event.preventDefault();
      handler.goLast(this);
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data} = this.props;
    const { total, current, pageStep } = data;

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

    if (pageStep !== nextProps.data.pageStep) {
      this.setState({
        pageStep: nextProps.data.pageStep
      });
    }
  }

  render() {
    const { data, t} = this.props;
    const { className, style, isPressBook } = data;
    const cName = classNames('x-pagination', className);

    const total = this.state.total;
    const current = this.state.current;
    const pageStep = this.state.pageStep;

    let currentPages = [];

    if(isPressBook){
      if(current === 1){
        currentPages = [1];
      }else if(current === total){
        currentPages = [(current - 1) * pageStep];
      } else{
        currentPages = [(current - 1) * pageStep, (current - 1) * pageStep + 1];
      }
    }else{
      currentPages = [current * pageStep - 1, current * pageStep];
    }

    let tip1 = t('COVER');
    let tip2 = '';

    if (current > 0) {
      tip1 = `${t('SHEET')} ${current} ${t('OF')} ${total}`;

      if(currentPages.length === 1){
        tip2 = `${t('PAGE')} ${currentPages[0]}`;
      }else{
        tip2 = `${t('PAGE')} ${currentPages[0]} & ${currentPages[1]}`;
      }
    }

    return (
      <ul className={cName} style={style}>
        <li className="item first" onClick={this.goFirst}>
          <label>
            <input type="checkbox" disabled={current === 0}/>
            <a></a>
          </label>
        </li>
        <li className="item previous" onClick={this.goPrevious}>
          <label>
            <input type="checkbox" disabled={current === 0}/>
            <a></a>
          </label>
        </li>
        <li className="item tip">
          <label>{tip1}</label>
          <label>{tip2}</label>
        </li>
        <li className="item next" onClick={this.goNext}>
          <label>
            <input type="checkbox" disabled={current === total}/>
            <a></a>
          </label>
        </li>
        <li className="item last" onClick={this.goLast}>
          <label>
            <input type="checkbox" disabled={current === total}/>
            <a></a>
          </label>
        </li>
      </ul>
    );
  }
}

XPagination.propTypes = {
  actions: PropTypes.shape({
    onPage: PropTypes.func
  }),
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    current: PropTypes.number,
    pageStep: PropTypes.number,
    isPressBook: PropTypes.bool
  })
};

XPagination.defaultProps = {
  data: {
    total: 1,
    current: 0,
    pageStep: 2,
    isPressBook: false
  }
};

export default translate('XPagination')(XPagination);
