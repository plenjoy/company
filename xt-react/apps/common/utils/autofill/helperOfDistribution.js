/**
* 生成正太分布随机数.
*/
const randomNormalDistribution = () => {
  let u = 0.0,
    v = 0.0,
    w = 0.0,
    c = 0.0;
  do {
    // 获得两个（-1,1）的独立随机变量
    u = Math.random() * 2 - 1.0;
    v = Math.random() * 2 - 1.0;
    w = u * u + v * v;
  } while (w == 0.0 || w >= 1.0);

  // 这里就是 Box-Muller转换
  c = Math.sqrt((-2 * Math.log(w)) / w);

  // 返回2个标准正态分布的随机数，封装进一个数组返回
  // 当然，因为这个函数运行较快，也可以扔掉一个
  // return [u*c,v*c];
  return u * c;
};

/**
 * 根据均值, 方差. 生成基于正太分布的单个数字
 * @param  {Number} avg      平均值
 * @param  {Number} variance 方差
 * @return {Number}          新的number.
 */
const getNumberInNormalDistribution = (avg, variance) => {
  return avg + (randomNormalDistribution() * variance);
};

/**
 * 生成基于正太分布图的一组数字.
 * @param  {Number} avg 均值
 * @param  {Number} variance 标准差
 * @param  {Number} count 调用次数.
 * @return {Array}  正太分布图的数据: [{number: 2, value: 20, precent: 20}],
 * - number: 表示数字2,
 * - value: 出现20次,
 * - precent: 出现的概率为20%.
 */
const distribution = (avg, variance, count = 100) => {
  const m = {};
  const arr = [];

  for (let i = 0; i < count; i++) {
    const v = Math.round(getNumberInNormalDistribution(avg, variance));
    m[v] ? m[v] += 1 : m[v] = 1;
  }

  for (const key in m) {
    arr.push({
      number: parseInt(key),
      value: m[key],
      precent: Math.round((m[key] / count) * 100)
    });
  }

  // 根据出现的概率从小到大排序. 并且过滤小于0的选项.
  return arr.sort((a, b) => b.value - a.value);
};

/**
 * 把array里的元素打散.
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
const randomArray = (arr) => {
  const newArr = [];
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * arr.length);
    newArr.push(arr.splice(index, 1)[0]);
  }

  return newArr;
};

/**
 * 对照片的总数, 基于正太分布, 进行分组.
 * @param  {Number} count       照片总数
 * @param  {Number} groupCount  分组数
 * @param  {Number} min        每组的最小照片数.
 * @param  {Number} max        每组的最大照片数.
 * @return {Array}            分好组的照片数组. [1, 4, 3, 1, 4, 2, 4, 4, 3, 4, 1]
 */
export const toGroupsByDis = (imagesCount, groupCount, min = 1, max = 8) => {
  const count = imagesCount;

  // 初始化分组每组照片的个数.
  const result = new Array(groupCount).fill(0);

  // 参数检查.
  // 检查1. 照片总数如果大于分组数乘以每组的最大数, 那么就使用后者的个数.
  if (count >= groupCount * max) {
    for (let i = 0; i < groupCount; i++) {
      result[i] = max;
    }

    return result;
  } else if (count <= groupCount * min) {
    // 检查2. 照片总数如果小于于分组数乘以每组的最小数
    let temp = 0;
    for (let i = 0; i < count; i++) {
      if (temp + min <= count) {
        result[i] = min;
      } else if ((count - temp) > 0) {
        result[i] = count - temp;
        break;
      }

      temp += min;
    }

    return result;
  }

  // 1. 给每一组都放一张照片, 确认每组至少都有一张.
  for (let i = 0; i < groupCount; i++) {
    result[i] = min;
  }

  // 2. 计算还剩下多少张照片.
  const more = count - groupCount * min;

  // 计算剩下照片分到所有的分组中, 平均能分到多少张.
  let avg = Math.ceil(more / groupCount);
  avg = avg < 2 ? 2 : avg;

  // 方差.
  const variance = 2;

  // 生成基于正太分布图的一组数字. 即生成数字从min到max之间所有数字出现的概率.
  let dis = distribution(avg, variance);

  // 过滤number小于0和number加上min大于max的选项.
  dis = dis.filter(m => m.number > 0 && (m.number + min) <= max);

  // 保存根据正太分布数据, 生成的每个数字出现的次数的对象. 比如[{number:2, occurs: 3}]
  // - 数字2, 可以出现2次.
  const distributionArr = [];

  // 除去每组的最小照片数外, 还剩下照片的个数.
  let rest = more;
  for (let k = 0; k < dis.length; k++) {
    // 剩余的照片为0时, 表示所有的照片分组完成.
    if (rest === 0) {
      break;
    }

    // 计算当前的数字所需要的照片总数.
    const occurrs = Math.round(dis[k].precent * more / 100);
    let takes = occurrs * dis[k].number;

    // 如果所需要的照片数小于剩余的照片总数, 可以开一个新项目.
    if (takes && takes <= rest) {
      distributionArr.push({
        number: dis[k].number,
        occurrs
      });

      // 更新剩余的照片总数.
      rest -= takes;
    } else {
      // 如果所需要的照片数大于剩余的照片总数
      // 说明该数字出现的次数太多了, 依次减少次数.
      for (let j = occurrs; j > 0; j--) {
        takes = j * dis[k].number;

        if (takes && takes <= rest) {
          distributionArr.push({
            number: dis[k].number,
            occurrs: j
          });

          // 更新剩余的照片总数.
          rest -= takes;
          break;
        }
      }
    }

    // 如果剩余的照片数是1或2时, 直接使用.
    if (rest > 0 && rest <= 2) {
      distributionArr.push({
        number: rest,
        occurrs: 1
      });

      rest = 0;
      break;
    }

    // 如果剩余数小于等于0, 分组完毕.
    if (rest <= 0) {
      rest = 0;
      break;
    }
  }

  // 最后依次循环, 可以会有剩余的照片未分组.
  if (rest) {
    distributionArr.push({
      number: rest,
      occurrs: 1
    });
  }

  // 对分好组的数字对象进行汇总.
  // [{number: 2, occurs:3}, {number:3, occurs:2},...] => [2,2,2,3,3,...]
  const r = distributionArr.reduce((g, m) => {
    // 出现的次数, 表示组数.
    // {number:2, occurs: 3}， 表示[2,2,2]
    for (let i = 0; i < m.occurrs; i++) {
      // 组数小于最大组数时, 可以开心组.
      if (g.length < groupCount) {
        g.push(m.number);
      } else {
        // 组数等于最大组数时. 不能开新组
        // 找到符合条件的组, 将个数依次分配到合适的组.
        for (let i = 0; i < m.number; i++) {
          const index = g.findIndex(k => k + 1 + min <= max);
          if (index !== -1) {
            g[index] += 1;
          } else {
            throw new Error('fuck, auto fill failed');
          }
        }
      }
    }

    return g;
  }, []);

  // 合并数据: 每组的最小个数 + 正太分布后生成的组数.
  r.forEach((num, index) => {
    result[index] += num;
  });

  // 打散数组分布
  return randomArray(result);
};
