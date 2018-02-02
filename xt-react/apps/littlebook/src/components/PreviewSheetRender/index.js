import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { get, isEqual, merge, template } from 'lodash';
import * as handler from './handler.js';

// 导入组件
import XModal from '../../../../common/ZNOComponents/XModal';
import XPagination from '../../../../common/ZNOComponents/XPagination';
import XSimplePagination from '../../../../common/ZNOComponents/XSimplePagination';
import PageNumber from '../PageNumber';
import SheetsList from '../../components/SheetsList';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XOrderReminder from '../../../../common/ZNOComponents/XOrderReminder';

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
        sheetIndex: pagination.get('sheetIndex') || 0,
        pageIndex: 0,
        pageId: '',
        total: pagination.get('total')
      },
      paginationSpread: allSheets.size ? allSheets.get(0) : Immutable.Map({}),
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

    // 更新snipping.
    if (!Immutable.is(this.props.data.snipping, nextProps.data.snipping)) {
      this.setState({
        snipping: nextProps.data.snipping
      });
    }
  }

  render() {
    const { data } = this.props;
    const {
      urls,
      ratios,
      size,
      position,
      materials,
      variables,
      settings,
      project,
      parameters,
      allSheets,
      ignoreEmpty,
      capability
    } = data;

    //
    const { paginationSpread, pagination, snipping } = this.state;
    const spreadsListActions = {};

    const summary = paginationSpread.get('summary');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');
    const pages = paginationSpread.get('pages');

    // 判断效果图是否生成.
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    const hasCoverRender = !!coverEffectImg;

    const spreadsListData = {
      urls,
      size,
      ratios,
      position,
      materials,
      paginationSpread,
      variables,
      pagination,
      settings,
      snipping,
      project,
      parameters,
      ignoreEmpty,
      capability,
      isPreview: true
    };

    // 翻书组件的样式.
    const paginationStyle = {};
    const paginationActions = { onPage: this.switchSheet };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      style: paginationStyle,
      isPressBook
    };

    // sheet容器.
    const containerWidth =
      size.renderCoverSize.width > size.renderInnerSize.width
        ? size.renderCoverSize.width
        : size.renderInnerSize.width;
    const containerHeight =
      size.renderCoverSize.height > size.renderInnerSize.height
        ? size.renderCoverSize.height
        : size.renderInnerSize.height;

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

    // pageNumber
    const pageNumber = paginationSpread.get('pageNumber');
    const pageNumberStyle = {
      width: isCover
        ? `${size.renderCoverSize.width}px`
        : `${size.renderInnerSize.width}px`
    };
    const pageItemStyle = {
      leftStyle: {
        marginLeft: `${isCover
          ? get(position, 'cover.render.left')
          : get(position, 'inner.render.left')}px`
      },
      rightStyle: {
        marginRight: `${isCover
          ? get(position, 'cover.render.left')
          : get(position, 'inner.render.left')}px`
      }
    };

    const pageNumberActions = {
      switchPage: this.switchPageTo,
      switchSheet: this.switchSheet
    };
    const pageNumberData = {
      pageNumber,
      pageItemStyle,
      style: pageNumberStyle,
      pages,
      isShowActive: true
    };

    return (
      <div>
        {hasCoverRender
          ? <div className="preview-sheet-render" style={previewSheetStyle}>
            <div style={sheetsContainerStyle}>
              <SheetsList
                actions={spreadsListActions}
                data={spreadsListData}
              />
            </div>

            <div className="pagination-wrap-simple">
                <XSimplePagination
                  actions={paginationActions}
                  data={paginationData}
                />
            </div>

            <PageNumber actions={pageNumberActions} data={pageNumberData} />
          </div>
          : <XLoading isShown />}
      </div>
    );
  }
}

PreviewSheetRender.proptype = {};

export default PreviewSheetRender;
