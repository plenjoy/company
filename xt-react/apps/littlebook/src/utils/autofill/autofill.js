import Immutable from 'immutable';

import { normalRandom } from './normalRandom';
import { getGuassDistribution } from './gaussianDistribution';

const MAX_AVERAGE_DENSITY = 6;
const DEFAULT_AVERAGE_DENSITY = 5;
const DEFAULT_MIN_IMAGES_PER_SHEET = 1;
let defaultMaxImagesPerSheet = 10;

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

function canSpread(image, innerPageRatio) {
  const imageRatio = image.get('width') / image.get('height');
  return Math.abs(innerPageRatio - imageRatio) <= 0.03;
}

/**
 * 准备autoFill所需要的参数数据
 *
 * @param {any} minSheetNumber
 * @param {any} maxSheetNumber
 * @param {any} imageArray
 * @returns
 */
function prepareParameter(
  minSheetNumber,
  maxSheetNumber,
  imageArray) {
  const imageSize = imageArray.size;

  const minImagesPerSheet = DEFAULT_MIN_IMAGES_PER_SHEET;
  let averageDensity = DEFAULT_AVERAGE_DENSITY;
  let maxImagesPerSheet = defaultMaxImagesPerSheet;


  if (imageSize <= minSheetNumber) {
    averageDensity = 1;
  } else if (imageSize < minSheetNumber * averageDensity) {
    averageDensity = Math.floor(imageSize / minSheetNumber);
  } else if (imageSize > maxSheetNumber * averageDensity) {
    const density = Math.floor(imageSize / maxSheetNumber);
    averageDensity = Math.min(MAX_AVERAGE_DENSITY, density);
  }

  maxImagesPerSheet = Math.min(
    defaultMaxImagesPerSheet, (averageDensity * 2) + 1
  );


  // 将图片数据进行分类、排序
  let datedImageArray = Immutable.List();
  let undatedImageArray = Immutable.List();

  imageArray.forEach((image) => {
    if (image.get('shotTime')) {
      datedImageArray = datedImageArray.push(image);
    } else {
      undatedImageArray = undatedImageArray.push(image);
    }
  });

  datedImageArray = datedImageArray.sort((a, b) => {
    return a.get('shotTime') - b.get('shotTime');
  });

  undatedImageArray = undatedImageArray.sort((a, b) => {
    return a.get('name') - b.get('name');
  });


  // 统计有拍摄日期和没有拍摄日期的sheet数量
  const countDatedAndUndatedImages = datedImageArray.size +
    undatedImageArray.size;

  let countDatedAndUndatedSheets = Math.round(countDatedAndUndatedImages /
    averageDensity);

  let countUndatedSheets = Math.round(countDatedAndUndatedSheets *
    (undatedImageArray.size / countDatedAndUndatedImages));

  if (undatedImageArray.size / countUndatedSheets > maxImagesPerSheet) {
    countUndatedSheets += 1;
  }

  let countDatedSheets = countDatedAndUndatedSheets - countUndatedSheets;

  if (datedImageArray.size && !countDatedSheets) {
    countDatedSheets = 1;

    if (countDatedAndUndatedSheets < maxSheetNumber) {
      countDatedAndUndatedSheets += 1;
    }
  }


  return {
    minSheetNumber,
    maxSheetNumber,
    averageDensity,
    minImagesPerSheet,
    maxImagesPerSheet,
    datedImageArray,
    undatedImageArray,
    countDatedAndUndatedSheets,
    countDatedSheets,
    countUndatedSheets
  };
}

/**
 * 获取没有拍摄日期的分组数据
 *
 * @param {any} parameters
 * @returns
 */
