import { get, merge } from 'lodash';
import Immutable from 'immutable';
import { smallViewWidthInMyProjects } from '../../contants/strings';
import { checkIsSetCoverAsInnerBg } from '../../utils/cover';
import { toCanvas } from '../../utils/snippingHelper';
import { getImageDataByBase64, imageDataHRevert, getBase64ByImageData } from '../../../../common/utils/draw';

const timer = null;

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
      sheetIndex,
      total: paginationInProps.get('total')
    }
  });
};

/**
 * 预览时的翻页.
 */
export const switchSheet = (that, param) => {
  const { actions = {} } = that.props;
  const { boundTrackerActions } = actions;
  const { current, TrackerParam } = param;
  updatePaginationSpreadInState(that, that.props, current);
  updatePaginationInState(that, that.props, current);
  boundTrackerActions.addTracker(`${TrackerParam}`);
};
