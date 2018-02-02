/*
给一组排好序的数字, 按要求分组:
  a. 已知分组的数量
  b. 不能打乱数组顺序.
  c. 把间隙小的放在一组
  d. 每一组的个数不超过指定的数.

比如: 给这组数字分组: [3, 4, 9, 12, 13, 22, 23, 32, 33, 40, 40, 42, 45, 50, 51, 55, 60, 64, 73, 73, 78, 81, 88, 89, 89, 92, 94, 94, 94, 95]
  a. 把间隙小的放在一组
  b. 分成10组, 每组至少有一个元素.
  c. 每组最多有6个元素.
  d. 不能打乱数组顺序.

请问一下如何实现.
 */

// DP: [数组下标][已有组数][最后一组数量] = 最小差距和
const update = (target, j, k, value, prep) => {
  target[j] = target[j] || [];
  if (target[j][k] && target[j][k].value < value) {
    return;
  }
  target[j][k] = {
    value,
    prep
  };
};

/**
 * 给一组排好序的数字, 按要求分组:
 *   a. 已知分组的数量
 *   b. 不能打乱数组顺序.
 *   c. 把间隙小的放在一组
 *   d. 每一组的个数不超过指定的数.
 * @param  {[type]} a    待分组的数组
 * @param  {Number} sets 分成几组的组数.
 * @param  {Number} min  每一组的最小个数
 * @param  {Number} max  每一组的最大个数
 * @param  {string} key  比较分组的依据.
 * @return {[type]}      [description]
 */
export const toGroupsByKey = (a, sets, min, max, key = 'shotTime') => {
  if (!a || !a.length) {
    return [];
  }

  // 一张图片
  if (a.length === 1) {
    return [a];
  }

  // 图片数量小于分组
  if (a.length < sets) {
    const results = new Array(sets).fill([]);
    a.reduce((prev, cur, index) => {
      prev[index] = [cur];

      return prev;
    }, results);

    return results;
  }

  // 图片数量大于(分组*最大数的总和)
  if (a.length >= (sets * max)) {
    const results = new Array(sets).fill([]);
    for (let i = 0; i < sets; i++) {
      results[i] = a.splice(0, max);
    }

    return results;
  }

  const m = [
    [
      undefined,
      [
        undefined,
        {
          value: 0,
          prep: null
        }
      ]
    ]
  ];

  for (let i = 1; i < a.length; i++) {
    const l = m[i - 1];
    const t = [];
    for (let j = 0; j < l.length; j++) {
      if (!l[j]) {
        continue;
      }
      for (let k = 0; k < l[j].length; k++) {
        if (!l[j][k]) {
          continue;
        }
        const { value } = l[j][k];

        if (k >= min && j < sets) {
          // 满足最小数量，可以开新桶。
          update(t, j + 1, 1, value, { j, k });
        }
        if (k < max) {
          // 不足最大数量，可以用旧桶。
          update(t, j, k + 1, value + a[i][key] - a[i - 1][key], { j, k });
        }
      }
    }
    m.push(t);
  }

  if (!m[a.length - 1][sets]) {
    // 数量不符合条件。建议提前检查。
    throw Error('Error occurs');
  }
  const best = m[a.length - 1][sets].reduce((a, b) => a.value < b.value ? a : b);

  let j = sets;
  let k = m[a.length - 1][sets].indexOf(best);

  const out = [[a[a.length - 1]]];

  for (let i = a.length - 2; i >= 0; i--) {
    const { prep } = m[i + 1][j][k];
    if (prep.j !== j) {
      out.unshift([]);
    }
    out[0].unshift(a[i]);
    j = prep.j;
    k = prep.k;
  }
  return out;
};

// console.log(toGroups(
//     [3, 4, 9, 12, 13, 22, 23, 32, 33, 40, 40, 42, 45, 50, 51, 55, 60, 64, 73, 73, 78, 81, 88, 89, 89, 92, 94, 94, 94, 95],
//     10,
//     1,
//     6
// ));

