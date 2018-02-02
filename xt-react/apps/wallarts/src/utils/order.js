import { template } from 'lodash';
import { ORDER_PATH, PARENT_BOOK_PATH } from '../constants/apiUrl';

/**
 * 跳转到这个页面时，会自动的加入购物车
 * @param  {[type]}  projectId    [description]
 * @return {[type]}               [description]
 */
export const redirectToOrder = (projectId) => {
  const orderPath = template(ORDER_PATH)({
    projectId
  });

  window.onbeforeunload = null;
  window.location = orderPath;
};
