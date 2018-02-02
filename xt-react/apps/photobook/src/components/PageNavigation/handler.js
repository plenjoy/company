import { mouseWheel } from '../../contants/strings';

export const handlerMouseWheel = (that, dir) => {
  that.pageNav.scrollLeft += dir * mouseWheel.width;
}
