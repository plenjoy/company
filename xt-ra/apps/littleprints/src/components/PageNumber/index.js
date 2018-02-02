import React, { Component, PropTypes } from 'react';
import { get, isEqual } from 'lodash';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import classNames from 'classnames';
import './index.scss';

import { monthStrings } from '../../constants/strings';

class PageNumber extends Component {
  constructor(props) {
    super(props);
    this.getPageNumberMessage = this.getPageNumberMessage.bind(this);
  }

  getPageNumberMessage() {
    const { data } = this.props;
    const { pageNumberData } = data;
    const { month, year } = pageNumberData;
    if(month === 0) {
      return 'Cover';
    } else {
      return `${monthStrings[month-1]} ${year}`;
    }
  }

  render() {
    const { data } = this.props;
    const { pageNumberData, className } = data;
    const pageNumberClassName = classNames('page-number', className);
    const pageNumberMessage = this.getPageNumberMessage();

    return (<div className={pageNumberClassName} >
      <span>{pageNumberMessage}</span>
    </div>);
  }
}

PageNumber.defaultProps = {
  actions: {
    switchPage: () => {}
  },
  data: {
    pageNumberData: {
      month: 0,
      year: 2017,
      sheetIndex: 0
    }
  }
};

export default translate('PageNumber')(PageNumber);
