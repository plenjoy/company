const stopEvent = (e) => {
  const event = e || window.event;
  event.preventDefault();
  event.stopPropagation();
};

export const onReadMoreToggle = (that, event) => {
  // 用户点击 ！icon 展开价格明细时 的 埋点。
  const { actions } = that.props;
  const { boundTrackerActions } = actions;
  boundTrackerActions.addTracker(`CheckPrice,${that.payPrice}`);

  const { priceDetailShow } = that.state;
  that.setState({
    priceDetailShow: !priceDetailShow
  }, () => {
    if (that.state.priceDetailShow) {
      that.popupDetail.focus();
    }
  });

  stopEvent(event);
};
