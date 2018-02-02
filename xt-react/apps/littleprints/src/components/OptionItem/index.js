import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import './index.scss';


class OptionItem extends Component {
  constructor(props) {
    super(props);
    this.itemChange = this.itemChange.bind(this);
  }

  itemChange(key, value) {
    const { data, actions } = this.props;
    const { boundProjectActions, boundTrackerActions } = actions;
    const { selected, project } = data;
    const { setting } = project;
    if (selected === value) return;
    if (key === 'startDate') {
      const startMonth = value.split('_')[0];
      const startYear = value.split('_')[1];
      boundProjectActions.changeCalendarSetting({ startMonth, startYear });
    } else {
      boundProjectActions.changeProjectSetting({ [key]: value });
    }
  }
  render() {
    const {
      t,
      actions,
      data
    } = this.props;
    const {
      name,
      list,
      title,
      selected
    } = data;

    const optionItemClass = classNames('OptionItem');
    return (
      <div className={optionItemClass}>
        <div className="option-item-title">{title}:</div>
        <div className="item">
          {
            list.map(
              (value, index) => {
                const id = value.get('id');
                const itemName = value.get('name');
                const optionItemClass = classNames('item-span', {
                  selected: selected === id
                });
                return (
                  <span className={optionItemClass} key={id}>
                      <input
                        type="radio"
                        name={name}
                        id={id}
                        checked={selected === id}
                        onClick={() => { this.itemChange(name, id); }}
                      />
                      <label htmlFor={id}>{itemName}</label>
                  </span>);
              })
            }
        </div>
      </div>
    );
  }
}

OptionItem.proptype = {

};

export default translate('OptionItem')(OptionItem);
