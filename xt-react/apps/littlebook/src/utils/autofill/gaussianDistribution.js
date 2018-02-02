/**
 * 获取高斯分布数据
 *
 * @export
 * @param {integer} density
 * @returns array
 */
export function getGuassDistribution(density) {
  switch (density) {
    case 1:
    case 2:
      return [0.16, 0.68, 0.16, 0, 0, 0, 0, 0, 0, 0];
    case 3:
      return [0.07, 0.24, 0.38, 0.24, 0.04, 0.03, 0, 0, 0, 0];
    case 4:
      return [0.01, 0.06, 0.24, 0.38, 0.24, 0.06, 0.01, 0, 0, 0];
    case 5:
      return [0.04, 0.07, 0.12, 0.17, 0.20, 0.17, 0.12, 0.07, 0.04, 0];
    default:
      return [0.04, 0.04, 0.08, 0.12, 0.15, 0.16, 0.15, 0.12, 0.08, 0.06];
  }
}
