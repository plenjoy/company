/**
 * 当crop图标为disable时, 不触发点击事件.
 */
export const onCrop = (that, event) => {
	const { actions, data } = that.props;
	const ev = event || window.event;
	ev.stopPropagation();
	actions.onEditImage && actions.onEditImage(ev);
};

/**
 * 当rotate图标为disable时, 不触发点击事件.
 */
export const onRotate = (that, event) => {
	const { actions, data } = that.props;
	const ev = event || window.event;
	ev.stopPropagation();
	actions.onRotateImage && actions.onRotateImage(ev);
};

/**
 * 当flip图标为disable时, 不触发点击事件.
 */
export const onFlip = (that, event) => {
	const { actions, data } = that.props;
	const ev = event || window.event;
	ev.stopPropagation();
	actions.onFlipImage && actions.onFlipImage(ev);
};