function getUndatedData(parameters) {
  const {
    averageDensity,
    minImagesPerSheet,
    maxImagesPerSheet,
    undatedImageArray,
    countUndatedSheets
  } = parameters;

  let undatedImageSizeArray = Immutable.List(new Array(countUndatedSheets));

  const averageImagesPerSheet = (maxImagesPerSheet - minImagesPerSheet) / 2;

  let sum = 0;

  undatedImageSizeArray = undatedImageSizeArray.map(() => {
    let imageSize = Math.floor(
      normalRandom(averageDensity, averageImagesPerSheet)
    );
    imageSize = clamp(imageSize, minImagesPerSheet, maxImagesPerSheet);

    sum += imageSize;
    return imageSize;
  });

  // 将溢出图片数量平衡为图片的总数
  let offset = undatedImageArray.size - sum;
  let i = 0;
  while (offset !== 0) {
    const imageSize = undatedImageSizeArray.get(i);
    if (offset > 0) {
      if (imageSize < maxImagesPerSheet) {
        undatedImageSizeArray = undatedImageSizeArray.set(i, imageSize + 1);
        offset -= 1;
      }
    } else if (imageSize > minImagesPerSheet) {
      undatedImageSizeArray = undatedImageSizeArray.set(i, imageSize - 1);
      offset += 1;
    }
    i += 1;
    if (i >= undatedImageSizeArray.size && offset) {
      i = 0;
    }
  }

  // 根据图片数量将无拍摄日期照片的Id填充到结果集中
  let resultUndatedImageGroupArray = Immutable.List();
  let k = 0;
  undatedImageSizeArray.forEach((imageSize) => {
    let undatedImageGroup = Immutable.List(new Array(imageSize));

    undatedImageGroup = undatedImageGroup.map(() => {
      return undatedImageArray.get(k++);
    });

    resultUndatedImageGroupArray = resultUndatedImageGroupArray.push(
      undatedImageGroup
    );
  });


  return resultUndatedImageGroupArray;
}

/**
 * 获取分组数据之间拍摄时间间隔最小的索引
 *
 * @param {any} datedImageGroupArray
 * @param {any} excludeImageSize  合并后的大小不能大于这个图片数量
 * @returns
 */
function getMinTimeDiffImageGroupIndex(
  datedImageGroupArray,
  excludeImageSize = defaultMaxImagesPerSheet + 1) {
  let minDiffIndex = -1;
  let prevDiffTime = Infinity;
  datedImageGroupArray.forEach((imageGroup, index) => {
    const nextImageGroup = datedImageGroupArray.get(index + 1);

    if (nextImageGroup) {
      const newGroupSize = imageGroup.size + nextImageGroup.size;

      if (newGroupSize < excludeImageSize) {
        const diffTime = nextImageGroup.first().get('shotTime') -
          imageGroup.last().get('shotTime');
        if (diffTime < prevDiffTime) {
          prevDiffTime = diffTime;
          minDiffIndex = index;
        }
      }
    } else {
      return false;
    }
  });


  return minDiffIndex;
}

/**
 * 获取图片组中拍摄时间间隔最大的索引
 *
 * @param {any} imageGroup
 * @returns
 */
function getMaxTimeDiffImageIndex(imageGroup) {
  let maxDiffIndex = -1;
  let prevDiffTime = 0;

  if (imageGroup) {
    imageGroup.forEach((image, index) => {
      const nextImage = imageGroup.get(index + 1);

      if (nextImage) {
        const diffTime = nextImage.get('shotTime') - image.get('shotTime');
        if (diffTime > prevDiffTime) {
          prevDiffTime = diffTime;
          maxDiffIndex = index;
        }
      }
    });
  }

  return maxDiffIndex;
}

/**
 * 获取分组数据的密度
 *
 * @param {any} imageGroupArray
 * @returns
 */
function getImageGroupArrayDensity(imageGroupArray) {
  let imageGroupArrayDensity = Immutable.List(
    new Array(defaultMaxImagesPerSheet)
  );

  imageGroupArrayDensity.forEach((v, index) => {
    const imageSize = index + 1;

    let imageSizeTimes = 0;
    imageGroupArray.forEach((imageGroup) => {
      if (imageGroup.size === imageSize) {
        imageSizeTimes += 1;
      }
    });

    imageGroupArrayDensity = imageGroupArrayDensity.set(
      index,
      imageSizeTimes / imageGroupArray.size
    );
  });

  return imageGroupArrayDensity;
}

/**
 * 合并imageIndex相邻（下一个）的分组数据
 *
 * @param {any} datedImageGroupArray
 * @param {any} imageIndex
 * @returns
 */
function getMergedImageGroupArray(datedImageGroupArray, imageIndex) {
  let mergedImageGroupArray = datedImageGroupArray;
  const nextImageIndex = imageIndex + 1;
  const imageGroup = mergedImageGroupArray.get(imageIndex);
  const nextImageGroup = mergedImageGroupArray.get(nextImageIndex);

  if (nextImageGroup) {
    let newGroup = imageGroup.concat(nextImageGroup);
    newGroup = newGroup.sort((a, b) => {
      return a.get('shotTime') - b.get('shotTime');
    });


    mergedImageGroupArray = mergedImageGroupArray.set(imageIndex, newGroup);
    mergedImageGroupArray = mergedImageGroupArray.delete(nextImageIndex);
  }

  return mergedImageGroupArray;
}

