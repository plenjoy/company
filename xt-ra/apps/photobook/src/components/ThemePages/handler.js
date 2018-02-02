import { dragTypes } from '../../contants/strings';
import { setTransferData } from '../../../../common/utils/drag';

let timer = null;

export const onThemeDragStarted = (guid, pageIndex, sheetIndex, event) => {
  setTransferData(event, {
    type: dragTypes.theme,
    guid,
    pageIndex,
    sheetIndex
  });
  // dragover, dragenter 没法从dataTransfer传值，所以借用window传值
  __app.dragType = dragTypes.theme;
};

export const onPageOver = (that, screenshot, pageIndex, event) => {
  const imageObj = new window.Image();
  imageObj.onload = () => {
    timer && clearTimeout(timer);
    const container = that.refs[pageIndex];

    const containerPosition = container.getBoundingClientRect();
    const winHeight = window.innerHeight;

    const scaleInMagnifier = reCalsScale(imageObj.width, imageObj.height);

    // 如果图片框稍微全部显示在可视区域，为避免bug，不做放大处理。
    if (containerPosition.top + containerPosition.height > winHeight + 10) {
      return;
    }
    const x = containerPosition.left + containerPosition.width + 15;
    let y = containerPosition.top + containerPosition.height / 2;
    let marginTop = 0;

    // 解决底部部分显示不了问题
    if (y + (scaleInMagnifier.height + 50) / 2 > winHeight) {
      marginTop = y + (scaleInMagnifier.height + 50) / 2 - winHeight;
      y -= marginTop;
    }
    timer = setTimeout(() => {
      that.setState({
        magnifierParams: {
          isMagnifierShow: true,
          imageUrl: screenshot,
          name: '',
          pixel: '',
          width: scaleInMagnifier.width,
          height: scaleInMagnifier.height,
          // 不需要下载预览图到本地.
          isIgnore: true,
          offset: {
            x,
            y,
            marginTop
          }
        }
      });
    }, that.state.magnifierShowTime);
  };
  imageObj.src = screenshot;
};

export const onPageOut = (that) => {
  clearTimeout(timer);
  that.setState({
    magnifierParams: {
      isMagnifierShow: false,
      imageUrl: '',
      name: '',
      pixel: '',
      // 不需要下载预览图到本地.
      isIgnore: true,
      offset: {
        x: 0,
        y: 0
      }
    }
  });
};

export const applyThemePage = (that, guid, pageIndex) => {
  const { actions } = that.props;
  const { applyThemePage } = actions;
  applyThemePage(guid, pageIndex);
  onPageOut(that);
};

const reCalsScale = (width, height) => {
  const MAX_WIDTH = 600;
  const MAX_HEIGHT = 400;
  const ratio = width / height;
  if (width >= height) {
    const rWidth = MAX_WIDTH;
    return {
      width: rWidth,
      height: rWidth / ratio
    };
  }
  const rHeight = MAX_HEIGHT;
  return {
    width: rHeight * ratio,
    height: rHeight
  };
};
