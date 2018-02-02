import { get } from 'lodash';

export const getRenderHandlerHtml = (that) => {
  const { data } = that.props;
  const { page, isPreview } = data;
  const pageEnabled = get(page, 'enabled');
  let html;

  // handler的action和data.
  const handlerActions = { handleDragOver: that.onPageDragOver, handleDrop: that.onPageDroped };
  const handlerData = {};
  const disableHandlerData = {};

  // 如果为预览模式, 一律添加disablehandler
  if (isPreview) {
    html = (<DisableHandler data={disableHandlerData} />);
  } else {
    html = pageEnabled ?
      (<Handler data={handlerData} actions={handlerActions} />)
      :
      (<DisableHandler data={disableHandlerData} />);
  }

  return html;
}
