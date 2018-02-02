import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// // 导入组件.
import SheetRender from '../../components/SheetRender';

import './index.scss';

class SheetsList extends Component {
  constructor(props) {
    super(props);
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
      materials,
      parameters,
      isPreview,
      specData,
      template,
      userId,
      allImages,
      capability,
      snipping,
      isSplit
    } = data;
    const {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundSnippingActions,
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
      boundTrackerActions,
      boundSnippingActions
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
      materials,
      project,
      parameters,
      isPreview,
      specData,
      userId,
      allImages,
      capability,
      snipping,
      isSplit
    };

    const transitionName = prevSheetIndex > sheetIndex ? 'to-right' : 'to-left';

    return (
      <div className="spreads-list" >
        <div className="pages-list">
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
