
const sortTypes = {
  // 上传时间
  uploadTime: 'uploadTime',

  // 拍摄时间.
  shotTime: 'shotTime'
};

/**
 * 对图片数组按拍摄时间从(oldest -> newest)， 如果没有拍摄时间就按照上传时间从(oldest -> newest)
 * @param  {Array} images  普通数据类型的图片列表数组
 * @param  {Array} groups 普通数据类型的number数组, 比如: [3,2,5...], 表示第一组要3张图片, 第二组要2张, 第三组为5张.
 * @return {[type]}           [description]
 */
export const getAutoFillDataByGroups = (images, groups) => {
  if (!images || !images.length) {
    return [];
  }

  const imagesWithShotTime = images.filter(img => img[sortTypes.shotTime]) || [];
  const imagesWithoutShotTime = images.filter(img => !img[sortTypes.shotTime]) || [];

  // 按照照片的Create Date从前往后（如无Create Date则按Upload Time）.
  const sortedImagesWithShotTime = imagesWithShotTime.sort((a, b) => a[sortTypes.shotTime] - b[sortTypes.shotTime]);
  const sortedImagesWithoutShotTime = imagesWithoutShotTime.sort((a, b) => a[sortTypes.uploadTime] - b[sortTypes.uploadTime]);
  const sortedImages = sortedImagesWithShotTime.concat(sortedImagesWithoutShotTime);

  const results = [];

  if (groups) {
    groups.forEach((num) => {
      const groupedImages = [];

      for (let i = 0; i < num; i++) {
        const img = sortedImages.shift();

        if (img) {
          groupedImages.push(img);
        }
      }

      if (groupedImages.length) {
        results.push(groupedImages);
      }
    });
  }

  return results;
};

/**
 * 返回包含或不包含指定key的图片数组
 * @param  {Array}  images    待过滤的数组
 * @param  {strings}  key     对象的key, 通过该key的值来过滤数组
 * @param  {Boolean} isIncluded 定义包含或不包含指定key
 * @return {Array}             过滤好的图片数组.
 */
export const filterImagesBy = (images, key = 'shotTime', isIncluded = true) => {
  if (!images || !images.length) {
    return [];
  }

  let results = [];

  if(isIncluded){
    results = images.filter(img => img[key]) || [];
    results = results.sort((a, b) => a[key] - b[key]);
  } else {
    results = images.filter(img => !img[key]) || [];
  }

  return results;
};
