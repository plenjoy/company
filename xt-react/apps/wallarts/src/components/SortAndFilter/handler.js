
export const handleOptionChange = (that, option) => {
  const { onSorted } = that.props;

  that.setState({ currentOption: option });
  onSorted(option);
};

export const handleHideUsedToggle = (that, event) => {
  const { onToggleHideUsed } = that.props;
  const isChecked = event.target.checked;

  onToggleHideUsed(isChecked);
};

export const hideOptions = (that) => {
  that.setState({
    OptionsStatus: false
  });
};

export const showOptions = (that) => {
  that.setState({
    OptionsStatus: true
  });
};
