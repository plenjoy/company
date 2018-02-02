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
      position,
      materials,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      project,
      parameters,
      snipping,
      isPreview,
      ignoreEmpty,
      undoData,
      allImages,
      userId,
      capability,
      allElements,
      env
    } = data;
    const {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet
    } = actions;
    const { sheetIndex, prevSheetIndex } = pagination;
    // bookcover数据.
    const sheetRenderActions = {
      boundProjectActions,
      boundPaginationActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundTrackerActions,
      hideCameoActionBar,
      boundTemplateActions,
      doAutoLayout,
      applyTemplate,
      switchSheet
    };

    // booksheet数据.
    const sheetRenderData = {
      urls,
      size,
      ratios,
      position,
      materials,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      project,
      parameters,
      snipping,
      isPreview,
      ignoreEmpty,
      undoData,
      allImages,
      userId,
      capability,
      allElements,
      env
    };

    const listStyle = {
      width:
        pagination.sheetIndex === 0
          ? `${size.renderCoverSize.width}px`
          : `${size.renderInnerSize.width}px`,
      height:
        pagination.sheetIndex === 0
          ? `${size.renderCoverSize.height}px`
          : `${size.renderInnerSize.height}px`
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
