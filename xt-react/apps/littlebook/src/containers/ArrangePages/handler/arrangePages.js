import { get } from 'lodash';
import { elementTypes, pageTypes } from '../../../contants/strings';
import { getTemplateIdByImageShape } from '../../../utils/template/getTemplateId';
import { mergeTemplateData } from '../../../utils/template/mergeTemplateData';

export const onAddPages = (that) => {
  const { boundProjectActions } = that.props;
  boundProjectActions.createDualPage();
};

/**
 * [description]
 * @param  {[type]}  that        [description]
 * @param  {[type]}  pageIds     [description]
 * @param  {Boolean} isSkipCover 标识封面上是否要应用autolayout.
 * @return {[type]}              [description]
 */
export const doAutoLayout = (that, pageIds, isSkipCover) => {
  const {
    actions,
    settings,
    allSheets,
    allImages,
    template,
    pagination,
    ratios,
    boundTemplateActions,
    boundProjectActions
  } = that.props;

  const ratio = pagination.sheetIndex ? ratios.coverWorkspace : ratios.innerWorkspace;

  const productSize = get(settings, 'spec.size');
  const productCover = get(settings, 'spec.cover');
  const templateObject = template.getIn(['templateSources', productCover]);

  if (pageIds && pageIds.length) {
    pageIds.forEach((pageId) => {
      let page;
      const sheet = allSheets.find((s) => {
        const pages = s.get('pages');
        page = pages.find((p) => {
          if (isSkipCover) {
            return p.get('id') === pageId &&
              p.get('type') !== pageTypes.full &&
              p.get('type') !== pageTypes.front &&
              p.get('type') !== pageTypes.back;
          }

          return p.get('id') === pageId;
        });

        return !!page;
      });

      if (sheet) {
        const images = [];
        const pageElements = [];

        const elements = sheet.get('elements').valueSeq().toList();
        if (elements) {
          elements.forEach((ele) => {
            const image = allImages.find(
              img => img.get('encImgId') === ele.get('encImgId')
            );

            if (image) {
              pageElements.push(ele.toJS());
              images.push(image.toJS());
            }
          });
        }

        if (images.length) {
          const isCover = sheet.getIn(['summary', 'isCover']);

          if (isCover) {
            const templateList = templateObject.getIn([
              'cover',
              `GROUP_COVER_${productSize}`
            ]);
            const coverTemplate = templateList.find(t => t.get('isDefault'));

            if (coverTemplate) {
              // 调用app/layout下的应用封面的方法.
              actions.applyTemplate(coverTemplate.get('guid'));
            }
          } else {
            const templateList = templateObject.get('inner');
            const templateId = getTemplateIdByImageShape(
              templateList.toJS(),
              images,
              productSize
            );

            if (templateId) {
              const newSize = productSize !== '5X7' ? '6X6' : '5X7';
              boundTemplateActions
                .getTemplateData([templateId], newSize)
                .then((newTemplates) => {
                  const newElements = mergeTemplateData(
                    images,
                    newTemplates[0],
                    allImages.toJS(),
                    page.get('width'),
                    page.get('height'),
                    pageElements,
                    ratio
                  );

                  boundProjectActions.applyTemplate(
                    page.get('id'),
                    templateId,
                    newElements
                  );
                });
            }
          }
        }
      }
    });
  }
};