/**
 * 对超出高斯分布比例的数据进行拆分
 *
 * @param {any} datedImageGroupArray
 * @param {any} exceededImageGroupIndex
 * @returns
 */
function getSplittedImageGroupArray(
  datedImageGroupArray,
  exceededImageGroupIndex) {
  let resultDatedImageGroupArray = datedImageGroupArray;
  if (resultDatedImageGroupArray) {
    const exceededImageGroup = resultDatedImageGroupArray.get(
      exceededImageGroupIndex
    );
    const maxTimeImageIndex = getMaxTimeDiffImageIndex(exceededImageGroup);

    if (maxTimeImageIndex !== -1) {
      const newGroup1 = exceededImageGroup.slice(0, maxTimeImageIndex + 1);
      const newGroup2 = exceededImageGroup.slice(maxTimeImageIndex + 1);

      resultDatedImageGroupArray = resultDatedImageGroupArray.set(
        exceededImageGroupIndex,
        newGroup1
      );

      resultDatedImageGroupArray = resultDatedImageGroupArray.insert(
        exceededImageGroupIndex + 1,
        newGroup2
      );
    }
  }

  return resultDatedImageGroupArray;
}

/**
 * 获取超出高斯分布算法的图片数量
 *
 * @param {any} datedImageGroupArray
 * @param {any} averageDensity
 * @param {any} excludeImageSize
 * @returns
 */
function getExceededImageSize(
  datedImageGroupArray,
  averageDensity,
  excludeImageSize) {
  const imageGroupArrayDensity = getImageGroupArrayDensity(
    datedImageGroupArray
  );

  const guassDistributionDensity = Immutable.List(
    getGuassDistribution(averageDensity)
  );


  let imageSize = 0;
  const maxIndex = guassDistributionDensity.size - 1;
  for (let i = maxIndex; i > 0; i -= 1) {
    const realDensity = imageGroupArrayDensity.get(i);
    const guassDensity = guassDistributionDensity.get(i);
    if (realDensity > guassDensity && i < excludeImageSize - 1) {
      imageSize = i + 1;
      break;
    }
  }

  return imageSize;
}


/**
 * 获取高斯分布算法调整后的结果集
 *
 * @param {any} datedImageGroupArray
 * @param {any} averageDensity
 */
function getGuassDatedImageGroupArray(datedImageGroupArray, averageDensity) {
  let resultDatedImageGroupArray = datedImageGroupArray;


  let imageSize = defaultMaxImagesPerSheet;
  let lastImageSize = Infinity;
  do {
    let exceededImageGroupIndex = -1;
    imageSize = getExceededImageSize(
      resultDatedImageGroupArray, averageDensity, lastImageSize
    );
    do {
      exceededImageGroupIndex = resultDatedImageGroupArray
      .findIndex((imageGroup) => {
        return imageGroup.size === imageSize;
      });

      if (exceededImageGroupIndex !== -1) {
        resultDatedImageGroupArray = getSplittedImageGroupArray(
          resultDatedImageGroupArray, exceededImageGroupIndex
        );

        const imageIndex = getMinTimeDiffImageGroupIndex(
          resultDatedImageGroupArray,
          imageSize
        );

        if (imageIndex !== -1) {
          resultDatedImageGroupArray = getMergedImageGroupArray(
            resultDatedImageGroupArray,
            imageIndex
          );
        } else {
          resultDatedImageGroupArray = getMergedImageGroupArray(
            resultDatedImageGroupArray,
            exceededImageGroupIndex
          );
          lastImageSize = imageSize;
          break;
        }
      }
    } while (exceededImageGroupIndex !== -1);
  } while (imageSize > DEFAULT_MIN_IMAGES_PER_SHEET);

  return resultDatedImageGroupArray;
}


/**
 * 获取有拍摄时间的分组数据
 *
 * @param {any} parameters
 */
function getDatedData(parameters) {
  const {
    averageDensity,
    datedImageArray,
    countDatedSheets
  } = parameters;

  let datedImageGroupArray = datedImageArray.map((image) => {
    return Immutable.List([image]);
  });


  const mergeTimes = Math.max(datedImageArray.size - countDatedSheets, 0);

  for (let i = 0; i < mergeTimes; i += 1) {
    const imageIndex = getMinTimeDiffImageGroupIndex(datedImageGroupArray);
    datedImageGroupArray = getMergedImageGroupArray(
      datedImageGroupArray, imageIndex
    );
  }


  return getGuassDatedImageGroupArray(
    datedImageGroupArray, averageDensity
  );
}


