export function getSpineWidth(spineWidth, addedSheetNumber = 0) {
  return spineWidth.baseValue + spineWidth.addtionalValue * addedSheetNumber;
}

export function getCoverSheetSize(
  bookCoverBaseSize,
  coverPageBleed,
  coverExpandingSize,
  spineWidth,
  addedSheetNumber = 0
) {
  const coverPageBleedWidth = coverPageBleed.left + coverPageBleed.right;
  const coverExpandingWidth =
    coverExpandingSize.left + coverExpandingSize.right;
  const totalSpineWidth = getSpineWidth(spineWidth, addedSheetNumber);

  const coverPageBleedHeight = coverPageBleed.top + coverPageBleed.bottom;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  // spread的宽高.
  const width = Math.round(
    bookCoverBaseSize.width * 2 +
      coverPageBleedWidth +
      coverExpandingWidth +
      totalSpineWidth
  );
  const height = Math.round(
    bookCoverBaseSize.height + coverPageBleedHeight + coverExpandingHeight
  );

  return {
    width,
    height
  };
}

export function getInnerSheetSize(bookInnerBaseSize, innerPageBleed) {
  const innerPageBleedWidth = innerPageBleed.left + innerPageBleed.right;
  const innerPageBleedHeight = innerPageBleed.top + innerPageBleed.bottom;

  return {
    width: Math.round(bookInnerBaseSize.width * 2 + innerPageBleedWidth),
    height: Math.round(bookInnerBaseSize.height + innerPageBleedHeight)
  };
}

export function getInnerPageSize(bookInnerBaseSize, innerPageBleed) {
  const innerPageBleedWidth = innerPageBleed.left + innerPageBleed.right;
  const innerPageBleedHeight = innerPageBleed.top + innerPageBleed.bottom;

  return {
    width: Math.round(bookInnerBaseSize.width + innerPageBleedWidth),
    height: Math.round(bookInnerBaseSize.height + innerPageBleedHeight)
  };
}

export function getFrontCoverSize(
  bookCoverBaseSize,
  coverPageBleed,
  coverExpandingSize
) {
  const coverPageBleedWidth = coverPageBleed.left + coverPageBleed.right;
  const coverPageBleedHeight = coverPageBleed.top + coverPageBleed.bottom;
  const coverExpandingHeight =
    coverExpandingSize.top + coverExpandingSize.bottom;

  return {
    width:
      bookCoverBaseSize.width + coverPageBleedWidth + coverExpandingSize.right,
    height:
      bookCoverBaseSize.height + coverPageBleedHeight + coverExpandingHeight
  };
}
