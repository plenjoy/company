import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { get, isEqual, merge, template } from 'lodash';
import * as handler from './handler.js';

// 导入组件
import XPagination from '../../../../common/ZNOComponents/XPagination';
import XSimplePagination from '../../../../common/ZNOComponents/XSimplePagination';
import SheetsList from '../../components/SheetsList';
import XLoading from '../../../../common/ZNOComponents/XLoading';

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
        sheetIndex: get(pagination, 'sheetIndex') || 0,
        pageIndex: 0,
        pageId: '',
        total: get(pagination, 'total')
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
    this.onSwipeSheet = (step, direction) => handler.onSwipeSheet(this, step, direction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.allSheets.size) {
      this.updatePaginationSpreadInState(
        nextProps,
        this.state.pagination.sheetIndex
      );
    }

    // // 更新翻页信息.
    // if (
    //   this.state.pagination.total !== nextProps.data.pagination.get('total')
    // ) {
    //   this.updatePaginationInState(nextProps, this.state.pagination.sheetIndex);
    // }

    const oldPagination = get(this.props, 'data.pagination');
    const newPagination = get(nextProps, 'data.pagination');
    if (get(oldPagination, 'sheetIndex') !== get(newPagination, 'sheetIndex')) {
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
    const { data, actions } = this.props;
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
      parentBook,
      capability,
      isSplit
    } = data;
    const { boundSnippingActions } = actions;

    //
    const { paginationSpread, pagination, snipping } = this.state;
    const spreadsListActions = {
      boundSnippingActions
    };

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
      isPreview: true,
      isSplit
    };

    const sheetsContainerStyle = {
      width: '100%',
      height: '100%'
    };

    const previewSheetStyle = {
      marginTop: 0,
      marginLeft: 0
    };

    const previewClassName = classNames('preview-sheet-render');

    return (
      <div className="preview-wrap">
        <div className={previewClassName} style={previewSheetStyle}>
          <div style={sheetsContainerStyle}>
            <SheetsList
              actions={spreadsListActions}
              data={spreadsListData}
            />
          </div>
        </div>
      </div>
    );
  }
}

PreviewSheetRender.proptype = {};

export default PreviewSheetRender;
