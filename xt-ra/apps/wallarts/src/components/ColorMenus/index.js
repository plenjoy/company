import React, { Component } from 'react';
import classNames from 'classnames';
import { colorUrlMap, sideMenuConfigList } from '../../constants/optionConfig';

import './index.scss';
import XToolTip from '../../../../common/ZNOComponents/XToolTip';

class ColorMenus extends Component {
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
    const { data, actions } = this.props;
    const { project } = data;
    const { menuArray } = this.state;

    return optionArray.map((option, index) => {
      const currentOptionId = option.get('id');
      const selectOptionId = project.setting.get('color');

      const colorUrl = colorUrlMap.find((item,index) => item.key === currentOptionId);

      const menuItemClass = classNames('menu-item', {
        selected: currentOptionId === selectOptionId
      });

      return (
        <div className={menuItemClass} key={index}>

          <div className="color-menu-item" ref={menuItem => this.state.menuArray[index] = menuItem} onClick={() => this.optionChange('color', currentOptionId)}>
            <img src={colorUrl.url} />
          </div>

          {menuArray[index] ? (
            <XToolTip element={this.state.menuArray[index]} defaultPosition={XToolTip.RIGHT} extendOffset={5}>
              {option.get('title')}
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
    const isInConfig = optionIds.some(item => item.type === 'color');
    const isOptionMapExisted = !!project.availableOptionMap.size;
    const optionArray = isInConfig && isOptionMapExisted ? project.availableOptionMap.get('color') : [];
    const isHideMenus = optionArray.every(option => option.get('id') === 'none');

    const menuClass = classNames('color-menu', {
      hide: isHideMenus
    });

    return (
      <div className={menuClass}>
        {this.getRenderMenuItems(optionArray)}
      </div>
    );
  }
}

export default ColorMenus;