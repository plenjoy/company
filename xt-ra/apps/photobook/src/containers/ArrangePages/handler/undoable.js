export const onUndo = (that, isPressKey = false) => {
  const { boundUndoActions, boundTrackerActions } = that.props;
  boundUndoActions.undo();

  let trackerString = 'ClickEditUndo,ArrangePages';
  if (isPressKey) {
    trackerString = 'ShortCut,Undo,ArrangePages';
  }
  boundTrackerActions.addTracker(trackerString);
};

export const onRedo = (that, isPressKey = false) => {
  const { boundUndoActions, boundTrackerActions } = that.props;
  boundUndoActions.redo();

  let trackerString = 'ClickRedo,ArrangePages';
  if (isPressKey) {
    trackerString = 'ShortCut,Redo,ArrangePages';
  }
  boundTrackerActions.addTracker(trackerString);
};
