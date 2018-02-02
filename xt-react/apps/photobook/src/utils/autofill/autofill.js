import { List, fromJS } from 'immutable';
import { merge } from 'lodash';
import { filterImagesBy } from '../../../../common/utils/autofill/autofill';
import { toGroupsByKey } from '../../../../common/utils/autofill/helperOfShotTime';
import { toGroupsByDis } from '../../../../common/utils/autofill/helperOfDistribution';
import { autofillResultTypes } from '../../contants/strings';

/**
 * 获取封面的填充数据, 选择一张像素值最大的图片.
 *
 * @param {any} imageArray
 * @returns
 */
const getCoverImage = (imageArray) => {
  const maxResolutionImage = imageArray.maxBy((image) => {
    return image.get('width') * image.get('height');
  });

  return maxResolutionImage;
};

/**
 * 判断当前的图片是否要铺满到整个spread或page
 * @param  {Immuable} image      待检查的图片
 * @param  {Number} innerPageRatio page的宽高比例
 * @return {Boolean}            true - 要铺满, false - 不需要铺满.
 */
const canSpread = (image, innerPageRatio) => {
  const imageRatio = image.get('width') / image.get('height');
  return Math.abs(innerPageRatio - imageRatio) <= 0.03;
};

/**
 * 是否每一个sheet/page就只放一张照片
 * @param  {[type]} imageArray     [description]
 * @param  {[type]} innerPageRatio [description]
 * @return {Boolean}                [description]
 */
const isUsedSpreadModel = (
  imageArray,
  innerPageRatio) => {
  let isUsed = false;

  if (imageArray && imageArray.size) {
    // 只要有一个不符合, 就认为不符合design spec.
    isUsed = !(imageArray.find((image) => {
      return !canSpread(image, innerPageRatio);
    }));
  }

  return isUsed;
};

/**
 * 对一组照片, 进行分组, 每一个sheet/page就只放一张照片..
 * @param  {Boolean} isPressBook       是否为pressbook
 * @param  {Number}  minSheetNumber     支持的最小sheet数
 * @param  {Number}  maxSheetNumber     支持的最大sheet数
 * @param  {Number}  totalSheetNumber   当前book上的sheet数量.
 * @param  {Immutable.list}  imageArray 待分组的照片数组(Immutable.List)
 * @param  {Number}  innerPageRatio     页面的宽高比例.
 * @return {Immutable.list}           分组后的二维数组.
 */
const getMatchedDesignSpecGroups = (
  isPressBook,
  isSupportCoverImage,
  maxSheetNumber,
  totalSheetNumber,
  imageArray,
  innerPageRatio,
  maxImagesEach
) => {
  let results = [];

  // 计算需要额外新增的sheet的数量.
  const addedSheetCount = computedAddedCount(isPressBook, maxSheetNumber, totalSheetNumber, imageArray, innerPageRatio, maxImagesEach);
  const sheetCount = totalSheetNumber + addedSheetCount;

  // 计算page上的page数.
  const pageCount = isPressBook ? (sheetCount - 1) * 2 : sheetCount;

  results = imageArray.reduce((prev, cur, index) => {
    const r = prev;
    if (index < pageCount) {
      r.push([cur.toJS()]);
    }

    return r;
  }, []);

  // 封面上是否要添加图片.
  if (isSupportCoverImage) {
    results.unshift([getCoverImage(imageArray)]);
  }

  return fromJS([{
    groups: results,
    addedCount: addedSheetCount,
    type: autofillResultTypes.best,
    avg: 1,
    mid: Math.ceil(maxImagesEach / 2),
    max: maxImagesEach
  }, {
    groups: results,
    addedCount: addedSheetCount,
    type: autofillResultTypes.default,
    avg: 1,
    mid: Math.ceil(maxImagesEach / 2),
    max: maxImagesEach
  }]);
};

/**
 * 对一组照片, 根据一定的填充算法, 进行分组.
 * 需求: http://wiki.artisanstate.com/pages/viewpage.action?pageId=9569325
 * @param  {Boolean} isPressBook       是否为pressbook
 * @param  {Boolean} isSupportCoverImage  封面是否要添加图片.
 * @param  {Number}  minSheetNumber     支持的最小sheet数
 * @param  {Number}  maxSheetNumber     支持的最大sheet数
 * @param  {Number}  totalSheetNumber   当前book上的sheet数量.
 * @param  {Immutable.list}  imageArray 待分组的照片数组(Immutable.List)
 * @param  {Number}  innerPageRatio     页面的宽高比例.
 * @return {Immutable.list}           分组后的二维数组.
 */
