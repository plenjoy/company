export const onClickNavItem = (that, tabIndex) => {
  const { actions } = that.props;
  const { changeStep } = actions;
  that.setState(
    {
      tabIndex
    },
    () => {
      changeStep(1);
    }
  );
};

/**
 * tab切换时, 触发. 设置选中样式.
 * @param that 组件的this指向.
 * @param event
 */
export const onSelect = (that, tabIndex) => {
  const { actions } = that.props;

  const { boundTrackerActions, changePanelTab } = actions;

  // 用户点击 tab 切换时的埋点。

  boundTrackerActions.addTracker(`ChangeTab,${that.tabsText[tabIndex]}`);

  changePanelTab && changePanelTab(tabIndex);
};
