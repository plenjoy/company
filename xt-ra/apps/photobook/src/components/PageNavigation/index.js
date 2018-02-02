import React, { Component, PropTypes } from 'react';
import { template, merge, get } from 'lodash';

import { spineExpandingTopRatio } from '../../contants/strings';
import { addMouseWheelEvent } from '../../../../common/utils/mouseWheel';

// 导入组件.
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';
import { onNavPagesSwitchSheet } from './handler/arrangePages';
import * as handler from './handler';


import './index.scss';

class PageNavigation extends Component {
  constructor(props) {
    super(props);

    this.handlerMouseWheel = dir => handler.handlerMouseWheel(this, dir);
  }

  componentDidMount() {
    addMouseWheelEvent(this.pageNav, (dir) => {
      this.handlerMouseWheel(dir);
    });
  }

  render() {
    const { actions, data } = this.props;
    const { pageNumberActions } = actions;
    const {
      urls,
      materials,
      variables,
      pagination,
      settings,
      parameters,
      navPagesRatios,
      navPagesPosition,
      navPagesSize,
      allSheets,
      specData,
      coverSpreadForInnerWrap,
      capability,
      env
    } = data;

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    if (navPagesSize.coverSpreadSize.width &&
      navPagesRatios.coverWorkspace &&
      navPagesSize.coverSpreadSize.width * navPagesRatios.coverWorkspace !== navPagesSize.coverWorkspaceSize.width) {
      // 重新计算preview的coverWorkspace.
      navPagesRatios.coverWorkspace = navPagesSize.coverWorkspaceSize.width / navPagesSize.coverSpreadSize.width;
    }

    const size = navPagesSize;
    const ratios = navPagesRatios;
    const sheets = [];

    // 最大sheet和当前的sheet总数.
    const maxSheetNumber = parameters ? parameters.getIn(['sheetNumberRange', 'max']) : 0;
    const totalSheetNumber = get(pagination, 'total');

    if (allSheets && allSheets.size) {
      const sheetActions = {
        pageNumberActions
      };

      // sheet容器.
      const containerWidth = size.coverWorkspaceSize.width > size.innerWorkspaceSize.width ? size.coverWorkspaceSize.width : size.innerWorkspaceSize.width;
      const containerHeight = size.coverWorkspaceSize.height > size.innerWorkspaceSize.height ? size.coverWorkspaceSize.height : size.innerWorkspaceSize.height;
      const containerStyle = {
        width: `${containerWidth}px`,
        height: `${containerHeight + 2}px`
      };

      allSheets.forEach((sheet, index) => {
        const isCover = sheet.getIn(['summary', 'isCover']);

        const pageNumberStyle = merge({}, {
          width: isCover ? `${size.renderCoverSize.width}px` : `${size.renderInnerSize.width}px`,
          display: containerWidth ? 'block' : 'none'
        });

        // 如果是封面.
        if (isCover) {
          const bookCoverData = {
            styles: containerStyle,
            specData,
            pageNumberStyle,
            thumbnail: true,
            isShowSimplePageNumber: true,
            urls,
            size,
            ratios,
            position: navPagesPosition.cover,
            materials,
            variables,
            pagination,
            paginationSpread: sheet,
            settings,
            parameters,
            shouldSwitchSheet: true,
            isNavpages: true,
            ignoreEmpty: false,
            pageNumberActions,
            onNavPagesSwitchSheet,
            capability,
            isShowBgColor: true,
            env
          };

          sheets.push(<BookCover key={`pageNav-${sheet.get('id')}`} actions={sheetActions} data={bookCoverData} />);
        } else {
          // 正常的内页.
          const sheetData = {
            styles: containerStyle,
            pageNumberStyle,
            thumbnail: true,
            isShowSimplePageNumber: true,
            urls,
            size,
            ratios,
            coverSpreadForInnerWrap,
            position: navPagesPosition.inner,
            materials,
            variables,
            pagination,
            paginationSpread: sheet,
            settings,
            parameters,
            shouldSwitchSheet: true,
            isNavpages: true,
            ignoreEmpty: false,
            pageNumberActions,
            onNavPagesSwitchSheet,
            capability,
            env
          };

          sheets.push(<BookSheet key={`pageNav-${sheet.get('id')}`} actions={sheetActions} data={sheetData} />);
        }
      });
    }
    return (
      <div className="pages-navigation" ref={pageNav => this.pageNav = pageNav}>
        {sheets}
      </div>
    );
  }
}

PageNavigation.propTypes = {};

export default PageNavigation;