const getDefaultAutofillGroups = (
    isPressBook,
    isSupportCoverImage,
    minSheetNumber,
    maxSheetNumber,
    totalSheetNumber,
    imageArray,
    innerPageRatio,
    maxImagesEach,
    resultType = autofillResultTypes.default) => {
  let results = [];

  //  1. 给照片分组(拍摄时间和没有拍摄时间)
  const outImageArray = imageArray.toJS();
  const imagesWithShottime = filterImagesBy(outImageArray);
  const imagesWithoutShottime = filterImagesBy(outImageArray, 'shotTime', false);

  // 2. 计算需要额外新增的sheet的数量.
  const addedSheetCount = computedAddedCount(isPressBook, maxSheetNumber, totalSheetNumber, imageArray, innerPageRatio, maxImagesEach);
  const sheetCount = totalSheetNumber + addedSheetCount;

  // 3. 确定有拍摄时间照片的所占的sheets数和没有拍摄时间照片所占的sheets数;
  let sheetCountOfShottime = Math.ceil(sheetCount * (imagesWithShottime.length / imageArray.size));
  let sheetCountOfNoShottime = sheetCount - sheetCountOfShottime;

  // 确定pages数.
  let pageCountOfShottime = sheetCountOfShottime;
  let pageCountOfNoShottime = sheetCountOfNoShottime;
  if (isPressBook) {
    // pressbook的首页和尾页不能放置图片.
    if (sheetCountOfShottime) {
      pageCountOfShottime = (sheetCountOfShottime * 2) + (sheetCountOfShottime === sheetCount ? -2 : -1);

      if (pageCountOfShottime > imagesWithShottime.length) {
        sheetCountOfShottime -= 1;
        sheetCountOfNoShottime += 1;

        pageCountOfShottime = (sheetCountOfShottime * 2) + (sheetCountOfShottime === sheetCount ? -2 : -1);
      }
    }

    if (sheetCountOfNoShottime) {
      pageCountOfNoShottime = (sheetCountOfNoShottime * 2) + (sheetCountOfNoShottime === sheetCount ? -2 : -1);
    }
  }

  // 4. 有拍摄时间照片的二次分组, 已知分组的个数(pageCountOfShottime).
  // 给一组排好序的数字, 按要求分组:
  //  a. 已知分组的数量
  //  b. 不能打乱数组顺序.
  //  c. 把间隙小的放在一组
  //  d. 每一组的个数不超过指定的数.
  const groupsOfShotTime = toGroupsByKey(imagesWithShottime, pageCountOfShottime, 1, maxImagesEach, 'shotTime');

  // 5. 没有拍摄时间照片的二次分组
  //  a. 已知分组的个数
  //  b. 正太分布实现分组.
  const groupNumberOfNoShotTime = toGroupsByDis(imagesWithoutShottime.length, pageCountOfNoShottime, 1, maxImagesEach);
  const groupsOfNoShotTime = [];
  groupNumberOfNoShotTime.forEach((count) => {
    groupsOfNoShotTime.push(imagesWithoutShottime.splice(0, count));
  });

  results = groupsOfShotTime.concat(groupsOfNoShotTime);

  // 6. 封面上是否要添加图片.
  if (isSupportCoverImage) {
    results.unshift([getCoverImage(imageArray)]);
  }

  return {
    groups: results,
    addedCount: addedSheetCount,
    type: resultType
  };
};

/**
 * 针对符合designspec的图片, 计算需要额外新增的sheet/page的数量.
 */
const computedSpreadAddedCount = (
  isPressBook,
  maxSheetNumber,
  totalSheetNumber,
  imageArray) => {
  let count = 0;
  const sheetNumberOfImages = isPressBook ? Math.ceil(imageArray.size / 2) : imageArray.size;

  if (sheetNumberOfImages <= totalSheetNumber) {
    count = 0;
  } else if (sheetNumberOfImages <= maxSheetNumber) {
    count = sheetNumberOfImages - totalSheetNumber;
  } else {
    count = maxSheetNumber - totalSheetNumber;
  }

  return count;
};

/**
 * 针对不符合designspec的图片, 计算需要额外新增的sheet/page的数量.
 *     a. 有拍摄时间的照片数量和没有拍摄时间的照片数量以及占比规则.
 *     b. 每个sheet/page允许的最大照片数
 *     c. 现有book中sheets/pages的数量.
 *     d. book中最大sheets数和最小sheets数
 */
