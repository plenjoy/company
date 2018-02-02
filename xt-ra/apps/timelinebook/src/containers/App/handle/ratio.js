import {
  getSize,
  computedItemCountdAndWidthInRow
} from '../../../../../common/utils/helper';

let timer;

const computedRatio = (sheetWidth, currentSpec) => {
  let coverWorkspace = 0;
  let innerWorkspace = 0;

  if (currentSpec) {
    // 获取元素的宽高.
    const coverOriginalWidth = currentSpec.getIn(['parameters', 'coverPageSize', 'width']);
    const innerOriginalWidth = currentSpec.getIn(['parameters', 'innerPageSize', 'width']);
    const coverBleed = currentSpec.getIn(['parameters', 'coverPageBleed']);
    const innerBleed = currentSpec.getIn(['parameters', 'innerPageBleed']);

    // 客户可视区宽度
    const coverClientWidth = coverOriginalWidth - coverBleed.get('left') - coverBleed.get('right');
    const innerClientWidth = innerOriginalWidth - innerBleed.get('left') - innerBleed.get('right');

    // 计算cover的ratio.
    coverWorkspace = sheetWidth / coverClientWidth;

    // 内页是有两个page组成的.
    innerWorkspace = (sheetWidth / 2) / innerClientWidth;
  }

  return { coverWorkspace, innerWorkspace };
};

export const onResize = (that, nextProps) => {
  const {
    isPreview,
    currentSpec,
    boundViewPropertiesActions,
    boundRatioActions } = nextProps || that.props;

  clearTimeout(timer);
  timer = setTimeout(() => {
    const documentSize = getSize();

    // 280: sidebar的宽.
    const editorWidth = documentSize.width - 300;
    const containerLeftPadding = 80;
    const containerRightPadding = 80;
    const itemMargin = !isPreview ? 40 : 0;
    const itemMinWidth = 335;

    const { width, count } = !isPreview
      ? computedItemCountdAndWidthInRow(
        editorWidth,
        containerLeftPadding,
        containerRightPadding,
        itemMinWidth,
        itemMargin
      )
      : computedPreviewCountdAndWidth(documentSize.width * 0.8);

    // 更新在all page中, 每一个booksheet的宽以及每一行显示的个数.
    boundViewPropertiesActions.updateViewPropertiesOfBookSheet({ width, count });

    // 重新计算ratio.
    const newRatio = computedRatio(width, currentSpec);
    boundRatioActions.updateRatio(newRatio);

    boundViewPropertiesActions.hideViewIsRending();
  }, 300);
};


function computedPreviewCountdAndWidth(editorWidth) {
  return {
    width: editorWidth,
    count: 1
  }
}