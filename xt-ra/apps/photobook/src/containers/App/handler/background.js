import { get } from 'lodash';
import { checkIsSupportImageInCover } from '../../../utils/cover';
import { pageTypes, elementTypes, BACKGROUND_ELEMENT_DEP } from '../../../contants/strings';

export const applyBackgroundToPages = (that, backgroundList) => {
  const { hasAddedElements, cover, pageArray, settings, boundProjectActions } = that.props;

  const coverType = get(settings, 'spec.cover');

  const innerBackgrounds = backgroundList.filterNot(background => {
    return background.get('isCover');
  });

  // 如果封面支持图片
  if (coverType && checkIsSupportImageInCover(coverType)) {
    const coverBackground = backgroundList.filter(background => {
      return background.get('isCover');
    });
    const mainCoverPage = cover.get('containers').find(page => {
      return page.get('type') === pageTypes.full || page.get('type') === pageTypes.front;
    });
    if (mainCoverPage && coverBackground && coverBackground.size) {
      boundProjectActions.createElement({
        type: elementTypes.background,
        x: 0,
        y: 0,
        width: mainCoverPage.get('width'),
        height: mainCoverPage.get('height'),
        backgroundId: coverBackground.code,
        rot: 0,
        dep: BACKGROUND_ELEMENT_DEP
      });
    }
  }

  if (innerBackgrounds && innerBackgrounds.size) {
    // 将inner backgorunds按照name排序
    const sortedInnerBackgrounds = innerBackgrounds.sort((b1, b2) => {
      return b1.get('name') > b2.get('name');
    });
    pageArray.forEach((page, index) => {
      const background = sortedInnerBackgrounds.get(index);
      if (background) {
        boundProjectActions.createElement({
          type: elementTypes.background,
          x: 0,
          y: 0,
          width: pape.get('width'),
          height: pape.get('height'),
          backgroundId: background.code,
          rot: 0,
          dep: BACKGROUND_ELEMENT_DEP
        });
      } else {
        return false;
      }
    });
  }
}
