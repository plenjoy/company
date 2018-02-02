import React, { Component } from 'react';
import Immutable, { List } from 'immutable';
import { translate } from 'react-translate';

import { merge, get, isArray } from 'lodash';

import OptionItem from '../OptionItem';
import OptionItemGroup from '../OptionItemGroup';
import SizeOptionItem from '../SizeOptionItem';
import ColorOptionItem from '../ColorOptionItem';
import './index.scss';
import { wallartsConfigList } from '../../constants/optionConfig';
import * as handler from './handler';
class OptionTab extends Component {
  constructor(props) {
    super(props);
    this.optionChange = (key, value) => handler.optionChangeHandler(this, key, value);
    this.state = {
    };
  }

  render() {
    const {
      t,
      actions,
      data
    } = this.props;
    const { project,spec } = data;
    const { boundProjectActions, boundTrackerActions, boundPriceActions } = actions;
    const currentProduct = project.setting.get('product');
    if(currentProduct){
      const currentConfig = wallartsConfigList.filter((item) => {
        return item.product === currentProduct;
      });
      const optionChange = this.optionChange;
      const options = currentConfig[0].optionIds.map((item, index) => {
        if(item.isGroup){
          const {title, mainKey, pertainKey, delimiter} = item;
          const mainOptionArray = project.availableOptionMap.get(mainKey);
          const pertainAllOptionArray = spec.getIn(['allOptionMap',pertainKey]);
          const configurableOptionMap = spec.get('configurableOptionArray').filter((item) => item.get('id') == pertainKey).get('0');
          const mainSelected = project.setting.get(mainKey);
          const pertainSelected = project.setting.get(pertainKey);
          const disableOptionMap = spec.get('disableOptionArray').filter((item) => item.get('id') == pertainKey).get('0');
          const optionItemActions = { boundProjectActions, boundTrackerActions, optionChange };
          const optionItemData = {
            mainKey,
            pertainKey,
            delimiter,
            mainOptionArray,
            pertainAllOptionArray,
            configurableOptionMap,
            disableOptionMap,
            mainSelected,
            pertainSelected,
            title,
            project,
            spec
          };
          return (
            (mainOptionArray)?
              <OptionItemGroup key={index} data={optionItemData} actions={optionItemActions} ></OptionItemGroup>
            :
              null
            
          );
          
        }else{
          const type = item.type;
          const title = item.title;
          const optionArray = project.availableOptionMap.get(type);
          if(optionArray){
            if(optionArray.size === 1 && optionArray.get('0').get('id') === 'none'){
              return null;
            }else{
              const optionItemActions = { boundProjectActions, boundTrackerActions, optionChange };
              const optionItemData = {
                name: type,
                list: optionArray,
                title,
                selected: project.setting.get(type),
                project,
                spec
              };
              return (
                (type !== 'color')
                ?
                  (type !== 'size')
                  ?
                  <OptionItem key={index} data={optionItemData} actions={optionItemActions} ></OptionItem>
                  :
                  <SizeOptionItem key={index} data={optionItemData} actions={optionItemActions} ></SizeOptionItem>
                :
                  <ColorOptionItem key={index} data={optionItemData} actions={optionItemActions} ></ColorOptionItem>
              );
            }
            
          }

        }
        
      });
      return (
        <div className="OptionTab">
          {options}
        </div>
      );
    }else{
      return (
        <div className="OptionTab">
        </div>
      );
    }
  }
}

OptionTab.proptype = {

};

export default translate('OptionTab')(OptionTab);
