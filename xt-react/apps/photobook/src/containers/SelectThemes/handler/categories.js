
export const getCategories = (that) => {
  const { boundThemeActions, categories } = that.props;

  // 获取theme的categories.
  if (!categories || !categories.size) {
    boundThemeActions.getThemeCategories();
  }
};

/**
 * 切换theme的category.
 * @param  {[type]} that          [description]
 * @param  {[type]} newCategory [description]
 * @return {[type]}               [description]
 */
export const changeCategory = (that, newCategory) => {
  const { boundThemeActions, boundTrackerActions } = that.props;
  const themeCategoryCode = newCategory.get('code');

  boundTrackerActions.addTracker(`ClickThemeType,${newCategory.get('displayName')},${themeCategoryCode}`);
  boundThemeActions.setThemeType(themeCategoryCode);

  that.getThemes(themeCategoryCode);
};

