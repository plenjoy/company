
const getParentBookSize = (mainSize) => {
  const size = mainSize ? mainSize.toLowerCase() : mainSize;

  switch (size) {
    case '8x8':
    case '10x10':
    case '12x12': {
      return '6x6';
    }
    case '8x11': {
      return '6x8.25';
    }
    case '11x14': {
      return '6x7.63';
    }
    case '12x16': {
      return '6x8';
    }
    case '11x8': {
      return '8.25x6';
    }
    case '14x11': {
      return '7.63x6';
    }
    case '16x12': {
      return '8x6';
    }
    default: {
      return mainSize;
    }
  }
};

/**
 * 根据主书的size, 返回映射后的parentbook的size.
 * @param  {string} mainSize eg: 8x8
 * @return {object} {size, paperThickness}
 */
export const mapParentBookSpec = (mainSize) => {
  return {
    size: getParentBookSize(mainSize),
    paperThickness: 'Standard',
    productFullName: 'Parent Book'
  };
};
