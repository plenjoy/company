import { fromJS } from 'immutable';
import { getBackgroundImageSize } from './backgroundSize';
import { convertToTwoDimenArr } from '../../../../common/utils/helper';
import { spineTextInfo } from '../../constants/strings';
import {
  getCoverLogoElementSize,
  getCoverPhotoElementSize,
  getInnerPhotoElementSize,
  getCoverSpineTextElementSize,
  getTextElementSize,
  getImageTopTextSize,
  getCaptionTextSize
} from './elementSize';

const computedCoverPageOptions = (coverPage, coverWorkspace, currentSpec, currentMaterials, urls) => {
  let computed = fromJS({
    isCover: true
  });
  let elements = fromJS([]);

  const originalPhoto = coverPage.get('photo');

  // 获取spec中的可视区实际大小
  const coverPageSize = currentSpec.getIn(['parameters', 'coverPageSize']);
  const widthWithBleed = coverPageSize.get('width');
  const heightWithBleed = coverPageSize.get('height');
  const coverBleed = currentSpec.getIn(['parameters', 'coverPageBleed']);
  const spineWidth = currentSpec.getIn(['parameters', 'spineWidth', 'baseValue']);
  const spineExpanding = currentSpec.getIn(['parameters', 'spineExpanding']);
  const isHardCover = currentSpec.getIn(['spec', 'cover']) === 'TLBHC';

  // 计算带出血可视区实际大小
    const width = widthWithBleed - coverBleed.get('left') - coverBleed.get('right');
    const height = heightWithBleed - coverBleed.get('top') - coverBleed.get('bottom');

  // 计算可视区显示尺寸，带出血可视区显示尺寸/定位显示尺寸
  computed = computed.merge({
    guid: coverPage.get('guid'),
    width: width * coverWorkspace,
    height: height * coverWorkspace,
    widthWithBleed: widthWithBleed * coverWorkspace,
    heightWithBleed: heightWithBleed * coverWorkspace,
    bleedLeft: - coverBleed.get('left') * coverWorkspace,
    bleedTop: - coverBleed.get('top') * coverWorkspace,
    backgroundImageSize: getBackgroundImageSize(currentMaterials.get('fullCover'), {width, height}, coverWorkspace),
  });

  // 生成Cover封面上的elements
  const coverPhotoElement = fromJS(getCoverPhotoElementSize(
    coverPageSize,
    spineExpanding,
    spineWidth,
    coverBleed,
    widthWithBleed,
    coverWorkspace,
    originalPhoto,
    isHardCover
  ));

  const spineTextElement = fromJS(getCoverSpineTextElementSize(
    coverPageSize,
    spineExpanding,
    spineWidth,
    coverBleed,
    widthWithBleed,
    coverWorkspace,
    urls,
    coverPage,
    isHardCover
  ));

  const logoElement = fromJS(getCoverLogoElementSize(
    coverPageSize,
    spineExpanding,
    spineWidth,
    coverBleed,
    widthWithBleed,
    coverWorkspace,
    originalPhoto
  ));

  elements = elements.concat([
    coverPhotoElement,
    spineTextElement,
    logoElement
  ]).map(
    (element, index) => element.set('guid', `${computed.get('guid')}-element-${index}`)
  );

  computed = computed.set('elements', elements);

  return coverPage.set('computed', computed);
};

