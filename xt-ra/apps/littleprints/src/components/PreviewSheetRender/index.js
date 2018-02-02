import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { get, isEqual, merge, template } from 'lodash';
import * as handler from './handler.js';

// 导入组件
import XModal from '../../../../common/ZNOComponents/XModal';
import XPagination from '../../../../common/ZNOComponents/XPagination';
import SheetsList from '../../components/SheetsList';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import SimplePagination from '../../components/SimplePagination';

import { productTypes } from '../../constants/strings';

import './index.scss';

class PreviewSheetRender extends Component {
  constructor(props) {
    super(props);

    const { data } = this.props;
    const { pagination, allSheets, snipping } = data;

    // state
    this.state = {
      pagination: {
        prevSheetIndex: -1,
        prevPageIndex: -1,
        sheetIndex: pagination.get('sheetIndex'),
        pageIndex: 0,
        pageId: '',
        total: pagination.get('total')
      },
      paginationSpread: allSheets.size ? allSheets.get(pagination.get('sheetIndex')) : Immutable.Map({}),
      snipping
    };

    // 更新state
    this.updatePaginationSpreadInState = (props, sheetIndex) =>
      handler.updatePaginationSpreadInState(this, props, sheetIndex);
    this.updatePaginationInState = (props, sheetIndex) =>
      handler.updatePaginationInState(this, props, sheetIndex);

    // 预览时翻页.
    this.switchSheet = param => handler.switchSheet(this, param);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.allSheets.size) {
      this.updatePaginationSpreadInState(
        nextProps,
        this.state.pagination.sheetIndex
      );
    }

    // 更新翻页信息.
    if (
      this.state.pagination.total !== nextProps.data.pagination.get('total')
    ) {
      this.updatePaginationInState(nextProps, this.state.pagination.sheetIndex);
    }

    const oldPagination = get(this.props, 'data.pagination');
    const newPagination = get(nextProps, 'data.pagination');
    if (oldPagination.get('sheetIndex') !== newPagination.get('sheetIndex')) {
      this.updatePaginationInState(nextProps, newPagination.get('sheetIndex'));
      this.updatePaginationSpreadInState(
        nextProps,
        newPagination.get('sheetIndex')
      );
    }
  }

  render() {
    const { data } = this.props;
    const {
      urls,
      ratios,
      size,
      position,
      variables,
      settings,
      project,
      parameters,
      allSheets,
      ignoreEmpty,
      capability
    } = data;

    const { paginationSpread, pagination, snipping } = this.state;
    const spreadsListActions = {};
    const productType = get(settings, 'spec.product');
    const isLittleCalendar = productType === productTypes.LPS;

    const pages = paginationSpread.get('pages');
    const page = pages.size && pages.get('0');
    const isLandscapeShape = page && page.get('width') > page.get('height');

    let newSize = size;
    if (isLandscapeShape) {
      newSize = merge({}, size, {
        renderCoverSheetSize: get(size, 'renderCoverSheetSize'),
        renderInnerSize: get(size, 'renderInnerSizeLandscape'),
        renderInnerContainerSize: get(size, 'renderInnerContainerSizeLandscape'),
        renderInnerSheetSize: get(size, 'renderInnerSheetSizeLandscape'),
        renderInnerSheetSizeWithoutBleed: get(size, 'renderInnerSheetSizeWithoutBleedLandscape')
      });
    }
    const newRatios = merge({}, ratios, {
      innerWorkspace: isLandscapeShape ? get(ratios, 'innerWorkspaceLandscape') : get(ratios, 'innerWorkspace')
    });

    const spreadsListData = {
      urls,
      size: newSize,
      ratios: newRatios,
      paginationSpread,
      variables,
      pagination,
      settings,
      project,
      parameters,
      ignoreEmpty,
      capability,
      isPreview: true,
      isLandscapeShape
    };

    // 翻书组件的样式.
    const paginationStyle = {};
    const paginationActions = { onPage: this.switchSheet };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      style: paginationStyle,
      minSheetIndex: isLittleCalendar ? 1 : 0
    };


    // sheet容器.
    const containerWidth = newSize.renderCoverSize.width >
      newSize.renderInnerSize.width
      ? newSize.renderCoverSize.width
      : newSize.renderInnerSize.width;
    const containerHeight = newSize.renderCoverSize.height >
      newSize.renderInnerSize.height
      ? newSize.renderCoverSize.height
      : newSize.renderInnerSize.height;

    // 加一个container容器, 为了使封面和内页渲染在相同大小的容器内.
    const sheetsContainerStyle = {
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      margin: '0 auto'
    };

    const previewSheetStyle = {
      marginTop: `${-containerHeight / 2}px`,
      marginLeft: `${-containerWidth / 2}px`
    };

    const showTotal = isLittleCalendar ? pagination.total : pagination.total + 1;
    const showCurrent = isLittleCalendar ? pagination.sheetIndex : pagination.sheetIndex + 1;

    return (
      <div className="preview-wrap">
        <div className="preview-sheet-render" style={previewSheetStyle}>
          <div style={sheetsContainerStyle}>
            <SheetsList
              actions={spreadsListActions}
              data={spreadsListData}
            />
          </div>

          <div className="pagination-message">
            {showCurrent} / {showTotal}
          </div>

          {/* <div className="pagination-wrap">
            <XPagination
              actions={paginationActions}
              data={paginationData}
            />
          </div> */}
        </div>
        {/* 翻页组件. */}
        <SimplePagination
          actions={paginationActions}
          data={paginationData}
        />
      </div>
    );
  }
}

PreviewSheetRender.proptype = {};

export default PreviewSheetRender;
