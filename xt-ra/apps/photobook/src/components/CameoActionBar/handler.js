/**
 * 当crop图标为disable时, 不触发点击事件.
 */
export const onCrop = (that, event) => {
  const { actions, disabledIcons, element } = that.props;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.cropDisable){
    actions.onCrop && actions.onCrop(element, ev);
  }
};

/**
 * 当rotate图标为disable时, 不触发点击事件.
 */
export const onRotate = (that, event) => {
  const { actions, disabledIcons, element } = that.props;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.rotateDisable){
    actions.onRotate && actions.onRotate(element, ev);
  }
};

/**
 * 当flip图标为disable时, 不触发点击事件.
 */
export const onFlip = (that, event) => {
  const { actions, disabledIcons, element } = that.props;
  const ev = event || window.event;
  ev.stopPropagation();

  if(!disabledIcons.flipDisable){
    actions.onFlip && actions.onFlip(element, ev);
  }
};

export const stopEvent = (event) => {
  event.stopPropagation();
  event.preventDefault();
}
