export const onRandom = (that) => {
  const { actions } = that.props;
  const { boundRandomActions } = actions;

  boundRandomActions.random(Math.random(Math.random() * 10000000));
};