const computedInnerPageOptions = (innerPages, innerWorkspace, currentSpec, currentMaterials, urls) => {
  let spreadArray = fromJS([]);
  // 推入首尾两个空页
  let newInnerPages = innerPages.push(null).unshift(null);
  // 将pages两个一组成为pagesGroups [左页, 右页]
  const pagesGroups = fromJS(convertToTwoDimenArr(newInnerPages, 2));

  // 遍历计算spread
  for(const pages of pagesGroups) {
    let elements = fromJS([]);
    let computedSpread = fromJS({ isCover: false });

    // 获取spec的参数.
    let innerPageSize = currentSpec.getIn(['parameters', 'innerPageSize']);
    const innerBleed = currentSpec.getIn(['parameters', 'innerPageBleed']);
    // 两个页面减去中间左右出血，计算出宽度带出血大小
    const widthWithBleed = innerPageSize.get('width') * 2 - innerBleed.get('left') - innerBleed.get('right');
    const heightWithBleed = innerPageSize.get('height');

    // 计算带出血可视区实际大小
    const width = widthWithBleed - innerBleed.get('left') - innerBleed.get('right');
    const height = heightWithBleed - innerBleed.get('top') - innerBleed.get('bottom');

    // 计算render的宽高.
    computedSpread = computedSpread.merge({
      guid: `${pages.getIn(['0', 'guid'])}-${pages.getIn(['1', 'guid'])}`,
      width: width * innerWorkspace,
      height: height * innerWorkspace,
      widthWithBleed: widthWithBleed * innerWorkspace,
      heightWithBleed: heightWithBleed * innerWorkspace,
      bleedLeft: innerBleed.get('left') * innerWorkspace,
      bleedTop: innerBleed.get('top') * innerWorkspace,
      bleedBottom: innerBleed.get('bottom') * innerWorkspace,
      bleedRight: innerBleed.get('right') * innerWorkspace,
      backgroundImageSize: getBackgroundImageSize(currentMaterials.get('inner'), {width, height}, innerWorkspace),
    });

    // 偏移居中补正
    innerPageSize = innerPageSize.set('leftImageLeft', (innerPageSize.get('leftImageRight') - innerPageSize.get('leftImageLeft')) / 2 + innerPageSize.get('leftImageLeft'));
    innerPageSize = innerPageSize.set('rightImageLeft', innerPageSize.get('rightImageLeft') - (innerPageSize.get('rightImageLeft') - innerPageSize.get('rightImageRight')) / 2);

    // 遍历取出page下的元素，放入spread
    for(const page of pages) {
      // 如果是空页就跳过
      if(!page) continue;

      let originalPhoto = page.get('photo');
      const isLeft = page.get('index') % 2 === 0;

      const photoElement = originalPhoto ? fromJS(getInnerPhotoElementSize(
        innerPageSize,
        innerBleed,
        widthWithBleed,
        innerWorkspace,
        originalPhoto,
        isLeft,
        page.get('index')
      )) : null;

      const dateTextElement = fromJS(getTextElementSize(
        getImageTopTextSize(innerPageSize, widthWithBleed, isLeft, 'left'),
        page.get('date'),
        innerWorkspace,
        urls,
        true
      ));

      const locationTextElement = fromJS(getTextElementSize(
        getImageTopTextSize(innerPageSize, widthWithBleed, isLeft, 'right'),
        page.get('location'),
        innerWorkspace,
        urls,
        true
      ));

      const captionTextElement = fromJS(getTextElementSize(
        getCaptionTextSize(innerPageSize, widthWithBleed, isLeft, page.get('layout') === 'caption-only'),
        page.get('caption'),
        innerWorkspace,
        urls,
        true
      ));

      elements = elements.concat([
        photoElement,
        dateTextElement,
        locationTextElement,
        captionTextElement
      ]).filter(
        element => element
      ).map(
        (element, index) => element.set('guid', `${page.get('guid')}-element-${index}`)
      );
    }

    spreadArray = spreadArray.push({
      computed: computedSpread.set('elements', elements),
      left: pages.get('0'),
      right: pages.get('1')
    });
  }

  return spreadArray;
};

export const getRenderVolume = (selectedVolume, ratio, viewProperties, currentSpec, currentMaterials, urls) => {
  let volume = selectedVolume;

  if(selectedVolume && ratio && viewProperties){
    const coverPage = selectedVolume.get('cover');
    const innerPages = selectedVolume.get('pages');

    // 转换成渲染数据.
    const renderCoverPage = computedCoverPageOptions(coverPage, ratio.get('coverWorkspace'), currentSpec, currentMaterials, urls);
    const renderInnerPages = computedInnerPageOptions(innerPages, ratio.get('innerWorkspace'), currentSpec, currentMaterials, urls) || [];

    // 对pages进行分组, 用于渲染.
    const groupedPages = fromJS([renderCoverPage]).concat(renderInnerPages);
    const count = viewProperties.get('count');

    const computedPages = fromJS(convertToTwoDimenArr(groupedPages, count));
    volume = volume.set('computedPages', computedPages);
  }

  return volume;
};
