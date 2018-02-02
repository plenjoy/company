import {
  getTransferData,
  setTransferDataByNode,
  getTransferDataByNode
} from '../../../../../common/utils/drag';

export const onExchangeClick = (that) => {
  that.setState({
    showVisualExchange: true
  });
};

export const onExchangeDragStart = (that, pageId, elementId, exchangeImageThumbnail, e) => {
  const ev = e.evt || window.event;

  setTransferDataByNode({
    pageId,
    elementId
  });

  that.setState({
    isExchangeImage: true,
    exchangeImageThumbnail
  });

  __app.isExchangeImage = true;
  e.cancelBubble = true;
  stopEvent(ev);
};

export const onExchangeDragMove = (that, e) => {
  const ev = e.evt || window.event;
  const x = ev.pageX;
  const y = ev.pageY;
  const exchangeThumbnailRect = {
    x,
    y
  };
  e.cancelBubble = true;
  that.setState({
    exchangeThumbnailRect
  });
};

export const onExchangeDragEnd = (that, e) => {
  const ev = e.evt || window.event;
  that.setState({
    isExchangeImage: false,
    isDragOver: false
  });
  getTransferDataByNode(ev);
  e.cancelBubble = true;
  delete __app.isExchangeImage;
};

export const onHoverBoxChange = (that, hoverBox) => {
  that.setState({
    ...hoverBox
  });
}

export const stopEvent = (event) => {
  const ev = event || window.event;
  ev.preventDefault();
  ev.stopPropagation();
};
