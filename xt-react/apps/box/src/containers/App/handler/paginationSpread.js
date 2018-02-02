import { merge, get } from 'lodash';
import {
  checkIsSetCoverAsInnerBg,
  checkIsSupportImageInCover,
  checkIsSupportPaintedTextInCover
} from '../../../utils/cover';
import { pageTypes, elementTypes } from '../../../contants/strings';


export const checkIsEnablePage = () => {
  let enabled = true;

  return enabled;
};

export const getCoverImageEncId = (coverSpread, elementArray) => {
  const containers = get(coverSpread, 'containers');
  const fullPage = Array.isArray(containers) && containers.find(page => get(page, 'type') === pageTypes.full);
  if (fullPage) {
    const pageElementIds = get(fullPage, 'elements');
    if (!pageElementIds.length) {
      return '';
    }
    const coverPhotoElement = elementArray.find(ele => (pageElementIds.indexOf(ele.id) !== -1 && ele.type === 'PhotoElement'));
    return coverPhotoElement ? coverPhotoElement.encImgId : '';
  }
};

export const convertCoverSummaryPages = (coverSpread, setting) => {
  let pages = [];
  let summary = {};

  const bleed = get(coverSpread, 'bleed');
  const height = get(coverSpread, 'height');
  const width = get(coverSpread, 'width');
  const backgroundSize = get(coverSpread, 'backgroundSize');
  const bgImageUrl = get(coverSpread, 'bgImageUrl');
  const effectImageUrl = get(coverSpread, 'effectImageUrl');
  const containers = get(coverSpread, 'containers');
  const productType = get(setting, 'product');
  const coverType = get(setting, 'cover');

  merge(summary, {
    bgImageUrl,
    effectImageUrl,
    bleed,
    height,
    width,
    cameo: get(setting, 'cameo'),
    cameoShape: get(setting, 'cameoShape')
  });

  // 封面都不允许拖动来调整位置.
  const draggable = {
    isPageDraggable: false,
    isPageDropable: false
  };

  if (containers) {
    // 是否包含full类型的page.
    const fullPage = containers.find(page => get(page, 'type') === pageTypes.full);
    const frontPage = containers.find(page => get(page, 'type') === pageTypes.front);
    const backPage = containers.find(page => get(page, 'type') === pageTypes.back);
    const spinePage = containers.find(page => get(page, 'type') === pageTypes.spine);

    // 如果包含full page, 就设置full page的offset的left为0, 即基于原点定位.
    if (fullPage) {
      pages.push(merge({}, fullPage, draggable, {
        width: get(fullPage, 'width'), // - (fullPage.getIn(['bleed', 'left']) + fullPage.getIn(['bleed', 'right'])),
        height: get(fullPage, 'height'), // - (fullPage.getIn(['bleed', 'top']) + fullPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
        enabled: true
      }));
    }

    // 如果包含backPage, 就设置backPage的offset的left为0.
    if (backPage) {
      pages.push(merge({}, backPage, draggable, {
        width: get(backPage, 'width'), // - (backPage.getIn(['bleed', 'left']) + backPage.getIn(['bleed', 'right'])),
        height: get(backPage, 'height'), // - (backPage.getIn(['bleed', 'top']) + backPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
        enabled: false
      }));
    }

    // spinePage, 就设置spinePage的offset的left为:左半页.
    if (spinePage) {
      pages.push(merge({}, spinePage, draggable, {
        width: get(spinePage, 'width'), // - (spinePage.getIn(['bleed', 'left']) + spinePage.getIn(['bleed', 'right'])),
        height: get(spinePage, 'height'), // - (spinePage.getIn(['bleed', 'top']) + spinePage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
        enabled: false
      }));
    }

    // 如果包含frontPage, 就设置frontPage的offset的left为:左半页+书脊宽.
    if (frontPage) {
      pages.push(merge({}, frontPage, draggable, {
        width: get(frontPage, 'width'), // - (frontPage.getIn(['bleed', 'left']) + frontPage.getIn(['bleed', 'right'])),
        height: get(frontPage, 'height'), // - (frontPage.getIn(['bleed', 'top']) + frontPage.getIn(['bleed', 'bottom'])),
        offset: {
          top: 0,
          left: 0
        },
        enabled: false
      }));
    }
  }

  return { summary, pages, backgroundSize };
};

export const convertSheetPages = (pageArray) => {
  const newPages = [];
  pageArray.forEach(p => newPages.push(merge({}, p, {
    width: get(p, 'width'),
    height: get(p, 'height'),
    offset: {
      top: 0,
      left: 0
    },
    enabled: get(p, 'type') === pageTypes.usb ? false : true,
    isPageDraggable: false,
    isPageDropable: false
  })));
  return newPages;
};

