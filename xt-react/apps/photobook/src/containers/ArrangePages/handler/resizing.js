import Immutable from 'immutable';
import {
  getSize,
  computedItemsCountInRowByFixedWidth,
  convertToTwoDimenArr
} from '../../../../../common/utils/helper';

import { smallViewWidthInArrangePages } from '../../../contants/strings';

export const convertSheetsData = (allSheets) => {
  let sheets = allSheets;
  let margin = 0;

  if (allSheets && allSheets.size) {
    const maginOfItem = 30;
    const editorSize = getSize();

    const result = computedItemsCountInRowByFixedWidth(Math.floor(editorSize.width), smallViewWidthInArrangePages, maginOfItem);
    sheets = Immutable.fromJS(convertToTwoDimenArr(allSheets.toJS(), result.count));
    margin = result.margin;
  }

  return { sheets, margin };
};

export const onResizing = (that) => {
  const { allSheets } = that.props;
  const { sheets, margin } = convertSheetsData(allSheets);

  that.setState({
    allSheets: sheets,
    margin
  });
};
