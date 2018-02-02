import React, { Component } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { shapeUrlMap, sideMenuConfigList } from '../../constants/optionConfig';
import { fromJS } from 'immutable';

import './index.scss';
import XToolTip from '../../../../common/ZNOComponents/XToolTip';

class ShapeMenus extends Component {
  state = {
    menuArray: []
  };

  constructor() {
    super();

    this.optionChange = this.optionChange.bind(this);
  }

  componentDidMount() {
    const { menuArray } = this.state;
    this.setState({ menuArray });
  }

  optionChange(key, value) {
    const { data, actions } = this.props;
    const { boundProjectActions, boundTrackerActions } = actions;
    
    boundProjectActions.changeProjectSetting({ [key]: value });
  }

  getRenderMenuItems(optionArray) {
    const { data, actions, t } = this.props;
    const { project } = data;
    const { menuArray } = this.state;

    return optionArray.map((option, index) => {
      const currentOptionId = option.get('id');
      const selectOptionId = project.setting.get('shape');
      const isDisabled = option.get('disabled');

      const shapeUrl = shapeUrlMap.find(item => item.key === currentOptionId);
      const usedShapeUrl = isDisabled
        ? shapeUrl.disableUrl
        :(currentOptionId === selectOptionId
          ? shapeUrl.url
          : shapeUrl.unselectUrl);

      const menuItemClass = classNames('menu-item', {
        selected: currentOptionId === selectOptionId,
        disabled: isDisabled
      });

      const itemNameClass = classNames('menu-item-name', {
        selected: currentOptionId === selectOptionId,
        disabled: isDisabled
      });

      return (
        <div className={menuItemClass} key={index}>

          <div className="shape-menu-item" ref={menuItem => this.state.menuArray[index] = menuItem} onClick={() => !isDisabled ? this.optionChange('shape', currentOptionId) : null}>
            <img className="menu-item-img" src={usedShapeUrl} />
            <div className={itemNameClass}>{option.get('title')}</div>
          </div>

          {isDisabled && this.state.menuArray[index] ? (
            <XToolTip element={this.state.menuArray[index]} defaultPosition={XToolTip.RIGHT} extendOffset={5}>
              {t(option.get('title'))}
            </XToolTip>
          ) : null}

        </div>
      );
    })
  }

  render() {
    const { data, actions } = this.props;
    const { project } = data;

    const productName = project.setting.get('product');
    const { optionIds } = sideMenuConfigList.find(item => item.product === productName);
    const isInConfig = optionIds.some(item => item.type === 'shape');
    const isOptionMapExisted = !!project.availableOptionMap.size;

    let optionArray = isInConfig && isOptionMapExisted
      ? project.availableOptionMap.get('shape').filter(option => shapeUrlMap.find(urlObj => urlObj.key === option.get('id')))
      : fromJS([]);

    // 如果size存在，并且不存在Round选项时，强制添加Round OPTION
    if(project.availableOptionMap.size && !project.availableOptionMap.get('shape').some(option => option.get('id') === 'Round')) {
      optionArray = optionArray.push(fromJS({
        id: 'Round',
        title: 'Round',
        disabled: true
      }));
    }

    // 将shapeUrlMap中的title merge进来
    optionArray = optionArray.map(option => {
      const { title } = shapeUrlMap.find(urlObj => urlObj.key === option.get('id')) || {};
      return option.set('title', title ? title : option.get('title'));
    });

    const menuClass = classNames('shape-menu', {
      hide: !isInConfig
    });

    return (
      <div className={menuClass}>
        {this.getRenderMenuItems(optionArray)}
      </div>
    );
  }
}

export default translate('ShapeMenus')(ShapeMenus);