/**
 * 定义下拉弹框的类型.
 */
export const panelType = {
  cleanUp: 'cleanUp',
  addSheet: 'addSheet'
};

/**
 * 显示或隐藏下拉面板
 */
export const togglePanel = (that, type) => {
  const { isOpenedAddSheetPanel, isOpenedCleanUpPanel } = that.state;

  if (type === panelType.cleanUp) {
    that.setState({
      isOpenedCleanUpPanel: !isOpenedCleanUpPanel
    });
  } else if (type === panelType.addSheet) {
    that.setState({
      isOpenedAddSheetPanel: !isOpenedAddSheetPanel
    });
  }
};

/**
 * 显示下拉面板
 */
export const showPanel = (that, type) => {
  if (type === panelType.cleanUp) {
    that.setState({
      isOpenedCleanUpPanel: true
    });
  } else if (type === panelType.addSheet) {
    that.setState({
      isOpenedAddSheetPanel: true
    });
  }
};

/**
 * 隐藏下拉面板
 */
export const hidePanel = (that) => {
  that.setState({
    isOpenedAddSheetPanel: false,
    isOpenedCleanUpPanel: false
  });
};
