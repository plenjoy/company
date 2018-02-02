import { get } from 'lodash';
import { pageTypes } from '../../../contants/strings';

export const onAddPages = (that) => {
  const { boundProjectActions, boundTrackerActions } = that.props;
  boundProjectActions.createDualPage();
  boundTrackerActions.addTracker('ArrangePageAddPage');
};

export const onRemovePages = (that, pageIds) => {
  if (!pageIds || pageIds.length < 2) {
    return;
  }

  const { boundProjectActions } = that.props;
  const leftPageId = pageIds[0];
  const rightPageId = pageIds[1];

  boundProjectActions.deleteDualPage(leftPageId, rightPageId).then(() => {
    const { paginationSpreadForCover, pagination, settings } = that.props;
    const totalSheetNumber = get(pagination, 'total');
    const coverType = get(settings, 'spec.cover');

    // 如果是pressbook  Soft 且页面数量少于40页，并且有spinetext 就先移除spinetext
    const pages = paginationSpreadForCover.get('pages');
    const spinePage = pages.find(
      page => page.get('type') === pageTypes.spine
    );
    const spineElements = spinePage.get('elements');

    if (
      totalSheetNumber <= 22 &&
      spineElements &&
      spineElements.size &&
      coverType === 'PSSC'
    ) {
      boundProjectActions.deleteElement(spineElements.first().get('id'));
    }
  });
};
