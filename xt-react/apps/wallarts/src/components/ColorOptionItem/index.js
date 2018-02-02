import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';

import './index.scss';
import { colorUrlMap } from '../../constants/optionConfig';

class ColorOptionItem extends Component {
  constructor(props) {
    super(props);
  }

  itemChange(key, value) {
    const { data, actions } = this.props;
    const { optionChange } = actions;
    const { selected } = data;
    if (selected === value) return;
    optionChange(key, value);
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

    const optionItemClass = classNames('ColorOptionItem');
    return (
      <div className={optionItemClass}>
        <div className="option-item-title">{title}:</div>
        <div className="item">
          {
            list.map(
              (value, index) => {
                const id = value.get('id');
                const itemName = value.get('name')?value.get('name'):value.get('title');
                const optionItemClass = classNames('item-span', {
                  selected: selected === id
                });
                const colorUrl = colorUrlMap.filter((item,index) => {
                  return item.key === id;
                })[0];
                return (
                  <span className={optionItemClass} key={id} title={itemName}>
                      <img id={id} name={name} htmlFor={id} src={colorUrl.url} onClick={() => { this.itemChange(name, id); }}></img>
                  </span>
                  );
              })
            }
        </div>
      </div>
    );
  }
}

ColorOptionItem.proptype = {

};

export default translate('ColorOptionItem')(ColorOptionItem);