const computedDefalutAddedCount = (
  isPressBook,
  maxSheetNumber,
  totalSheetNumber,
  imageArray,
  maxImagesEach) => {
  let count = 0;
  // pressbook的首页和尾页不能放置图片, 浪费一个sheet数.
  const sheetNumberOfImages = Math.ceil(imageArray.size / maxImagesEach) + (isPressBook ? 1 : 0);

  if (sheetNumberOfImages <= totalSheetNumber) {
    count = 0;
  } else {
    //  1. 给照片分组(拍摄时间和没有拍摄时间)
    const outImageArray = imageArray.toJS();
    const imagesWithShottime = fromJS(filterImagesBy(outImageArray));
    const imagesWithoutShottime = fromJS(filterImagesBy(outImageArray, 'shotTime', false));

    // 计算这2组分别应该占据的Sheet（Page）数
    // 根据照片数量计算出有拍摄时间和无拍摄时间分别应该占据的Sheet（Page）数。如有拍摄时间的照片共30张，
    // 无拍摄时间的共有20张，共有50个Page，则有拍摄时间的占30页，无拍摄时间的占20页。如遇到不是整数时，
    // 则有拍摄时间的照片占据该页。如有拍摄时间的照片共17张，无拍摄时间的共23张，共20个Sheet。则有拍摄时间的占9个Sheet，
    // 无拍摄时间的占11个Sheet

    // 2. 计算有拍摄时间和没有拍摄时间的照片所需要的sheets数。
    const sheetCountOfShottime = Math.ceil(imagesWithShottime.size / maxImagesEach);
    const sheetCountOfNoShottime = Math.ceil(imagesWithoutShottime.size / maxImagesEach);

    // 希望的sheets数.
    const hopeSheetsCount = (sheetCountOfShottime + sheetCountOfNoShottime) + (isPressBook ? 1 : 0);

    // 如果当前的sheet数, 可以容纳所有的照片, 那么就不要加页.
    if (hopeSheetsCount <= totalSheetNumber) {
      count = 0;
    } else {
      // 希望的sheets数小于最大sheet数.
      if (hopeSheetsCount <= maxSheetNumber) {
        count = hopeSheetsCount - totalSheetNumber;
      } else {
        count = maxSheetNumber - totalSheetNumber;
      }
    }
  }

  return count;
};

/**
 * 计算需要额外新增的sheet/page的数量.
 * @param  {Boolean} isPressBook       是否为pressbook
 * @param  {Number}  minSheetNumber     支持的最小sheet数
 * @param  {Number}  maxSheetNumber     支持的最大sheet数
 * @param  {Number}  totalSheetNumber   当前book上的sheet数量.
 * @param  {Immutable.list}  imageArray 待分组的照片数组(Immutable.List)
 * @return {Number}
 */
export const computedAddedCount = (
  isPressBook,
  maxSheetNumber,
  totalSheetNumber,
  imageArray,
  innerPageRatio,

  // 每个sheet/page允许放置的最大图片数量
  maxImagesEach = 16
) => {
  let count = 0;

  // 检查是否使用design spec的model.
  const isUsed = isUsedSpreadModel(imageArray, innerPageRatio);

  // 1. 是否为pressbook, pressbook的第一页和最后一页不能放置图片.
  if (isUsed) {
    count = computedSpreadAddedCount(isPressBook, maxSheetNumber, totalSheetNumber, imageArray);
  } else {
    //  2. 确定总sheets数量.
    //    a. 有拍摄时间的照片数量和没有拍摄时间的照片数量以及占比规则.
    //    b. 每个sheet/page允许的最大照片数
    //    c. 现有book中sheets/pages的数量.
    //    d. book中最大sheets数和最小sheets数
    count = computedDefalutAddedCount(
      isPressBook,
      maxSheetNumber,
      totalSheetNumber,
      imageArray,
      maxImagesEach);
  }

  return count;
};

/**
 * 判断照片的数量是否和page的数量刚好相等
 * @param  {Immutable.List}  imageArray
 * @param  {Number}  totalSheetNumber sheet的数量.
 * @param  {Boolean} isPressBook
 * @return {Boolean}
 */
const hasSameQuantityWithPage = (imageArray, totalSheetNumber, isPressBook) => {
  return isPressBook ?
    (imageArray.size === (totalSheetNumber - 1) * 2) :
    (imageArray.size === totalSheetNumber);
};

/**
 * 给每一个group分配一张图片.
 * @param  {[type]} imageArray [description]
 * @return {[type]}            [description]
 */
