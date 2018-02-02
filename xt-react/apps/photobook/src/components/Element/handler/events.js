export const onMouseUp = (that, e) => {
  const { data, actions } = that.props;
  actions.handleMouseUp && actions.handleMouseUp(data, e);
};

export const onMouseOver = (that, e) => {
  const { data, actions } = that.props;
  actions.handleMouseOver && actions.handleMouseOver(data, e);
};

export const onMouseOut = (that, e) => {
  const { data, actions } = that.props;
  actions.handleMouseOut && actions.handleMouseOut(data, e);
};

export const onMouseEnter = (that, e) => {
  const { data, actions } = that.props;
  actions.handleMouseEnter && actions.handleMouseEnter(data, e);
};

export const onMouseLeave = (that, e) => {
  const { data, actions } = that.props;
  actions.handleMouseLeave && actions.handleMouseLeave(data, e);
};
