import {get, merge } from 'lodash';
import Immutable from 'immutable';
import { smallViewWidthInMyProjects } from '../../constants/strings';

// handlers write here
export const onClosePreviewModal = (that) => {
  const { actions } = that.props;
  const { closePreviewModal } = actions;
  closePreviewModal && closePreviewModal();
};

/**
 * 更新组件的state
 */
export const updatePaginationSpreadInState = (that, props, sheetIndex) => {
  const allSheets = props ? props.data.allSheets : that.props.data.allSheets;
  const newSheet = allSheets.get(sheetIndex);

  if (sheetIndex < allSheets.size) {
    that.setState({
      paginationSpread: newSheet
    });
  }
};

export const updatePaginationInState = (that, props, sheetIndex) => {
  const { pagination } = that.state;
  const paginationInProps = props.data.pagination || that.props.data.pagination;

  that.setState({
    pagination: {
      prevSheetIndex: pagination.sheetIndex,
      sheetIndex: sheetIndex,
      total: paginationInProps.get('total')
    }
  });
};

/**
 * 预览时的翻页.
 */
export const switchSheet = (that, param) => {
  const { actions = {} } = that.props;
  const { onSwitchSheet } = actions;
  const { current } = param;

  updatePaginationSpreadInState(that, that.props, current);
  updatePaginationInState(that, that.props, current);

  const newPagination = merge({}, that.state.pagination, {
    sheetIndex: current
  });
  onSwitchSheet && onSwitchSheet(newPagination);
};

