
export const handleOptionChange = (that, option) => {
  const { onGrouped } = that.props;

  that.setState({ currentOption: option });
  onGrouped(option);
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
