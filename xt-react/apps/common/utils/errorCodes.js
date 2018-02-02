/**
 * 保存接口返回的status code的说明.
 * @type {Object}
 */
export const codesOfSaveProject = {
  // 成功
  success: 200,

  // 预料之外的错误
  unexpected: -100,

  // 空的skuJson或者ProjectJson
  emptySkuOrProject: -101,

  // 空的title
  emptyTitle: -102,

  // 插入aprod_project_sku失败
  aprodProjectSku: -104,

  // 已存在的title
  existedTitle: -103,

  // 没有找到sku
  notFoundSku: -105,

  // id没有对应的Project
  notFoundProject: -106,

  // project创建者不是该用户
  notOwnerOfProject: -107,

  // Project在购物车或者订单中
  projectInOrder: -108,

  // 打回时校验失败
  checkFailedOfSubmit: -109,

  // type是非法的
  invalidOfType: -110,

  // session 失效
  sessionTimeout: -111
};
