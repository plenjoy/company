import { templateGroupTypes } from '../../constants/strings';
import { getRandomInt } from '../../../../common/utils/math';

export function getDefaultRandomTemplateId(templates) {
  const defaultTemplates = templates.filter(t => t.isDefault);
  const randomIndex = getRandomInt(0, defaultTemplates.length - 1);

  return defaultTemplates[randomIndex].guid;
}

function countImageShape(images) {
  let countLandscape = 0;
  let countPortrait = 0;
  let countSquare = 0;

  images.forEach((image) => {
    if (image.width > image.height) {
      countLandscape += 1;
    } else if (image.height > image.width) {
      countPortrait += 1;
    } else {
      countSquare += 1;
    }
  });

  const countTotal = countLandscape + countPortrait + countSquare;

  return {
    countTotal,
    countLandscape,
    countPortrait,
    countSquare
  };
}

function getTemplateByMatchedNumber(templates, images) {
  const {
    countTotal,
    countLandscape,
    countPortrait,
    countSquare
  } = countImageShape(images);

  const fullMatchTemplates = templates.filter((t) => {
    return (
      t.imageNum === countTotal &&
      t.horizontalNum === countLandscape &&
      t.verticalNum === countPortrait &&
      t.squareNum === countSquare
    );
  });

  let resultTemplates = fullMatchTemplates;

  if (!fullMatchTemplates.length) {
    const sameShapeTemplates = templates.filter((t) => {
      return t.horizontalNum === 2 || t.verticalNum === 2 || t.squareNum === 2;
    });

    resultTemplates = sameShapeTemplates;

    if (!sameShapeTemplates.length) {
      const imageNumEqualTemplates = templates.filter((t) => {
        return t.imageNum === countTotal;
      });

      resultTemplates = imageNumEqualTemplates;

      if (imageNumEqualTemplates.length) {
        const coverDefaultTemplates = imageNumEqualTemplates.filter((t) => {
          return t.isCoverDefault;
        });

        resultTemplates = coverDefaultTemplates.length
          ? coverDefaultTemplates
          : imageNumEqualTemplates;
      }
    }
  }

  if (resultTemplates.length) {
    return resultTemplates[getRandomInt(0, resultTemplates.length - 1)].guid;
  }

  return null;
}

export function getImageShapeString(image) {
  const SHAPE_LANDSCAPE = 'L';
  const SHAPE_PORTRAIT = 'P';
  const SHAPE_SQUARE = 'S';

  const aspectRatio = image.width / image.height;
  const MAX_OVERFLOW = 0.04;

  if (Math.abs(1 - aspectRatio) <= MAX_OVERFLOW) {
    return SHAPE_SQUARE;
  } else if (aspectRatio > 1 + MAX_OVERFLOW) {
    return SHAPE_LANDSCAPE;
  }

  return SHAPE_PORTRAIT;
}

export function getTemplateGroupString(images) {
  let leftPageChar = '';
  let rightPageChar = '';

  const leftPageImage = images[0];
  const rightPageImage = images[1];

  if (leftPageImage) {
    leftPageChar = getImageShapeString(leftPageImage);
    rightPageChar = leftPageChar;
  }

  if (rightPageImage) {
    rightPageChar = getImageShapeString(rightPageImage);
    if (!leftPageChar) {
      leftPageChar = rightPageChar;
    }
  }

  return leftPageChar + rightPageChar;
}

export function getTemplateIdByImageShape(
  allTemplatesList,
  images,
  productSize
) {
  let templateId = null;

  if (productSize === '5X7') {
    const templates = allTemplatesList[templateGroupTypes.GROUP_5X7];
    templateId = getTemplateByMatchedNumber(templates, images);
  } else {
    const templateGorupString = getTemplateGroupString(images);
    const templateGroupType = templateGroupTypes[templateGorupString];

    const templates = allTemplatesList[templateGroupType];
    const sortedTemplates = templates.sort((a, b) => {
      return a.ordering - b.ordering;
    });

    templateId = getDefaultRandomTemplateId(sortedTemplates);
  }

  return templateId;
}