const getOneImageGroups = (imageArray, isSupportCoverImage, maxImagesEach) => {
  const outImageArray = imageArray.toJS();
  const results = outImageArray.reduce((pre, cur) => {
    pre.push([cur]);
    return pre;
  }, []);

  if (isSupportCoverImage) {
    results.unshift([getCoverImage(imageArray)]);
  }

  return fromJS([{
    groups: results,
    addedCount: 0,
    type: autofillResultTypes.best,
    avg: 1,
    mid: Math.ceil(maxImagesEach / 2),
    max: maxImagesEach
  }, {
    groups: results,
    addedCount: 0,
    type: autofillResultTypes.default,
    avg: 1,
    mid: Math.ceil(maxImagesEach / 2),
    max: maxImagesEach
  }]);
};

/**
 * 对一组照片, 根据一定的填充算法, 进行分组.
 * 需求: http://wiki.artisanstate.com/pages/viewpage.action?pageId=9569325
 * @param  {Boolean} isPressBook       是否为pressbook
 * @param  {Number}  minSheetNumber     支持的最小sheet数
 * @param  {Number}  maxSheetNumber     支持的最大sheet数
 * @param  {Number}  totalSheetNumber   当前book上的sheet数量.
 * @param  {Immutable.list}  imageArray 待分组的照片数组(Immutable.List)
 * @param  {Number}  innerPageRatio     页面的宽高比例.
 * @return {Immutable.list}           分组后的二维数组.
 */
export const getAutoFillData = (
  isPressBook,
  isSupportCoverImage,
  minSheetNumber,
  maxSheetNumber,
  totalSheetNumber,
  imageArray,
  innerPageRatio,
  maxImagesEach) => {
  let results = List();

  // 1. 如果照片的数量是否和page的数量刚好相等. 那么每个page就放置一张照片.
  const hasSameQuantity = hasSameQuantityWithPage(imageArray, totalSheetNumber, isPressBook);
  if (hasSameQuantity) {
    results = getOneImageGroups(imageArray, isSupportCoverImage, maxImagesEach);
  } else {
    // 2. 检查照片是否符合design spec的尺寸, 如果符合, 那么每一个sheet/page只需要放置一张照片.
    // 检查是否使用design spec的model.
    const isUsed = isUsedSpreadModel(imageArray, innerPageRatio);

    if (isUsed) {
      results = getMatchedDesignSpecGroups(
        isPressBook,
        isSupportCoverImage,
        maxSheetNumber,
        totalSheetNumber,
        imageArray,
        innerPageRatio,
        maxImagesEach
      );
    } else {
      // 3. 不符合design spec的images, 就采用默认的分组逻辑.
      // Auto Fill方案: 得到平均值过后，判断该平均值的落值范围
      // a. 平均值<中间值，直接进入下一步的开始运行Auto Fill算法
      // b. 中间值<平均值<最大值，提示用户当前照片数量较多，我们推荐添加X页以得到更好的布局效果，询问用户是否需要加页
      //     - Buttons: [No Thanks] [Add]
      //     - 点击“No Thanks”：按之前的分组结果进入Auto Fill下一步
      //     - 点击“Add”：按添加Pages过后的页数重新从头运行Auto Fill算法
      // c. 平均值>最大值，提示用户当前照片数过多，无法进行Auto Fill的运算，如果需要使用Auto Fill，需要加上X页
      //     - Buttons: [No] [Yes]
      //     - 点击“No”：停止Auto Fill算法
      //     - 点击“Yes”：按最大值的需要，按“中间值<平均值<最大值”方式添加X页，然后从头运行Auto Fill算法，
      //     按“中间值<平均值<最大值”方式运行
      const defaultResult = getDefaultAutofillGroups(
        isPressBook,
        isSupportCoverImage,
        minSheetNumber,
        maxSheetNumber,
        totalSheetNumber,
        imageArray,
        innerPageRatio,
        maxImagesEach,
        autofillResultTypes.default);

      const bestResult = getDefaultAutofillGroups(
        isPressBook,
        isSupportCoverImage,
        minSheetNumber,
        maxSheetNumber,
        totalSheetNumber,
        imageArray,
        innerPageRatio,
        Math.ceil(maxImagesEach / 2),
        autofillResultTypes.best);

      // 计算平均值.
      const pageCount = isPressBook ? (totalSheetNumber - 1) * 2 : totalSheetNumber;
      const avg = Math.ceil(imageArray.size / pageCount);

      const newDefaultResult = merge({}, defaultResult, {
        avg,
        mid: Math.ceil(maxImagesEach / 2),
        max: maxImagesEach
      });

      const newBestResult = merge({}, bestResult, {
        avg,
        mid: Math.ceil(maxImagesEach / 2),
        max: maxImagesEach
      });

      results = fromJS([newDefaultResult, newBestResult]);
    }
  }

  return results;
};
