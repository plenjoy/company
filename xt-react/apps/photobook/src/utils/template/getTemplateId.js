import { getRandomInt } from '../../../../common/utils/math';

function countImageShape(pageElementsWithImage) {
  let countLandscape = 0;
  let countPortrait = 0;
  let countSquare = 0;

  pageElementsWithImage.forEach(element => {
    const { image } = element;
    let imageWidth = element.width;
    let imageHeight = element.height;

    if (image) {
      imageWidth = image.width;
      imageHeight = image.height;

      const imgRot = Math.abs(element.imgRot);

      // 旋转角度为90的奇数倍时，宽高进行交换
      const isSwitched = (imgRot / 90) % 2 === 1;
      if (isSwitched) {
        [imageHeight, imageWidth] = [imageWidth, imageHeight];
      }
    }

    if (imageWidth > imageHeight) {
      countLandscape += 1;
    } else if (imageHeight > imageWidth) {
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

function getTemplateByMatchedNumber(
  countTextFrame,
  templates,
  pageElementsWithImage
) {
  const {
    countTotal,
    countLandscape,
    countPortrait,
    countSquare
  } = countImageShape(pageElementsWithImage);

  const fullMatchTemplates = templates.filter(t => {
    return (
      t.imageNum === countTotal &&
      t.horizontalNum === countLandscape &&
      t.verticalNum === countPortrait &&
      t.squareNum === countSquare &&
      t.textFrameNum === countTextFrame
    );
  });

  let resultTemplates = fullMatchTemplates;

  if (!fullMatchTemplates.length) {
    const imageNumEqualTemplates = templates.filter(t => {
      return t.imageNum === countTotal && t.textFrameNum === countTextFrame;
    });

    resultTemplates = imageNumEqualTemplates;

    if (imageNumEqualTemplates.length) {
      const coverDefaultTemplates = imageNumEqualTemplates.filter(t => {
        return t.isCoverDefault;
      });

      resultTemplates = coverDefaultTemplates.length
        ? coverDefaultTemplates
        : imageNumEqualTemplates;
    }
  }

  if (resultTemplates.length) {
    return resultTemplates[getRandomInt(0, resultTemplates.length - 1)].guid;
  }

  return null;
}

function needSpreadTemplate(pageWidth, pageHeight, imageWidth, imageHeight) {
  const pageRatio = pageWidth / pageHeight;
  const imageRatio = imageWidth / imageHeight;

  const overflowWidthPercent = Math.abs(imageWidth - pageWidth) / pageWidth;
  const overflowHeightPercent = Math.abs(imageHeight - pageHeight) / pageHeight;

  if (
    Math.abs(pageRatio - imageRatio) <= 0.03 &&
    overflowWidthPercent <= 0.06 &&
    overflowHeightPercent <= 0.06
  ) {
    return true;
  }

  return false;
}

export function getTemplateId(
  pageWidth,
  pageHeight,
  countTextFrame,
  templates,
  pageElementsWithImage
) {
  const hasImageElement = pageElementsWithImage.filter(pageElement => {
    return pageElement.image;
  });

  if (hasImageElement.length === 1) {
    const firstImage = hasImageElement[0].image;
    const isNeedSpread = needSpreadTemplate(
      pageWidth,
      pageHeight,
      firstImage.width,
      firstImage.height
    );

    if (isNeedSpread) {
      const spreadTemplate = templates.find(o => {
        return o.imageNum === 1 && o.isFullCover;
      });

      if (spreadTemplate) {
        return spreadTemplate.guid;
      }
    } else {
      const notSpreadFullTemplates = templates.filter(o => !o.isFullCover);
      return getTemplateByMatchedNumber(
        countTextFrame,
        notSpreadFullTemplates,
        pageElementsWithImage
      );
    }
  }

  return getTemplateByMatchedNumber(
    countTextFrame,
    templates,
    pageElementsWithImage
  );
}
