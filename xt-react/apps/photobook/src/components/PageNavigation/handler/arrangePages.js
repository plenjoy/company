export const onAddPages = (that) => {
  const { boundProjectActions } = that.props;
  boundProjectActions.createDualPage();
};
export const onNavPagesSwitchSheet = (that) => {
  const { data, actions } = that.props;
  const { paginationSpread} = data;
  const sheetIndex = paginationSpread.getIn(['summary', 'sheetIndex']);
  const { pageNumberActions } = actions;
    // switchSheet 的参数有current
  const sheetCurrent = { current: sheetIndex };
  pageNumberActions.switchSheet(sheetCurrent);
};
