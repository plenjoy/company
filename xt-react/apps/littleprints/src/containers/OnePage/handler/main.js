import { get } from 'lodash';
import { productTypes } from '../../../constants/strings';

export const handlerMouseWheel = (that, dir) => {
  const {
    pagination,
    paginationSpread,
    settings,
    boundPaginationActions
  } = that.props;
  const pages = paginationSpread.get('pages');
  const pageIndex = pages.findIndex(p => p.get('id') === pagination.pageId);
  const isCover = pagination.sheetIndex === 0;
  const productType = get(settings, 'spec.product');
  const isWallCalendar = productType === productTypes.WC;
  // 只有 WC 的内页 需要对鼠标做相应的处理。
  if (isWallCalendar && !isCover) {
    // 如果当前是 下半页且向下翻 或者
    // 当前页是上半页 且 向上翻， 那就不做任何处理
    if ((pageIndex ===0 && dir < 0) ||
        pageIndex ===1 && dir > 0
      ) {
      return null;
    }
    const addNum = dir > 0 ? 1 : -1;
    const targetPageIndex = pageIndex + addNum;
    const targetPageId = pages.getIn([String(targetPageIndex), 'id']);
    if (targetPageId) {
      boundPaginationActions.switchPage(targetPageIndex, targetPageId);
    }
  }
};
