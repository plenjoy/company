export const resetTitle = (that, event) => {
  that.setState({
    name: event.target.value
  });
  that.checkProjectTitle(event.target.value);
};

export const checkProjectTitle = (that, ProjectTitle, callback) => {
  const { checkProjectTitle, userId, closeCloneModal } = that.props;
  const timerFunc = (ProjectTitle) => {
    checkProjectTitle({ projectName: ProjectTitle, customerID: userId }).then((res) => {
      that.setState({ isChecking: false });
      if (!res) {
        that.setState({
          isInvalid: true,
          errorTip: 'Title existed, please pick another one.'
        });
      } else {
        if (callback) {
          that.handleCloseCloneModal();
          callback(ProjectTitle);
        }
        that.setState({
          isInvalid: false,
          errorTip: ''
        });
      }
    });
  };
  if (!ProjectTitle) {
    that.setState({
      isInvalid: true,
      errorTip: 'Title is required'
    });
  } else if (!(/^[a-zA-Z 0-9\d_\s-]+$/.test(ProjectTitle))) {
    that.setState({
      isInvalid: true,
      errorTip: 'Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.'
    });
  } else {
    if (callback) {
      timerFunc(ProjectTitle);
    } else {
      if (that.state.timer) {
        clearTimeout(that.state.timer);
      }
      const timer = setTimeout(timerFunc, 300);
      that.setState({
        timer
      });
    }
  }
};

export const handleCloseCloneModal = (that) => {
  const { closeCloneModal } = that.props;
  closeCloneModal();
  that.setState({
    name: '',
    timer: null,
    isInvalid: false,
    errorTip: '.'
  });
};

export const handleClone = (that) => {
  const { onCloneProject, addAlbum, userId, addTracker } = that.props;
  const callback = (name) => {
    addAlbum(userId, name).then(() => {
      onCloneProject(name);
    });
  };
  addTracker('ClickCloneAndDone');
  that.checkProjectTitle(that.state.name, callback);
};
