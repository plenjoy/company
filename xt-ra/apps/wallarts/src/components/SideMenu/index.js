import React, { Component } from 'react';
import { get } from 'lodash';

import './index.scss';
import { borderWhiteRatio } from '../../constants/strings';

class SideMenu extends Component {
  constructor() {
    super();
  }

  render() {
    const { children, data, actions } = this.props;
    const { size, project } = data;

    const productName = project.setting.get('product');
    const sheetX = get(size, 'renderContainerProps.x');
    const sheetY = get(size, 'renderContainerProps.y');
    const sheetWidth = Math.floor(get(size, 'renderContainerProps.width'));
    const sheetHeight = Math.floor(get(size, 'renderContainerProps.height'));
    const rightWhitePadding = get(size, 'renderWhitePadding.right');
    const whitePaddingRatio = borderWhiteRatio[productName] ? borderWhiteRatio[productName] : 1;

    const style = {
      top: sheetY,
      left: sheetX + sheetWidth + 24 - rightWhitePadding * whitePaddingRatio,
      height: sheetHeight
    };

    return (
      <div className="option-side-menu" style={style}>
        <div className="side-menu-container">
          { children }
        </div>
      </div>
    )
  }
}

export default SideMenu;