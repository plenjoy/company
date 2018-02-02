
export const effectPaddings = {
  softCover: {
    '5X7': {
      top: 6,
      right: 6,
      bottom: 6,
      left: 6
    },
    '6X6': {
      top: 8,
      right: 7,
      bottom: 8,
      left: 7
    },
    '8X8': {
      top: 7,
      right: 5,
      bottom: 7,
      left: 7
    }
  },
  hardCover: {
    '5X7': {
      top: 6,
      right: 6,
      bottom: 6,
      left: 6
    },
    '6X6': {
      top: 9,
      right: 7,
      bottom: 8,
      left: 9
    },
    '8X8': {
      top: 7,
      right: 6,
      bottom: 9,
      left: 8
    }
  }
};

export const sheetSizeOptions = {
  softCover: {
    '5X7': {
      // 渲染区域的大小, 不包括出血.但包括压线.
      width: 229,
      height: 160,
      bleed: {
        top: 5,
        right: 2.5,
        bottom: 5,
        left: 2.5
      },
      spineExpanding: 17
    },
    '6X6': {
      width: 179,
      height: 175,
      bleed: {
        top: 5.5,
        right: 5.5,
        bottom: 5.5,
        left: 5.5
      },
      spineExpanding: 16
    },
    '8X8': {
      width: 213,
      height: 205,
      bleed: {
        top: 6.5,
        right: 6.5,
        bottom: 6.5,
        left: 6.5
      },
      spineExpanding: 14
    }
  },
  hardCover: {
    '5X7': {
      width: 242,
      height: 173,
      bleed: {
        top: 23.5,
        right: 23.5,
        bottom: 23.5,
        left: 23.5
      },
      spineExpanding: 26
    },
    '6X6': {
      width: 189,
      height: 184,
      bleed: {
        top: 22.8,
        right: 22.8,
        bottom: 22.8,
        left: 22.8
      },
      spineExpanding: 24
    },
    '8X8': {
      width: 224,
      height: 218,
      bleed: {
        top: 20.5,
        right: 20.5,
        bottom: 20.5,
        left: 20.5
      },
      spineExpanding: 21.5
    }
  }
};
