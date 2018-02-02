import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import './index.scss';
import { numberToHex } from '../../../../common/utils/colorConverter';

class SizeOptionItem extends Component {
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
      project,
      spec
    } = data;
    const product = project.setting.get('product');
    const squareSizeArray = spec.get('configurableOptionArray').find((value, index, array) => {
              return value.get('id') === 'shape';
          }).toJS().entry.find(o => o.value.indexOf('Square') != -1 && o.key.product.indexOf(product) != -1 ).key.size;
    
    const rectItems = list.map((value, index) => {
      const id = value.get('id');
      if(squareSizeArray.indexOf(id) !== -1) return;
      const itemName = value.get('name') ? value.get('name') : value.get('title');
      const optionItemClass = classNames('item-div', {
        selected: selected === id
      });
      return (
        <div className={optionItemClass} key={id}>
            <input
              type='radio'
              name={name}
              id={id}
              checked={selected === id}
              onChange={() => this.itemChange(name, id)}
            />
            <label htmlFor={id} >{itemName}</label>
        </div>
      );
    }).toArray();

    const squareItems = list.map((value, index) => {
      const id = value.get('id');
      if(squareSizeArray.indexOf(id) === -1) return null;
      const itemName = value.get('name') ? value.get('name') : value.get('title');
      const optionItemClass = classNames('item-div', {
        selected: selected === id
      });
      return (
        <div className={optionItemClass} key={id}>
            <input
              type='radio'
              name={name}
              id={id}
              checked={selected === id}
              onChange={() => this.itemChange(name, id)}
            />
            <label htmlFor={id} >{itemName}</label>
        </div>
      );
    }).toArray();
    const fixSquareItems = [];
    squareItems.forEach((item) => {
      if(item){
        fixSquareItems.push(item);
      }
    });
    const optionItemClass = classNames('SizeOptionItem');
    return (
      <div className={optionItemClass}>
        <div className="option-item-title">{title}:</div>
        <div className="item">
          <div className="sub-title">
            <label>Rectangle</label>
          </div>
          { rectItems }
        </div>
        {(fixSquareItems && fixSquareItems.length > 0)
        ?
        <div className="item">
          <div className="sub-title">
            <label>Square</label>
          </div>
          { fixSquareItems }
        </div>
        :
        null
        }
      </div>
    );
  }
}

SizeOptionItem.proptype = {

};

export default translate('SizeOptionItem')(SizeOptionItem);
