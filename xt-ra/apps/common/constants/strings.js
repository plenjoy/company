// element类型.
export const elementTypes = {
  background: 'BackgroundElement',
  cameo: 'CameoElement',
  paintedText: 'PaintedTextElement',
  photo: 'PhotoElement',
  decoration: 'DecorationElement',
  text: 'TextElement',
  spine: 'SpineElement',
  sticker: 'StickerElement'
};

// 产品类型.
export const productTypes = {
  LF: 'LF',
  FM: 'FM',
  LB: 'LB',
  PS: 'PS'
};

// 定义封面类型.
export const coverTypes = {
  // Crystal
  CC: 'CC',
  GC: 'GC',

  // Leatherette
  LC: 'LC',
  GL: 'GL',
  LFLC: 'LFLC',
  LFGL: 'LFGL',
  PSLC: 'PSLC',

  // Bling Cover
  LFBC: 'LFBC',
  BC: 'BC',

  // hard cover
  HC: 'HC',
  LFHC: 'LFHC',
  PSHC: 'PSHC',

  // linen cover
  NC: 'NC',
  LFNC: 'LFNC',
  PSNC: 'PSNC',

  // metal cover
  MC: 'MC',
  GM: 'GM',

  // Soft Cover
  // 软壳现在使用两个名称：FMA和Layflat中为Paper Cover，Press Book中为Soft Cover
  PSSC: 'PSSC',

  // Paper Cover
  // 软壳现在使用两个名称：FMA和Layflat中为Paper Cover，Press Book中为Soft Cover
  FMPAC: 'FMPAC',
  LFPAC: 'LFPAC',

  // Black Cover
  // 已经禁用了.
  LBB: 'LBB',
  LLB: 'LLB',
  LSB: 'LSB',

  // Photo Cover
  // 已经禁用, 但为了兼容老数据..
  LBPC: 'LBPC',

  // padded cover
  LFPC: 'LFPC'
};

// painted text的类型.
export const paintedTextTypes = {
  front: 'Front',
  back: 'Back',
  spine: 'Spine',
  none: 'None'
};