export const getPaginationSpread = (params) => {
  const {
    setting,
    cover,
    pageArray,
    elementArray,
    imageArray,
    pagination,
    inner
  } = params;

  const productType = setting.product;
  const coverType = setting.cover;

  let summary = {
    isCover: true,
    pageId: '',
    isSupportImageInCover: checkIsSupportImageInCover(coverType),
    isSetCoverAsInnerBg: checkIsSetCoverAsInnerBg(coverType),
    isSupportPaintedText: checkIsSupportPaintedTextInCover(coverType),
    sheetIndex: pagination.sheetIndex
  };

  let pageIds = [];
  let pages = [];
  let elements = {};
  let images = {};
  let backgroundSize = {};
  const sheetIndex = pagination.sheetIndex;

  if (sheetIndex === 0) {
    if (cover) {
      const coverSummaryPages = convertCoverSummaryPages(cover, setting, pagination);
      merge(summary, coverSummaryPages.summary);
      merge(pages, coverSummaryPages.pages);
      merge(backgroundSize, coverSummaryPages.backgroundSize);
      pages.forEach(p => pageIds.push(get(p, 'id')));
    }
  } else {
    summary.isCover = false;
    merge(backgroundSize, inner.backgroundSize);
    summary.effectImageUrl = inner.effectImageUrl;
    summary.bgImageUrl = cover.bgImageUrl;
    pages = convertSheetPages(pageArray);
    pages.forEach(p => pageIds.push(get(p, 'id')));
    if (summary.isSetCoverAsInnerBg) {
      summary.innerPageBackImageEncImgID = getCoverImageEncId(cover, elementArray);
    }
  }

  // 查找当前pages使用的所有elements
  if (pages.length) {
    pages.forEach((page) => {
      const elementIds = get(page, 'elements');
      elementIds.forEach((id) => {
        const element = elementArray.find(ele => get(ele, 'id') === id);
        if (element) {
          elements[id] = element;
        }
      });
    });
  }

  // 更改当前活动的page id
  if (pages.length > pagination.pageIndex) {
    summary.pageId = pages[pagination.pageIndex].id;
  }

  // 如果是封面, 判断是否有cameo 元素
  if (summary.isCover) {
    let hasCameoElement = false;
    let hasPaintedTextElement = false;
    let key;
    for (key in elements) {
      if (get(elements[key], 'type') === elementTypes.cameo) {
        hasCameoElement = true;
      } else if (get(elements[key], 'type') === elementTypes.paintedText) {
        hasPaintedTextElement = true;
      }
    }

    summary.hasCameoElement = hasCameoElement;
    summary.hasPaintedTextElement = hasPaintedTextElement;
  }

  // 获取当前page下的所有的image.
  if (imageArray && imageArray.length) {
    let key;
    for (key in elements) {
      const encImgId = get(elements[key], 'encImgId');
      if (encImgId) {
        const newImage = imageArray.find(image => get(image, 'encImgId') === encImgId);
        if (newImage) {
          images[newImage.encImgId] = newImage;
        }
      }
    }
  }

  const obj = {
    summary,
    pages,
    elements,
    images,
    pageIds,
    backgroundSize
  };

  return obj;
};

export const getPageSpread = (params) => {
  const {
    setting,
    cover,
    pageArray,
    elementArray,
    imageArray,
    pagination,
    sheetIndex,
    inner
  } = params;

  const productType = setting.product;
  const coverType = setting.cover;

  let summary = {
    isCover: true,
    pageId: '',
    isSupportImageInCover: checkIsSupportImageInCover(coverType),
    isSetCoverAsInnerBg: checkIsSetCoverAsInnerBg(coverType),
    isSupportPaintedText: checkIsSupportPaintedTextInCover(coverType),
    sheetIndex
  };

  let pageIds = [];
  let pages = [];
  let elements = {};
  let images = {};
  let backgroundSize = {};

  if (sheetIndex === 0) {
    if (cover) {
      const coverSummaryPages = convertCoverSummaryPages(cover, setting);
      merge(summary, coverSummaryPages.summary);
      merge(pages, coverSummaryPages.pages);
      merge(backgroundSize, coverSummaryPages.backgroundSize);
      pages.forEach(p => pageIds.push(get(p, 'id')));
    }
  } else {
    summary.isCover = false;
    merge(backgroundSize, inner.backgroundSize);
    summary.effectImageUrl = inner.effectImageUrl;
    summary.bgImageUrl = cover.bgImageUrl;
    pages = convertSheetPages(pageArray);
    pages.forEach(p => pageIds.push(get(p, 'id')));
    if (summary.isSetCoverAsInnerBg) {
      summary.innerPageBackImageEncImgID = getCoverImageEncId(cover, elementArray);
    }
  }

  // 查找当前pages使用的所有elements
  if (pages.length) {
    pages.forEach((page) => {
      const elementIds = get(page, 'elements');
      elementIds.forEach((id) => {
        const element = elementArray.find(ele => get(ele, 'id') === id);
        if (element) {
          elements[id] = element;
        }
      });
    });
  }

  // 更改当前活动的page id
  if (pages.length > pagination.pageIndex) {
    summary.pageId = pages[pagination.pageIndex].id;
  }

  // 如果是封面, 判断是否有cameo 元素
  if (summary.isCover) {
    let hasCameoElement = false;
    let hasPaintedTextElement = false;
    let key;
    for (key in elements) {
      if (get(elements[key], 'type') === elementTypes.cameo) {
        hasCameoElement = true;
      } else if (get(elements[key], 'type') === elementTypes.paintedText) {
        hasPaintedTextElement = true;
      }
    }

    summary.hasCameoElement = hasCameoElement;
    summary.hasPaintedTextElement = hasPaintedTextElement;
  }

  // 获取当前page下的所有的image.
  if (imageArray && imageArray.length) {
    let key;
    for (key in elements) {
      const encImgId = get(elements[key], 'encImgId');
      if (encImgId) {
        const newImage = imageArray.find(image => get(image, 'encImgId') === encImgId);
        if (newImage) {
          images[newImage.encImgId] = newImage;
        }
      }
    }
  }

  const obj = {
    summary,
    pages,
    elements,
    images,
    pageIds,
    backgroundSize
  };

  return obj;
};
