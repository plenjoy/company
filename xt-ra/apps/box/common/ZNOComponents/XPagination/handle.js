/**
 * 翻页.
 * @param that 翻页组件的this指向
 * @param sheet 目标页的序号
 */
const goto = (that, sheet) => {
  clearTimeout(that.timer);

  that.timer = setTimeout(() => {
    const { total } = that.state;
    const { actions } = that.props;
    const { onPage } = actions;

    if (sheet >= 0 && sheet <= total) {
      that.setState({
        current: sheet
      });

      if (onPage && typeof(onPage) === 'function') {
        onPage({
          total,
          current: sheet
        });
      }
    }
  }, 300);
};

/**
 * 翻到第一页(封面)
 * @param that
 */
export const goFirst = (that) => {
  // 0: 封面.
  goto(that, 0);
};

/**
 * 翻到上一页
 * @param that
 */
export const goPrevious = (that) => {
  const { current } = that.state;
  goto(that, current - 1);
};

/**
 * 翻到下一页
 * @param that
 */
export const goNext = (that) => {
  const { current } = that.state;
  goto(that, current + 1);
};

/**
 * 翻到最后一页.
 * @param that
 */
export const goLast = (that) => {
  const { total } = that.state;
  goto(that, total);
};
