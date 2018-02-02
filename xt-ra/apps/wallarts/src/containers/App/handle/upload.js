
export function addStatusCount(that, fieldName, count = 1) {
  const { boundImagesActions } = that.props;
  boundImagesActions.addStatusCount(fieldName, count);
}

export function updateStatusCount(that, fieldName, count = 1) {
  const { boundImagesActions } = that.props;
  boundImagesActions.updateStatusCount(fieldName, count);
}

export function resetStatus(that) {
  const { boundImagesActions } = that.props;
  boundImagesActions.resetStatusCount();
}
