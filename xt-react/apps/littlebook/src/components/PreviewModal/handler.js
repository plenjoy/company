// handlers write here
export const onClosePreviewModal = (that) => {
  const { actions } = that.props;
  const { closePreviewModal } = actions;

  closePreviewModal && closePreviewModal();
};
