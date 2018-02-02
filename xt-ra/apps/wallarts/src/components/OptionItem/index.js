import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import './index.scss';
import { numberToHex } from '../../../../common/utils/colorConverter';

class OptionItem extends Component {
  constructor(props) {
    super(props);
    this.onBgColorChange = this.onBgColorChange.bind(this)
  }

  onBgColorChange(color) {
    const { actions } = this.props;
    const { optionChange } = actions;
    /*this.setState({
      bgColor: color.hex
    });*/
    optionChange('canvasBorderColor', color);
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
      selected,
      project
    } = data;
    const items = list.map((value, index) => {
      const id = value.get('id');
      const itemName = value.get('name') ? value.get('name') : value.get('title');
      const optionItemClass = classNames('item-span', {
        selected: selected === id
      });
      const colorClass = classNames({ 'colorPick' : name === 'canvasBorder' && id === 'color' });
      const popoverClass = classNames('color-picker','popover');
      let colorString = '#000000';
      if(name == 'canvasBorder' && id == 'color' && selected === id){
        colorString = numberToHex(project.pageArray.present.toJS()[0].canvasBorder.color);
      }
      
      if(id === 'categoryTableTop'){
        return null;
      }
      return (
        <span className={optionItemClass} key={id}>
            <input
              type='radio'
              name={name}
              id={id}
              checked={selected === id}
              onChange={() => this.itemChange(name, id)}
            />
            <label htmlFor={id} className={colorClass}>{itemName}</label>
            {
              name == 'canvasBorder' && id == 'color' && selected === id
              ?
              <XColorPicker 
                className={popoverClass}
                needResetColor={true}
                initHexString={colorString}
                onColorChange={() => {} }
                onColorChangeComplete={(color) => this.onBgColorChange(color)}
              />
              :
              null
            }
            
        </span>
      );
    }).toArray();
    const optionItemClass = classNames('OptionItem');
    return (
      <div className={optionItemClass}>
        <div className="option-item-title">{title}:</div>
        <div className="item">
          { items }
        </div>
      </div>
    );
  }
}

OptionItem.proptype = {

};

export default translate('OptionItem')(OptionItem);
