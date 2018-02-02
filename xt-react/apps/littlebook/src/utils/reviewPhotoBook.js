import { pageTypes, elementTypes } from '../contants/strings';

/**
 * { reviewPhotoBook } 对整本书进行检测，将检测结果以一个对象返回出去
 *
 * @param      { object }  project  当前的 project 对象
 * @return     { object }  { 检测结果的描述对象 }
 */
export const reviewPhotoBook = (project) => {
  let pageTotal = 0;
  let usageImagesCount = 0;
  let emptyPageCount = pageTotal;

  // 检查内页的所有sheet所使用的照片数.
  const pages = project.get('pageArray');
  const elementArrays = project.get('elementArray');
  if (pages && pages.size) {
    const sheetPages = pages.filter(p => p.get('type') === pageTypes.sheet);

    // ASH-4826: 【LBB2.0】创建LBB上传24张图片，cover上应用图片，点击order，弹出框中信息有误，显示-1.
    // 查找出内页有图片的photoelement的个数.
    sheetPages.forEach((page) => {
      const elementIds = page.get('elements');
      if (elementIds && elementIds.size) {
        elementIds.forEach((id) => {
          const photoElement = elementArrays.find((ele) => {
            return ele.get('id') === id &&
                ele.get('encImgId') &&
                (ele.get('type') === elementTypes.photo);
          });

          if (photoElement) {
            usageImagesCount += 1;
          }
        });
      }
    });

    pageTotal = sheetPages.size * 2;
    emptyPageCount = pageTotal - usageImagesCount;
  }

  return {
    usageImagesCount,
    emptyPageCount
  };
};
