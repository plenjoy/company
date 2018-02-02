import { template } from 'lodash';
import { ORDER_PATH } from '../constants/apiUrl';
import { orderType } from '../constants/strings';

/**
 * 跳转到这个页面时，会自动的加入购物车
 * @param  {[type]}  projectId    [description]
 * @return {[type]}               [description]
 */
export const redirectToOrder = (projectId) => {
  const orderPath = template(ORDER_PATH)({
    orderType,
    projectId
  });

  window.onbeforeunload = null;
  window.location = orderPath;
};
