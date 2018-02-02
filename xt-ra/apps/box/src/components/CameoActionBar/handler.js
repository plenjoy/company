/**
 * 当crop图标为disable时, 不触发点击事件.
 */
export const onCrop = (that, event) => {
  const { actions, data } = that.props;
  const { disabledIcons } = data;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.cropDisable){
    actions.onCrop && actions.onCrop(ev);
  }
};

/**
 * 当rotate图标为disable时, 不触发点击事件.
 */
export const onRotate = (that, event) => {
  const { actions, data } = that.props;
  const { disabledIcons } = data;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.rotateDisable){
    actions.onRotate && actions.onRotate(ev);
  }
};

/**
 * 当flip图标为disable时, 不触发点击事件.
 */
export const onFlip = (that, event) => {
  const { actions, data } = that.props;
  const { disabledIcons } = data;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.flipDisable){
    actions.onFlip && actions.onFlip(ev);
  }
};