/**
 * 获取每页只能是单张图片的分组数据
 *
 * @param {any} parameters
 * @returns
 */
function getSingleImagePerSheetData(parameters) {
  const {
    datedImageArray,
    undatedImageArray
  } = parameters;

  const resultDatedImageArray = datedImageArray.map((image) => {
    return Immutable.List([image]);
  });

  const resultUndatedImageArray = undatedImageArray.map((image) => {
    return Immutable.List([image]);
  });

  return resultDatedImageArray.concat(resultUndatedImageArray);
}

function getCanSpreadImageGroupIndexArray(imageGroup, innerPageRatio) {
  let outImageIndexArray = Immutable.List();
  imageGroup.forEach((image, index) => {
    if (canSpread(image, innerPageRatio)) {
      outImageIndexArray = outImageIndexArray.push(index);
    }
  });
  return outImageIndexArray;
}

function getSpreadSplittedImageGroupArray(imageGroup, imageIndexArray) {
  let outImageGroupArray = Immutable.List();


  imageIndexArray.forEach((imageIndex, index) => {
    const nextIndex = imageIndexArray.get(index + 1);

    if (imageIndex !== 0 && index === 0) {
      const firstGroup = imageGroup.slice(0, imageIndex);
      outImageGroupArray = outImageGroupArray.push(firstGroup);
    }

    const newGroup1 = Immutable.List([imageGroup.get(imageIndex)]);
    let newGroup2 = imageGroup.slice(imageIndex + 1);

    if (nextIndex) {
      newGroup2 = imageGroup.slice(imageIndex + 1, nextIndex - imageIndex);
    }

    outImageGroupArray = outImageGroupArray.push(newGroup1);

    if (newGroup2.size) {
      outImageGroupArray = outImageGroupArray.push(newGroup2);
    }
  });

  return outImageGroupArray;
}

function getSpreadData(imageGroupArray, innerPageRatio) {
  let outImageGroupArray = Immutable.List();
  if (imageGroupArray) {
    imageGroupArray.forEach((imageGroup, groupIndex) => {
      const imageIndexArray = getCanSpreadImageGroupIndexArray(
        imageGroup, innerPageRatio
      );
      if (imageIndexArray.size) {
        const splittedImageGroupArray = getSpreadSplittedImageGroupArray(
          imageGroup, imageIndexArray
        );

        outImageGroupArray = outImageGroupArray.concat(splittedImageGroupArray);
      } else {
        outImageGroupArray = outImageGroupArray.push(imageGroup);
      }
    });
  }

  return outImageGroupArray;
}


/**
 * 获取每页可能是多张图片的分组数据
 *
 * @param {any} parameters
 * @param {any} innerPageRatio
 */
function getMultipleImagesPerSheetData(parameters, innerPageRatio) {
  const undatedData = getUndatedData(parameters);
  const datedData = getDatedData(parameters);

  const undatedSpreadData = getSpreadData(undatedData, innerPageRatio);
  const datedSpreadData = getSpreadData(datedData, innerPageRatio);

  return datedSpreadData.concat(undatedSpreadData);
}


/**
 * 获取封面的填充数据
 *
 * @param {any} imageArray
 * @returns
 */
function getCoverData(imageArray) {
  const maxResolutionImage = imageArray.maxBy((image) => {
    return image.get('width') * image.get('height');
  });

  return Immutable.fromJS([[maxResolutionImage]]);
}


/**
 * 获取自动填充的分组数据
 *
 * @export
 * @param {any} isPressBook     是否为pressbook
 * @param {any} minSheetNumber  最小sheet数量
 * @param {any} maxSheetNumber  最大sheet数量
 * @param {any} imageArray      图片的数据集
 * @param {any} innerPageRatio  内页的宽高比
 */
export function getAutoFillData(
  isPressBook,
  minSheetNumber,
  maxSheetNumber,
  imageArray,
  innerPageRatio) {
  if (isPressBook) {
    defaultMaxImagesPerSheet = 7;
  }

  const parameters = prepareParameter(
    minSheetNumber, maxSheetNumber, imageArray
  );

  let innerPageData = null;

  if (parameters.averageDensity === 1) {
    innerPageData = getSingleImagePerSheetData(parameters);
  } else {
    innerPageData = getMultipleImagesPerSheetData(parameters, innerPageRatio);
  }

  return getCoverData(imageArray).concat(innerPageData);
}
