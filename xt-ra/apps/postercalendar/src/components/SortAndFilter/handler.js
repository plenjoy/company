
export const getSortOptions = (t) => {
  return [
    {
      label: t('DATE_TOKEN_O_T_N'),
      value: '>-shotTime'
    },
    {
      label: t('DATE_TOKEN_N_T_O'),
      value: '<-shotTime'
    },
    {
      label: t('UPLOAD_TIME_O_T_N'),
      value: '>-uploadTime'
    },
    {
      label: t('UPLOAD_TIME_N_T_O'),
      value: '<-uploadTime'
    },
    {
      label: t('TITLE_A_Z'),
      value: '>-name'
    },
    {
      label: t('TITLE_Z_A'),
      value: '<-name'
    },
  ];
};

export const handleOptionChange = (that, option) => {
  const { onSorted } = that.props;

  that.setState({ sortValue: option });
  onSorted({ value: option.value });
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
