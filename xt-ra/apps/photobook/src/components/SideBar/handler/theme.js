export const applyThemePage = (that, themeId, pageIndex) => {
  const { data, actions } = that.props;
  const { pagination } = data;
  const { boundProjectActions, boundGlobalLoadingActions,boundTrackerActions } = actions;
  boundGlobalLoadingActions.showGlobalLoading();
  boundTrackerActions.addTracker(`ApplyIdeaPage,${themeId},${pageIndex}`);
  boundProjectActions
    .applyThemePage(themeId, pageIndex, pagination.get('sheetIndex'))
    .then(
      () => {
        boundGlobalLoadingActions.hideGlobalLoading();
      },
      () => {
        boundGlobalLoadingActions.hideGlobalLoading();
      }
    );
};
