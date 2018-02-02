/**
 * 保存自定义模板.
 */
 import { merge } from 'lodash';

export const onSaveTemplate = (that) => {
  const { paginationSpread, pagination, boundSaveTemplateActions } = that.props;
  const newPaginationSpread = merge({}, paginationSpread.toJS());
  const newPagination = merge({}, pagination);
  // TODO.
  boundSaveTemplateActions.showSaveTemplateModal(newPaginationSpread, newPagination);
};
