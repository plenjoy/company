export const onAddTodo = (that, ref) => {
  const { actions } = that.props;
  const { boundTodoActions } = actions;

  const input = that.refs[ref];
  const value = input.value;
  if (value.trim()) {
    boundTodoActions.addTodo(value.trim());
    input.value = '';
  }
};

export const onDeleteTodo = (that, index) => {
  const { actions } = that.props;
  const { boundTodoActions } = actions;
  boundTodoActions.removeTodo(index);
};
