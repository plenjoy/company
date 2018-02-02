export const onDragStart = (that, e) => {
  const { data, actions } = that.props;
  actions.onDragStart && actions.onDragStart(data, e);
};

export const onDrag = (that, e, draggableData) => {
  const { data, actions } = that.props;
  actions.onDrag && actions.onDrag(data, e, draggableData);
};

export const onDragStop = (that, e) => {
  const { data, actions } = that.props;
  actions.onDragStop && actions.onDragStop(data, e);
};

export const onDragOver = (that, e) => {
  const { data, actions } = that.props;
  actions.handleDragOver && actions.handleDragOver(e);
};

export const onDrop = (that, e) => {
  const { data, actions } = that.props;
  actions.handleDrop && actions.handleDrop(e);
};

export const onResizeStart = (that, e) => {
  const { data, actions } = that.props;
  actions.onResizeStart && actions.onResizeStart(data, e);
};

export const onResize = (that, dir, e, resizeData) => {
  const { data, actions } = that.props;
  actions.onResize && actions.onResize(data, dir, e, resizeData);
};

export const onResizeStop = (that, e) => {
  const { data, actions } = that.props;
  actions.onResizeStop && actions.onResizeStop(data, e);
};

export const onRotateStart = (that, e) => {
  const { data, actions } = that.props;
  actions.onRotateStart && actions.onRotateStart(data, e);
};

export const onRotate = (that, e, draggableData) => {
  const { data, actions } = that.props;
  actions.onRotate && actions.onRotate(data, e, draggableData);
};

export const onRotateStop = (that, e) => {
  const { data, actions } = that.props;
  actions.onRotateStop && actions.onRotateStop(data, e);
};

export const onMouseDown = (that, e) => {
  const { data, actions } = that.props;
  actions.onMouseDown && actions.onMouseDown(data, e);
};

export const onClick = (that, e) => {
  const { data, actions } = that.props;
  const event = e || window.event;
  event.stopPropagation();
  event.preventDefault();

  actions.handleClick && actions.handleClick(data, event);
};
