import classNames from 'classnames';
import React, { Component } from 'react';
import { translate } from 'react-translate';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import './index.scss';
import { numberToHex } from '../../../../common/utils/colorConverter';

class OptionItemGroup extends Component {
  constructor(props) {
    super(props);
  }

  itemChange(key,mainKey,pertainKey) {
    const { data, actions } = this.props;
    const { optionChange } = actions;
    const { mainSelected, pertainSelected } = data;
    const keyArray = key.split('-');
    const selectMainValue = keyArray[0];
    const selectPertainValue = keyArray[1];
    if(selectMainValue !== mainSelected){
      optionChange(mainKey, selectMainValue);
    }

    if(selectPertainValue !== pertainSelected){
      optionChange(pertainKey, selectPertainValue);
    }
    
  }
  render() {
    const {
      t,
      actions,
      data
    } = this.props;
    const {
      mainKey,
      pertainKey,
      delimiter,
      mainOptionArray,
      pertainAllOptionArray,
      configurableOptionMap,
      mainSelected,
      pertainSelected,
      disableOptionMap,
      title,
      project,
      spec
    } = data;
    const groupList=[];
    mainOptionArray.map((value, index) => {
      
      const title = value.get('title');
      const id = value.get('id');
      const selected = (mainSelected == id);
      let ids,titles,selecteds; 
      //console.log('id',id,configurableOptionMap);
      configurableOptionMap.get('entry').map((value, index) => {
        if(value.get('key').get(mainKey).includes(id)){
          const pertainList = value.get('value').toJS();
          let inDisableList = false;
          //console.log(pertainList)
          disableOptionMap.get('entry').map((value, index) => {
            if(value.get('key').get(mainKey).includes(id)){
              const disableList = value.get('value').toJS();
              pertainList.map((value, index) => {
                const key = value;
                if(disableList.indexOf(key) == -1){
                  //console.log(key);
                  ids = id+'-'+key;
                  const itemTitle = pertainAllOptionArray.filter((item) => item.get('id') == key).getIn(['0','title']);
                  titles = title+' - '+itemTitle; 
                  selecteds = selected+'-'+(pertainSelected == key);
                  groupList.push({ids,titles,selecteds,mainKey,pertainKey});
                }

              });
              inDisableList = true;
            }

          });
          if(!inDisableList){
            pertainList.map((value, index) => {
              const key = value;
              //console.log(key);
              ids = id+'-'+key;
              const itemTitle = pertainAllOptionArray.filter((item) => item.get('id') == key).getIn(['0','title']);
              titles = title+' - '+itemTitle;
              selecteds = selected+'-'+(pertainSelected == key);
              groupList.push({ids,titles,selecteds,mainKey,pertainKey});
            });
          }
          
        }
        
      });
      
    });
    const items = groupList.map((value, index) => {
      const id = value.ids;
      const itemName = value.titles;
      const {mainKey, pertainKey} = value;
      const optionItemClass = classNames('item-span', {
        selected: value.selecteds == 'true-true'
      });
      
      return (
        <span className={optionItemClass} key={id}>
            <input
              type='radio'
              name={itemName}
              id={id}
              checked={value.selecteds == 'true-true'}
              onChange={() => this.itemChange(id,mainKey,pertainKey)}
            />
            <label htmlFor={id}>{itemName}</label>
            
        </span>
      );
    });
    const optionItemClass = classNames('OptionItemGroup');
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

OptionItemGroup.proptype = {

};

export default translate('OptionItemGroup')(OptionItemGroup);
