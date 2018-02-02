import { template } from 'lodash';
import { ORDER_PATH, PARENT_BOOK_PATH } from '../contants/apiUrl';
import { orderType } from '../contants/strings';

/**
 * 跳转到这个页面时，会自动的加入购物车
 * @param  {[type]}  projectId    [description]
 * @param  {Boolean} isParentBook [description]
 * @return {[type]}               [description]
 */
export const redirectToOrder = (projectId, isParentBook = false, crossSell = '') => {
  const orderPath = template(ORDER_PATH)({
    orderType,
    projectId,
    isParentBook,
    crossSell
  });

  window.onbeforeunload = null;
  window.location = orderPath;
};

export const redirectParentBook = projectId => {
  const parentBookPath = template(PARENT_BOOK_PATH)({
    projectId,
    isParentBook: true
  });

  window.onbeforeunload = null;
  window.location = parentBookPath;
};
