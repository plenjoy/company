import { smallViewWidthInMyProjects } from '../../../contants/strings';
import { toCanvas } from '../../../utils/snippingHelper';

let timer = null;

export const doSnipping = (that) => {
  const { boundSnippingActions } = that.props;

  clearTimeout(timer);

  timer = setTimeout(() => {
    // 截小图.
    const bookCoverNode = document.querySelector('.cover-select-area');

    // 把指定的html节点转成canvas, 更更新store上的数据.
    toCanvas(bookCoverNode, smallViewWidthInMyProjects, null, (data) => {
      // 更新store上的截图.
      if (data) {
        boundSnippingActions.updateSnippingThumbnail({
          type: 'thumbnail',
          base64: data.replace('data:image/png;base64,', '')
        });
      }
    });
  }, 500);
};
