import { pageTypes } from '../../../contants/strings';

/**
 * 翻页
 * @param that editPage组件的this指向.
 * @param param 翻页时的参数对象, 包括total和current两个属性.
 */
export const switchSheet = (that, param) => {
  const { boundPaginationActions, boundUndoActions, boundTrackerActions, pagination } = that.props;
  const { sheetIndex } = pagination;
  const currentIndex = param.current;
  boundPaginationActions.switchSheet(param.current);
  if (param.TrackerParam) {
    boundTrackerActions.addTracker(param.TrackerParam);
  }
};

/**
 * 切换page
 */
export const switchPage = (that, props) => {
  const { boundPaginationActions, paginationSpread, pagination } = props || that.props;

  const pages = paginationSpread.get('pages');

    // 判断封面的正面是否支持添加用户的图片.
    // 如果支持, 就把封面的正面设为活动页.
  let pageIndex = pages.findIndex(page => page.get('enabled'));
  pageIndex = pageIndex === -1 ? 0 : pageIndex;

  const pageId = pages.getIn([pageIndex.toString(), 'id']);

  if (pages.size && pagination.pageId !== pageId) {
    boundPaginationActions.switchPage(pageIndex, pageId);
  }
};

/**
 * 切换page到指定的页面.
 */
export const switchPageTo = (that, pageIndex) => {
  const { boundPaginationActions, paginationSpread, pagination } = that.props;

  const pages = paginationSpread.get('pages');
  let page = pages.get(pageIndex.toString());
  let pageType = page.get('type');
  let pageId = page.get('id');
  let newPageIndex = pageIndex;

  if (pageType === pageTypes.spine) {
    if (++newPageIndex < pages.size) {
      page = pages.get(newPageIndex.toString());
      pageId = page.get('id');
      pageType = page.get('type');
    }
  }

  if (pages.size &&
      pagination.pageId !== pageId &&
      pageIndex < pages.size &&
      pageType !== pageTypes.full &&
      pageType !== pageTypes.spine) {
    boundPaginationActions.switchPage(newPageIndex, pageId);
  }
};
