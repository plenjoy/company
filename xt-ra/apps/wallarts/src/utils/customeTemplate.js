
export const templateTypes = {
  full: 'full',
  square: 'square',
  portrait: 'portrait'
};

export const customeTemplateIds = {
  full: 'template-full-01',
  square: 'template-square-01',
  portrait: 'template-portrait-01'
};

export const generateTemplateInfo = (pageWidth, pageHeight, templateId = templateTypes.full, isLeft = true) => {
  let px = 0;
  const py = 0;
  let pw = 0.5;
  const ph = 1;
  const id = templateId;
  const halfPageWidth = pageWidth / 2;

  let width;
  let x;

  switch (templateId) {
    case customeTemplateIds.full: {
      px = isLeft ? 0 : 0.5;
      break;
    }
    case customeTemplateIds.square: {
      width = pageHeight;
      x = isLeft ? (halfPageWidth - width) / 2 : ((halfPageWidth - width) / 2 + halfPageWidth);
      px = x / pageWidth;
      pw = width / pageWidth;
      break;
    }
    case customeTemplateIds.portrait: {
      // 横竖比为: 2/3
      width = pageHeight * 2 / 3;
      x = isLeft ? (halfPageWidth - width) / 2 : ((halfPageWidth - width) / 2 + halfPageWidth);
      px = x / pageWidth;
      pw = width / pageWidth;
      break;
    }
    default: {
      break;
    }
  }

  return {
    id,
    px,
    py,
    pw,
    ph
  };
};

export const getTemplateIdOnCreate = (userId, imageSize) => {
  const imageWidth = parseInt(imageSize.width);
  const imageHeight = parseInt(imageSize.height);

  // AB测试
  // userId为单数的情况
  if (imageWidth > imageHeight) {
    return customeTemplateIds.full;
  } else if (imageWidth < imageHeight) {
    return customeTemplateIds.portrait;
  }
  return customeTemplateIds.square;
};


export const getSwitchedTemplateId = (userId, templateId, imageSize) => {
  const imageWidth = parseInt(imageSize.width);
  const imageHeight = parseInt(imageSize.height);
  if (imageWidth > imageHeight) {
    return toggleTemplateId(templateId, [customeTemplateIds.full, customeTemplateIds.square]);
  } else if (imageWidth < imageHeight) {
    return toggleTemplateId(templateId, [customeTemplateIds.full, customeTemplateIds.portrait]);
  }
  return toggleTemplateId(templateId, [customeTemplateIds.full, customeTemplateIds.square]);
};

export const checkElementTemplateType = (templateId) => {
  const strs = templateId ? templateId.split('-') : null;
  const tType = strs ? strs[1] : templateTypes.full;

  return templateTypes[tType];
};

const toggleTemplateId = (templateId, toggleIds) => {
  const index = toggleIds.indexOf(templateId);
  return toggleIds[toggleIds.length - 1 - index];
};
