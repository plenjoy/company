import { get } from 'lodash';

export const getThemes = (that, themeType) => {
  const { boundThemeActions, settings } = that.props;

  const product = get(settings, 'spec.product');
  const size = get(settings, 'spec.size');
  const currentCategory = that.state.currentCategory;
  const newThemeType = themeType || (currentCategory ? currentCategory.get('code') : '');

  if (newThemeType && product && size) {
    // pageSize设置一个很大的值, 模拟取全部.
    boundThemeActions.getThemes({ themeType: newThemeType, product, size, pageNumber: 1, pageSize: 10000 });
  }
};
