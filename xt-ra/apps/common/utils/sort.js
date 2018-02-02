import moment from 'moment';

/**
 * 给图片按照拍摄时间排序.
 * @param  {Array}  images 待排序的图片数组.
 * @param  {Boolean} asc   用于升序还是降序, 默认升序
 * @return {Array}         排好序的图片数组.
 */
const sortImagesByShotTime = (images, asc = false) => {
  if (!images && !images.length) {
    return [];
  }

  // 获取所有包含拍摄时间的照片.
  let imagesWithShotTime = images.filter(m => m.shotTime);

  // 获取所有不包含拍摄时间的照片.
  let imagesWithoutShotTime = images.filter(m => !m.shotTime);

  // 如果拍摄时间相同，则按照片上传完成的先后时间顺序排序
  imagesWithShotTime = imagesWithShotTime.sort((a, b) => {
    // 升序
    let value = a.shotTime - b.shotTime;

    // 降序
    if (!asc) {
      value = b.shotTime - a.shotTime;
    }

    // 如果拍摄时间相同，则按照片上传完成的先后时间顺序排序
    if (!value) {
      value = b.uploadTime - a.uploadTime;
    }

    return value;
  });

  // 如果拍摄时间相同，则按照片上传完成的先后时间顺序排序
  imagesWithoutShotTime = imagesWithoutShotTime.sort((a, b) => {
    return b.uploadTime - a.uploadTime;
  });

  return imagesWithShotTime.concat(imagesWithoutShotTime);
};

/**
 * 给图片按照上传时间排序.
 * @param  {Array}  images 待排序的图片数组.
 * @param  {Boolean} asc   用于升序还是降序, 默认升序
 * @return {Array}         排好序的图片数组.
 */
const sortImagesByUploadTime = (images, asc = false) => {
  if (!images && !images.length) {
    return [];
  }

  // 获取所有包含拍摄时间的照片.
  let imagesWithShotTime = images.filter(m => m.shotTime);

  // 获取所有不包含拍摄时间的照片.
  let imagesWithoutShotTime = images.filter(m => !m.shotTime);

  imagesWithShotTime = imagesWithShotTime.sort((a, b) => {
    // 升序
    if (asc) {
      return a.uploadTime - b.uploadTime;
    }

    // 降序
    return b.uploadTime - a.uploadTime;
  });

  imagesWithoutShotTime = imagesWithoutShotTime.sort((a, b) => {
    // 升序
    if (asc) {
      return a.uploadTime - b.uploadTime;
    }

    // 降序
    return b.uploadTime - a.uploadTime;
  });

  return imagesWithShotTime.concat(imagesWithoutShotTime);
};

/**
 * 给图片按照名称排序.
 * @param  {Array}  images 待排序的图片数组.
 * @param  {Boolean} asc   用于升序还是降序, 默认升序
 * @return {Array}         排好序的图片数组.
 */
const sortImagesByName = (images, asc = false) => {
  if (!images && !images.length) {
    return [];
  }

  // 获取所有包含拍摄时间的照片.
  let imagesWithShotTime = images.filter(m => m.shotTime);

  // 获取所有不包含拍摄时间的照片.
  let imagesWithoutShotTime = images.filter(m => !m.shotTime);

  imagesWithShotTime = imagesWithShotTime.sort((a, b) => {
    // 升序
    if (asc) {
      return (a.name).localeCompare(b.name);
    }

    // 降序
    return (b.name).localeCompare(a.name);
  });

  imagesWithoutShotTime = imagesWithoutShotTime.sort((a, b) => {
    // 升序
    if (asc) {
      return (a.name).localeCompare(b.name);
    }

    // 降序
    return (b.name).localeCompare(a.name);
  });

  return imagesWithShotTime.concat(imagesWithoutShotTime);
};

/**
 * 给图片排序.
 * @param  {Array}  images 待排序的图片数组.
 * @param  {string}  key   用于排序的图片属性值.
 * @param  {Boolean} asc   用于升序还是降序, 默认升序
 * @return {Array}         排好序的图片数组.
 */
export const onSortImages = (images, key, asc = false) => {
  switch (key) {
    case 'shotTime':
      {
        return sortImagesByShotTime(images, asc);
      }
    case 'uploadTime':
      {
        return sortImagesByUploadTime(images, asc);
      }
    case 'name':
      {
        return sortImagesByName(images, asc);
      }
    default:
      {
        return images;
      }
  }
};

export const onGroupImages = (images, key) => {
  switch (key) {
    case 'day':
      {
        return groupImagesByDay(images);
      }
    case 'week':
      {
        return groupImagesByWeek(images);
      }
    case 'month':
      {
        return groupImagesByMonth(images);
      }
    default:
      {
        return groupImagesByDay(images);
      }
  }
};


export const groupImagesByDay = (images) => {
  const groupImages = {};
  images.map((image) => {
    let key = 'Unknown Date';
    if (image.shotTime) {
      const m = moment(image.shotTime);
      key = m.format('MM/DD/YYYY');
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    } else {
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    }
  });
  return groupImages;
};


export const groupImagesByWeek = (images) => {
  const groupImages = {};
  const tmpArr = {};
  images.map((image) => {
    let key = 'Unknown Date';
    if (image.shotTime) {
      const m = moment(image.shotTime);
      const startM = moment(m.startOf('week'));
      const endM = moment(m.endOf('week'));
      key = `${startM.format('MM/DD/YYYY')} - ${endM.format('MM/DD/YYYY')}`;
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    } else {
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    }
  });
  return groupImages;
};


export const groupImagesByMonth = (images) => {
  const groupImages = {};
  images.map((image) => {
    let key = 'Unknown Date';
    if (image.shotTime) {
      const m = moment(image.shotTime);
      key = `${m.format('MMM. YYYY')}`;
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    } else {
      if (!groupImages[key]) {
        groupImages[key] = [];
      }
      groupImages[key].push(image);
    }
  });
  return groupImages;
};
