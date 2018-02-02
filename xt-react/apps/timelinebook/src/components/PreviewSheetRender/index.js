import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { get, isEqual, merge, template } from 'lodash';
import * as handler from './handler.js';

// 导入组件
import XModal from '../../../../common/ZNOComponents/XModal';
import XPagination from '../../../../common/ZNOComponents/XPagination';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import SheetRender from '../SheetRender';

import './index.scss';

class PreviewSheetRender extends Component {
  constructor(props) {
    super(props);

    const { data } = this.props;
    const { total } = data;

    // state
    this.state = {
      pagination: {
        prevSheetIndex: -1,
        prevPageIndex: -1,
        sheetIndex: 0,
        pageIndex: 0,
        pageId: '',
        total
      }
    };

    this.switchSheet = param => handler.switchSheet(this, param);
  }

  render() {
    const { data } = this.props;
    const { env, sheets, summary, materials, isPreview } = data;
    const { pagination } = this.state;
    const { sheetIndex, prevSheetIndex } = pagination;

    const paginationActions = {
      onPage: this.switchSheet
    };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex
    };
    const sheetRenderData = {
      prevSheetIndex,
      sheetIndex,
      sheets,
      summary,
      materials,
      env,
      isPreview
    };
    const sheetRenderActions = {
    };

    return (
      <div>
        <div className="preview-sheet-render">

          <SheetRender
            data={sheetRenderData}
            actions={sheetRenderActions}
          />

          <div className="pagination-wrap">
            <XPagination
              actions={paginationActions}
              data={paginationData}
            />
          </div>
        </div>
      </div>
    );
  }
}

PreviewSheetRender.proptype = {};

export default PreviewSheetRender;
