// 前封面素材图
import TLB_HC_FRONT_COVER_6X6 from './TLBHC/cover/front/6x6.png';
import TLB_SC_FRONT_COVER_6X6 from './TLBSC/cover/front/6x6.png';
import TLB_HC_FRONT_COVER_6X6_GRAY from './TLBHC/cover/frontGray/6x6.png';
import TLB_SC_FRONT_COVER_6X6_GRAY from './TLBSC/cover/frontGray/6x6.png';

// 封面素材图
import TLB_HC_FULL_COVER_6X6 from './TLBHC/cover/full/6x6.png';
import TLB_SC_FULL_COVER_6X6 from './TLBSC/cover/full/6x6.png';

// 内页素材图
import TLB_HC_INNER_6X6 from './TLBHC/inner/6x6.png';
import TLB_SC_INNER_6X6 from './TLBSC/inner/6x6.png';

export const TLBHC = {
  '6X6': {
    frontCover: {
      url: TLB_HC_FRONT_COVER_6X6,
      top: 12,
      right: 14,
      bottom: 25,
      left: 19,
      width: 279,
      height: 282,
      spineExpand: 22,
      imageWidth: 195,
      imageHeight: 195
    },
    frontCoverGray: {
      url: TLB_HC_FRONT_COVER_6X6_GRAY,
      top: 19,
      right: 24,
      bottom: 24,
      left: 24,
      width: 396,
      height: 392,
      spineExpand: 32,
      imageWidth: 260,
      imageHeight: 260
    },
    fullCover: {
      url: TLB_HC_FULL_COVER_6X6,
      top: 25,
      right: 25,
      bottom: 25,
      left: 25,
      width: 1724,
      height: 854
    },
    inner: {
      url: TLB_HC_INNER_6X6,
      top: 32,
      right: 41,
      bottom: 35,
      left: 35,
      width: 1673,
      height: 854
    }
  }
};

export const TLBSC = {
  '6X6': {
    frontCover: {
      url: TLB_SC_FRONT_COVER_6X6,
      top: 16,
      right: 13,
      bottom: 21,
      left: 23,
      width: 277,
      height: 282,
      spineExpand: 15,
      imageWidth: 200,
      imageHeight: 200
    },
    frontCoverGray: {
      url: TLB_SC_FRONT_COVER_6X6_GRAY,
      top: 25,
      right: 25,
      bottom: 25,
      left: 25,
      width: 404,
      height: 412,
      spineExpand: 23,
      imageWidth: 290,
      imageHeight: 315
    },
    fullCover: {
      url: TLB_SC_FULL_COVER_6X6,
      top: 26,
      right: 26,
      bottom: 61,
      left: 24,
      width: 1654,
      height: 844
    },
    inner: {
      url: TLB_SC_INNER_6X6,
      top: 25,
      right: 25,
      bottom: 61,
      left: 24,
      width: 1398,
      height: 759
    }
  }
};
