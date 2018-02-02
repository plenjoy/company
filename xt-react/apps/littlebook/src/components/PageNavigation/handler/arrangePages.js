export const onAddPages = (that) => {
  const { boundProjectActions } = that.props;
  boundProjectActions.createDualPage();
};
export const onNavPagesSwitchSheet = (that) => {
  const { data, actions } = that.props;
  const { paginationSpread, pagination } = data;
  const preSheetIndex = pagination.sheetIndex;
  const sheetIndex = paginationSpread.getIn(['summary', 'sheetIndex']);
  const { pageNumberActions } = actions;
  // switchSheet 的参数有current
  const TrackerParam = `ClickJumpToPage,${preSheetIndex},${sheetIndex}`;
  const Param = { current: sheetIndex, TrackerParam };

  pageNumberActions.switchSheet(Param);
};
