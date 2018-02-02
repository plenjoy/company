export const onAddPages = (that, ev) => {
  const event = ev || window.event;
  event.stopPropagation();

  const { actions } = that.props;
  actions.onAddPages && actions.onAddPages(that);
};
