import { getUserOS } from '../../../../common/utils/getUserOS';

export const closeContactUsModal = (that) => {
  const boundContactUsActions = that.props.boundContactUsActions;
  that.refs.questionInputer.value = '';
  that.refs.requestInputer.value = '';
  that.refs.bugInputer.value = '';
  that.setState({ isBlank: true });
  boundContactUsActions.hideContactUsModal();
};

export const handleSubmit = (that) => {
  const { boundContactUsActions, addNotification } = that.props;
  const { env, project } = that.props;
  const user = env.userInfo;
  const userId = user.get('id').toString();
  const userName = user.get('firstName');
  const userEmail = user.get('email');
  const projectId = project.get('projectId').toString();
  const projectName = project.get('title');
  const question = that.refs.questionInputer.value;
  const featureRequest = that.refs.requestInputer.value;
  const bug = that.refs.bugInputer.value;
  const os = getUserOS();
  const browser = `[appName:${navigator.appName};userAgent:${navigator.userAgent};appVersion:${navigator.appVersion}]`;
  const params = {
    userId,
    userName,
    userEmail,
    projectName,
    projectId,
    os,
    browser,
    question,
    featureRequest,
    bug
  };
  that.closeContactUsModal();
  boundContactUsActions.handleSubmit(params).then((res) => {
    if (res.resultData.state === 'success') {
      addNotification({
        message: 'Submit successfully.\nMany thanks for your feedback.',
        level: 'success',
        autoDismiss: 2
      });
    } else {
      addNotification({
        message: 'Send failed, you may try again later',
        level: 'error',
        autoDismiss: 0
      });
    }
  });
};

export const checkBlank = (that) => {
  if (!that.refs.questionInputer.value && !that.refs.requestInputer.value && !that.refs.bugInputer.value) {
    that.setState({
      isBlank: true
    });
  } else {
    that.setState({
      isBlank: false
    });
  }
};
