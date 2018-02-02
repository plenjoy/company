
export const onClickMore = (that, e) => {
  const event = e || window.event;
  event.stopPropagation();

  const currentStep = that.state.currentStep;
  const { steps, onChangeStep } = that.props;

  if (currentStep < steps) {
    const newStep = currentStep + 1;

    that.setState({
      currentStep: newStep
    });

    onChangeStep && onChangeStep(newStep);
  }
};

export const onClickLess = (that, e) => {
  const event = e || window.event;
  event.stopPropagation();

  const currentStep = that.state.currentStep;
  const { onChangeStep } = that.props;

  if (currentStep > 0) {
    const newStep = currentStep - 1;
    that.setState({
      currentStep: newStep
    });

    onChangeStep && onChangeStep(newStep);
  }
};

