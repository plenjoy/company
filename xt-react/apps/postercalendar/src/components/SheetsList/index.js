import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// 导入handler
import * as handler from './handler';

// 导入组件.
import SheetRender from '../../components/SheetRender';

import './index.scss';

class SheetsList extends Component {
  constructor(props) {
    super(props);

    this.getAllStyles = translateX => handler.getAllStyles(translateX);
  }

  render() {
    const { actions, data } = this.props;
    const {
      urls,
      size,
      ratios,
      variables,
      pagination,
      paginationSpread,
      settings,
      project,
      parameters,
      isPreview,
      specData,
      template,
      userId,
      allImages,
      capability,
      userInfo
    } = data;
    const {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      // boundPropertyModalActions,
      // boundTemplateActions,
      boundTrackerActions
    } = actions;
    const { sheetIndex, prevSheetIndex } = pagination;
    // bookcover数据.
    const sheetRenderActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions
    };

    // booksheet数据.
    const sheetRenderData = {
      urls,
      size,
      ratios,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      project,
      parameters,
      isPreview,
      specData,
      userId,
      allImages,
      capability,
      userInfo
    };

    const listStyle = {
      width: pagination.sheetIndex === 0
        ? `${get(size, 'renderCoverSize.width')}px`
        : `${get(size, 'renderInnerSize.width')}px`,
      height: pagination.sheetIndex === 0
        ? `${get(size, 'renderCoverSize.height') + 20}px`
        : `${get(size, 'renderInnerSize.height') + 20}px`
    };

    const ulStyle = {
      width: '100%',
      height: '100%'
    };

    const transitionName = prevSheetIndex > sheetIndex ? 'to-right' : 'to-left';

    return (
      <div className="spreads-list" style={listStyle}>
        <div className="pages-list" style={ulStyle}>
          <ReactCSSTransitionGroup
            transitionName={transitionName}
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <SheetRender
              key={sheetIndex}
              actions={sheetRenderActions}
              data={sheetRenderData}
            />
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

SheetsList.propTypes = {};

SheetsList.defaultProps = {};

export default translate('SheetsList')(SheetsList);
