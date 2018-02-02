import shapeUrl_Round from '../sources/assets/image/shape/round.svg';
import shapeUrl_Round_disabled from '../sources/assets/image/shape/round-disable.svg';
import shapeUrl_Round_unselect from '../sources/assets/image/shape/round-unselect.svg';
import shapeUrl_Square from '../sources/assets/image/shape/square.svg';
import shapeUrl_Square_unselect from '../sources/assets/image/shape/square-unselect.svg';

export const wallartsConfigList = [
  { product: 'contemporary', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' },  { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'matteStyle', title: 'Matting', showHr: 'true' }, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'glassStyle', title: 'Glass' }] },
  { product: 'classicFrame', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'matteStyle', title: 'Matting', showHr: 'true' }, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'glassStyle', title: 'Glass' }] },
  { product: 'rusticFrame', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'product', title: 'Type', showHr: 'true' }, { type: 'frameStyle', title: 'Style', showHr: 'true' }, { type: 'matteStyle', title: 'Matting', showHr: 'true' }, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'glassStyle', title: 'Glass' }] },
  { product: 'metal', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' },  { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'matteStyle', title: 'Matting', showHr: 'true' }, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'glassStyle', title: 'Glass' }] },
  { product: 'canvas', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'canvasBorderSize', title: 'Frame Thickness', showHr: 'true' }, { type: 'size', title: 'Size' }, { type: 'canvasBorder', title: 'Border'}] },
  { product: 'frameCanvas', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'size', title: 'Size', showHr: 'true' }] },
  { product: 'flushMountCanvas', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'product', title: 'Type', showHr: 'true' }, { type: 'frameStyle', title: 'Style', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'mountPrint', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'paper', title: 'Paper', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'size', title: 'Size' }] },
  { product: 'metalPrint', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'metalType', title: 'Print Surface', showHr: 'true' }, { type: 'finish', title: 'Finish', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'woodPrint', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'finish', title: 'Print Options', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'acrylicPrint', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' }, { type: 'paper', title: 'Paper', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'size', title: 'Size' }] },
  { product: 'table_crystalPlaque', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_metalPlaque', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'metalType', title: 'Print Surface', showHr: 'true' }, { type: 'finish', title: 'Finish', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_woodPlaque', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'finish', title: 'Print Options', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_metalCube', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_modernFrame', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_classicFrame', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'table_woodPlaque2', optionIds: [{ type: 'product', title: 'Type', showHr: 'true' }, { type: 'finish', title: 'Print Options', showHr: 'true' }, { type: 'size', title: 'Size' }] },
  { product: 'floatFrame', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' },  { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'metalType', title: 'Print Surface', showHr: 'true' }, { type: 'finish', title: 'Finish', showHr: 'true' }] },
  { product: 'floatFrame_metalFrame', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' },  { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'metalType', title: 'Print Surface', showHr: 'true' }, { type: 'finish', title: 'Finish', showHr: 'true' }] },
  { product: 'floatFrame_classicFrame', optionIds: [{ type: 'category', title: 'Product', showHr: 'true' },  { title: 'Style', mainKey: 'product', pertainKey: 'frameStyle', delimiter: '-', isGroup: true}, { type: 'size', title: 'Size', showHr: 'true' }, { type: 'paper', title: 'Print', showHr: 'true', paperAlt: ['Rich colors and fine texture', 'High-gloss metal sheen', 'High-contrast pop style'] }, { type: 'metalType', title: 'Print Surface', showHr: 'true' }, { type: 'finish', title: 'Finish', showHr: 'true' }] }
];
export const sideMenuConfigList = [
  { product: 'contemporary', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'classicFrame', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'rusticFrame', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'metal', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'canvas', optionIds: []},
  { product: 'frameCanvas', optionIds: [{ type: 'color', title: 'Color'}] },
  { product: 'flushMountCanvas', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'mountPrint', optionIds: [{ type: 'shape', title: 'Shape'}]},
  { product: 'metalPrint', optionIds: [{ type: 'shape', title: 'Shape'}]},
  { product: 'woodPrint', optionIds: [{ type: 'shape', title: 'Shape'}]},
  { product: 'acrylicPrint', optionIds: []},
  { product: 'table_crystalPlaque', optionIds: []},
  { product: 'table_metalPlaque', optionIds: []},
  { product: 'table_woodPlaque', optionIds: []},
  { product: 'table_woodPlaque2', optionIds: []},
  { product: 'table_metalCube', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'table_modernFrame', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'table_classicFrame', optionIds: [{ type: 'color', title: 'Color'}]},
  { product: 'floatFrame', optionIds: [{ type: 'color', title: 'Color'}, { type: 'shape', title: 'Shape'}]},
  { product: 'floatFrame_metalFrame', optionIds: [{ type: 'color', title: 'Color'}, { type: 'shape', title: 'Shape'}]},
  { product: 'floatFrame_classicFrame', optionIds: [{ type: 'color', title: 'Color'}, { type: 'shape', title: 'Shape'}]}
];

export const colorUrlMap = [
  { key: 'blackFM', url: '../../static/img/colors/Modernframe-Black.jpg' },
  { key: 'whiteFM', url: '../../static/img/colors/Modernframe-White.jpg' },
  { key: 'mapleFM', url: '../../static/img/colors/Modernframe-Maple.jpg' },
  { key: 'espressoFM', url: '../../static/img/colors/Modernframe-Espresso.jpg' },
  { key: 'metalBlack', url: '../../static/img/colors/Metal-Black.jpg' },
  { key: 'metalSilver', url: '../../static/img/colors/Metal-Sliver.jpg' },
  { key: 'metalGold', url: '../../static/img/colors/Metal-Gold.jpg' },
  { key: 'gold', url: '../../static/img/colors/Classic-Curve-Baroque.jpg' },
  { key: 'blackTT', url: '../../static/img/colors/Modernframe-Black.jpg' },
  { key: 'whiteTT', url: '../../static/img/colors/Modernframe-White.jpg' },
  { key: 'espressoTT', url: '../../static/img/colors/Modernframe-Espresso.jpg' },
  { key: 'mapleTT', url: '../../static/img/colors/Modernframe-Maple.jpg' },
  { key: 'blackCV', url: '../../static/img/colors/Modernframe-Black.jpg' },
  { key: 'whiteCV', url: '../../static/img/colors/Modernframe-White.jpg' },
  { key: 'mapleCV', url: '../../static/img/colors/Modernframe-Maple.jpg' },
  { key: 'espressoCV', url: '../../static/img/colors/Modernframe-Espresso.jpg' },
  { key: 'greyFM', url: '../../static/img/colors/Ruatic-Grey.jpg' },
  { key: 'brownFM', url: '../../static/img/colors/Ruatic-Brown.jpg' },
  { key: 'blackCurve', url: '../../static/img/colors/Classic-Curve-Black.jpg' },
  { key: 'whiteCurve', url: '../../static/img/colors/Classic-Curve-White.jpg' },
  { key: 'espressoCurve', url: '../../static/img/colors/Classic-Curve-Espresso.jpg' },
  { key: 'mapleCurve', url: '../../static/img/colors/Classic-Curve-Maple.jpg' }
];

export const shapeUrlMap = [
  { key: 'Rect', title: 'Square', url: shapeUrl_Square, unselectUrl: shapeUrl_Square_unselect, disableUrl: shapeUrl_Square_unselect },
  { key: 'Round', title: 'Round', url: shapeUrl_Round, unselectUrl: shapeUrl_Round_unselect, disableUrl: shapeUrl_Round_disabled },
  { key: 'Square', title: 'Square', url: shapeUrl_Square, unselectUrl: shapeUrl_Square_unselect, disableUrl: shapeUrl_Square_unselect }
];
