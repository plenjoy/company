import { get } from 'lodash';
import { pageTypes } from '../../../contants/strings';

/**
 * 切换page
 */
export const switchPage = (that, props) => {
  const { boundPaginationActions, paginationSpread, pagination } = props || that.props;

  const pages = get(paginationSpread, 'pages');

    // 判断封面的正面是否支持添加用户的图片.
    // 如果支持, 就把封面的正面设为活动页.
  let pageIndex = pages.findIndex(page => get(page, 'enabled'));
  pageIndex = pageIndex === -1 ? 0 : pageIndex;

  const pageId = get(pages, `[${pageIndex}].id`);

  if (pages.length && pagination.pageId !== pageId) {
    boundPaginationActions.switchPage(pageIndex, pageId);
  }
};

/**
 * 切换page到指定的页面.
 */
export const switchPageTo = (that, pageIndex) => {
  const { boundPaginationActions, paginationSpread, pagination } = that.props;

  const pages = get(paginationSpread, 'pages');
  const page = get(pages, pageIndex.toString());
  const pageType = get(page, 'type');
  const pageId = get(page, 'id');
  const newPageIndex = pageIndex;

  if (pages.length &&
      pagination.pageId !== pageId &&
      pageIndex < pages.length &&
      pageType !== pageTypes.full &&
      pageType !== pageTypes.spine) {
    boundPaginationActions.switchPage(newPageIndex, pageId);
  }
};
