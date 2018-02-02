import ReactTooltip from 'react-tooltip';
export const onHandleMouseMove = (that, event) => {
  const { actions } = that.props;
  const { handleMouseMove } = actions;
  handleMouseMove && handleMouseMove(event || window.event);
};

export const onHandleMouseUp = (that, event) => {
  const { actions } = that.props;
  const { handleMouseUp } = actions;
  handleMouseUp && handleMouseUp(event || window.event);
};

export const onHandleMouseEnter = (that, event) => {
  const { actions } = that.props;
  const { handleMouseEnter } = actions;
  handleMouseEnter && handleMouseEnter(event || window.event);
};

export const onHandleMouseOut = (that, event) => {
  const { actions } = that.props;
  const { handleMouseOut } = actions;
  handleMouseOut && handleMouseOut(event || window.event);
};

export const onHandleMouseLeave = (that, event) => {
  const { actions } = that.props;
  const { handleMouseLeave } = actions;
  handleMouseLeave && handleMouseLeave(event || window.event);
  that.setState({
      showDeleteButton: false
  });
};

export const onHandleMouseOver = (that, event) => {
  const { actions } = that.props;
  const { handleMouseOver } = actions;
  ReactTooltip.rebuild();
  handleMouseOver && handleMouseOver(event || window.event);
  that.setState({
      showDeleteButton: true
  });
};

export const onHandleMouseDown = (that, event) => {
  const { actions } = that.props;
  const { handleMouseDown } = actions;

  handleMouseDown && handleMouseDown(event || window.event);

  document.onmousemove = (e) => {
    onHandleMouseMove(that, e || window.event);
  };

  document.onmouseup = (e) => {
    document.onmousemove = null;
    document.onmouseup = null;
    onHandleMouseUp(that, e || window.event);
  };
};

export const onHandleDblClick = (that, event) => {
  const { actions, data } = that.props;
  const { handleDblClick } = actions;
  handleDblClick && handleDblClick(data, event || window.event);
};

export const onHandleClick = (that, event) => {
  const { actions, data } = that.props;
  const { handleClick } = actions;
  handleClick && handleClick(data, event || window.event);
};
