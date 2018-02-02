import { UPDATE_RATIO } from '../../contants/actionTypes';

/**
 * 更新workspace或preview的ratio
 * @param ratios  数据结构为: [{type, ratio}]: 标识是更新workspace还是preview的ratio
 */
export function updateRatio(ratios) {
  return {
    type: UPDATE_RATIO,
    ratios
  };
}

