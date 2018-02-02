import React, { Component } from 'react';
import Immutable, { List } from 'immutable';
import { translate } from 'react-translate';

import { merge, get } from 'lodash';

import { monthStrings } from '../../constants/strings';

import OptionItem from '../OptionItem';
import './index.scss';


class OptionTab extends Component {
  constructor(props) {
    super(props);
    const startDates = this.getStartDates();

    this.state = {
      startDates
    };
  }

  getStartDates() {
    const startDates = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startMonth = currentMonth > 5 ? 7 : 1;
    for (let i = 0; i < 6; i ++) {
      startDates.push({
        id: `${startMonth + i}_${currentYear}`,
        month: startMonth + i,
        year: currentYear,
        name: `${monthStrings[startMonth + i - 1]} ${currentYear}`
      });
    }
    startDates.push({
      id: `1_${currentYear+1}`,
      month: 1,
      year: currentYear + 1,
      name: `${monthStrings['0']} ${currentYear + 1}`
    });

    return Immutable.fromJS(startDates);
  }

  render() {
    const {
      t,
      actions,
      data
    } = this.props;
    const { startDates } = this.state;
    const { project } = data;
    const { boundProjectActions, boundTrackerActions, boundPriceActions, onApplyTemplate, applyRelativeTemplate } = actions;
    const sizes = project.availableOptionMap.get('size');
    const dateStyles = project.availableOptionMap.get('dateStyle');
    const orderInfo = project.orderInfo;
    const checkFailed = orderInfo.get('isCheckFailed');
    const sizeOptionItemData = {
      name: 'size',
      list: sizes,
      title: 'Size',
      selected: project.setting.get('size'),
      project
    };
    const dateStyleOptionItemData = {
      name: 'dateStyle',
      list: dateStyles,
      title: 'Style',
      selected: project.setting.get('dateStyle'),
      project
    };
    const startDateOptionItemData = {
      name: 'startDate',
      list: startDates,
      title: 'Starting Date',
      selected: `${project.calendarSetting.get('startMonth')}_${project.calendarSetting.get('startYear')}`,
      project
    };
    const optionItemActions = { boundProjectActions, boundTrackerActions, boundPriceActions, onApplyTemplate, applyRelativeTemplate };

    // TODO 当前禁用 dateStyle 的选择
    const isDateStyleDisabled = true;


    return (
      <div className="OptionTab">
        {
          sizes && !checkFailed
          ? <OptionItem data={sizeOptionItemData} actions={optionItemActions} ></OptionItem>
          : null
        }
        {/*
          startDates
          ? <OptionItem data={startDateOptionItemData} actions={optionItemActions} ></OptionItem>
          : null
        */}
        {
          dateStyles && !isDateStyleDisabled
          ? <OptionItem data={dateStyleOptionItemData} actions={optionItemActions} ></OptionItem>
          : null
        }
      </div>
    );
  }
}

OptionTab.proptype = {

};

export default translate('OptionTab')(OptionTab);
