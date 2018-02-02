/**
 * tab切换时, 触发. 设置选中样式.
 * @param that 组件的this指向.
 * @param event
 */
export const onSelect = (that, selectedIndex) => {
  const { actions } = that.props;
  const { boundTrackerActions } = actions;

  // 用户点击 tab 切换时的  埋点。
  boundTrackerActions.addTracker(`ChangeTab,${selectedIndex}`);
  //boundSidebarActions.changeTab(selectedIndex);
  that.setState({ tabIndex: selectedIndex });
};
