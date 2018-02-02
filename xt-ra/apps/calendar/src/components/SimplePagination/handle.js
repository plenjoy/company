/**
 * 翻页.
 * @param that 翻页组件的this指向
 * @param sheet 目标页的序号
 */
const goto = (that, sheet) => {
  clearTimeout(that.timer);

  that.timer = setTimeout(() => {
    const { total } = that.state;
    const { actions, data } = that.props;
    const { current, minSheetIndex } = data;
    const { onPage } = actions;
    const newMinSheetIndex = minSheetIndex || 0;

    if (sheet >= newMinSheetIndex && sheet <= total) {
      that.setState({
        current: sheet
      });

      if (onPage && typeof (onPage) === 'function') {
        const ClickPageBtn = (sheet > current) ? 'ClickNextPage' : 'ClickPreviousPage';
        const TrackerParam = `${ClickPageBtn},${sheet}`;
        onPage({
          total,
          current: sheet,
          TrackerParam
        });
      }
    }
  }, 300);
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
