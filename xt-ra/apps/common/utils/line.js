/**
 * 获取外边框的线的坐标信息.
 */
export const getBorderLinesXY = (canvasW, canvasH, lineWidth, color, dashed, dashedGap = 5) => {
  const xys = [];

  if (!canvasW || !canvasH || !lineWidth) {
    return xys;
  }

  xys.push({
    x1: 0,
    y1: 0,
    x2: canvasW,
    y2: 0,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: canvasH,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: 1,
    y1: canvasH - lineWidth,
    x2: canvasW,
    y2: canvasH - lineWidth,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: canvasW - lineWidth,
    y1: 1,
    x2: canvasW - lineWidth,
    y2: canvasH - lineWidth,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  return xys;
};

/**
 * 获取出血线的坐标信息.
 */
export const getBleedLinesXY = (canvasW, canvasH, bleedLeft, bleedRight, bleedTop, bleedBottom, lineWidth, color, dashed, dashedGap = 5) => {
  const xys = [];

  if (!canvasW || !canvasH || !lineWidth) {
    return xys;
  }

  xys.push({
    x1: bleedLeft,
    y1: bleedTop,
    x2: canvasW - bleedRight,
    y2: bleedTop,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: bleedLeft,
    y1: bleedTop,
    x2: bleedLeft,
    y2: canvasH - bleedBottom,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: bleedLeft,
    y1: canvasH - bleedBottom,
    x2: canvasW - bleedRight,
    y2: canvasH - bleedBottom,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: canvasW - bleedRight,
    y1: bleedTop,
    x2: canvasW - bleedRight,
    y2: canvasH - bleedBottom,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  return xys;
};

/**
 * 获取包边的坐标信息.
 */
export const getWrapLinesXY = (canvasW, canvasH, wrapSize, lineWidth, color, dashed, dashedGap = 5) => {
  const xys = [];

  if (!canvasW || !canvasH || !lineWidth || !wrapSize) {
    return xys;
  }

  xys.push({
    x1: wrapSize,
    y1: wrapSize,
    x2: canvasW - wrapSize,
    y2: wrapSize,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: wrapSize,
    y1: wrapSize,
    x2: wrapSize,
    y2: canvasH - wrapSize,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: wrapSize,
    y1: canvasH - wrapSize,
    x2: canvasW - wrapSize,
    y2: canvasH - wrapSize,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: canvasW - wrapSize,
    y1: wrapSize,
    x2: canvasW - wrapSize,
    y2: canvasH - wrapSize,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  return xys;
};

/**
 * 获取书脊线的坐标信息.
 */
export const getSpineThicknessLinesXY = (canvasW, canvasH, spineThicknessWidth, lineWidth, color, dashed, dashedGap = 5) => {
  const xys = [];

  if (!canvasW || !canvasH || !lineWidth || !spineThicknessWidth) {
    return xys;
  }

  xys.push({
    x1: (canvasW - spineThicknessWidth) / 2,
    y1: 0,
    x2: (canvasW - spineThicknessWidth) / 2,
    y2: canvasH,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  xys.push({
    x1: ((canvasW - spineThicknessWidth) / 2) + spineThicknessWidth,
    y1: 0,
    x2: ((canvasW - spineThicknessWidth) / 2) + spineThicknessWidth,
    y2: canvasH,
    lineWidth,
    color,
    dashed,
    dashedGap
  });

  return xys;
};

export const getPreviewSpineThicknessLinesXY = (wrapSize,canvasW, canvasH, spineThicknessWidth, lineWidth, color, dashed) => {
  const xys = [];

  if (!canvasW || !canvasH || !lineWidth || !spineThicknessWidth) {
    return xys;
  }

  xys.push({
    x1: (canvasW - spineThicknessWidth) / 2,
    y1: wrapSize,
    x2: (canvasW - spineThicknessWidth) / 2,
    y2: canvasH-wrapSize,
    lineWidth,
    color,
    dashed
  });

  xys.push({
    x1: ((canvasW - spineThicknessWidth) / 2) + spineThicknessWidth,
    y1: wrapSize,
    x2: ((canvasW - spineThicknessWidth) / 2) + spineThicknessWidth,
    y2: canvasH-wrapSize,
    lineWidth,
    color,
    dashed
  });

  return xys;
};
