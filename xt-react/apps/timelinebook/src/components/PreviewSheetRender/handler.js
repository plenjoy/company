import {get, merge } from 'lodash';
import Immutable from 'immutable';

/**
 * 预览时的翻页.
 */
export const switchSheet = (that, param) => {
  const { current } = param;
  const { pagination } = that.state;
  const newPagination = Object.assign({}, pagination, {
    prevSheetIndex: pagination.sheetIndex,
    sheetIndex: current
  });

  that.setState({
    pagination: newPagination
  });
};