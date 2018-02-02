import OAuth from '../../../../../common/utils/OAuth';
/**
 * 点击order按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onOrder = (that) => {
  const { actions, data, t } = that.props;
  const { volumes, selectedVolume } = data;
  const { boundOrderModalActions, boundIncompleteModalActions, boundTrackerActions } = actions;

  if (volumes.size === 1 && !selectedVolume.get('isComplete')) {
    boundIncompleteModalActions.showIncompleteModal();
  } else {
    boundOrderModalActions.showOrder();
  }
  boundTrackerActions.addTracker(`TapOrder,${OAuth.authType},${volumes.count()}`);
};
