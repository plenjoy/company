import { coverTypes } from '../contants/strings';
import * as materials from '../contants/material';

/**
 * 根据指定的cover类型, 获取存放该素材的文件夹的名称.
 * @param coverType
 */
const mapToMaterialsFolderName = (coverType) => {
  let name = '';

  switch (coverType) {
    case coverTypes.LBHC: {
      name = 'hard';
      break;
    }
    case coverTypes.LBPAC: {
      name = 'paper';
      break;
    }
    default:
      break;
  }

  return name;
};

/**
 * 根据指定的cover类型, 获取该cover的所有素材的路径.
 * @param coverType 封面类型.
 * @param isCover true: 获取封面的素材, false: 获取内页的素材.
 */
export const getMaterialsByCoverType = (originalMaterialObj, coverType, isCover = true) => {
  if (!originalMaterialObj) {
    return null;
  }

  const name = mapToMaterialsFolderName(coverType);
  const allMaterials = originalMaterialObj[name];
  let obj = null;
  if (allMaterials) {
    obj = isCover ? allMaterials.cover : allMaterials.inner;
  }

  return obj;
};
