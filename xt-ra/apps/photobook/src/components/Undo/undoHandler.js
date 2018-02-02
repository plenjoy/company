export const onRedo = (that) => {
  const { actions } = that.props;
  const { boundUndoActions } = actions;
  boundUndoActions.redo();
};

export const onUndo = (that) => {
  const { actions } = that.props;
  const { boundUndoActions } = actions;
  boundUndoActions.undo();
};

