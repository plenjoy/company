/**
 * 创建formData
 * @param {object} params 属性列表
 */
const createFormData = params => {
  const formData = new FormData();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }
  return formData;
};

export const createImageFormData = data => {
  return createFormData(data);
};
