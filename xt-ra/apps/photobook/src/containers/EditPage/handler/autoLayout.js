import React from 'react';
import { get, isArray, merge } from 'lodash';
import Immutable from 'immutable';
import {
  productTypes,
  pageTypes,
  elementTypes
} from '../../../contants/strings';
import {
  checkIsSupportImageInCover,
  checkIsSupportHalfImageInCover,
  checkIsSupportFullImageInCover
} from '../../../utils/cover';
import { convertObjIn } from '../../../../../common/utils/typeConverter';
import { numberToHex } from '../../../../../common/utils/colorConverter';
import { autoLayoutByImages } from '../../../utils/autoLayout';
import { createNewElementsByTemplate } from '../../../utils/autoLayoutHepler';
import {
  convertResultToJson,
  formatTemplateInstance,
  filterCoverTemplates
} from '../../../utils/template';

import { mergeTemplateElements } from '../../../utils/template/mergeTemplateElements';

/**
 * 根据模板详细信息, 应用该模板到当前工作的page上.
 */
const doApplyTemplate = (that, pagesWithTemplate) => {
  const {
    boundProjectActions,
    boundNotificationActions,
    boundPaginationActions,
    t,
    ratios,
    paginationSpread,
    settings
  } = that.props;
  const { template, images, page } = pagesWithTemplate;
  const summary = paginationSpread.get('summary');
  const isSupportHalfImageInCover = summary.get('isSupportHalfImageInCover');

  const arr = [];

  // 应用border.
  const { bookSetting } = settings;
  const border = bookSetting.border;

  const promise = new Promise((resolve, reject) => {
    // 根据模板信息, 更新页面上的所有元素.
    pagesWithTemplate.forEach((pt, index) => {
      const { template, images, page } = pt;
      const ratio = index === 0 ? ratios.coverWorkspace : ratios.innerWorkspace;
      let newElements = createNewElementsByTemplate(
        page,
        images,
        template,
        ratio,
        isSupportHalfImageInCover
      );

      newElements = newElements.map(element => {
        if (element.get('type') === elementTypes.photo) {
          return element.merge({ border });
        }
        return element;
      });

      const newPage = page.set('elements', Immutable.fromJS(newElements));

      let photoElements = Immutable.List();
      let notPhotoElements = Immutable.List();
      newElements.forEach(element => {
        if (element.get('type') === elementTypes.photo) {
          photoElements = photoElements.push(element);
        } else {
          notPhotoElements = notPhotoElements.push(element);
        }
      });

      const newPhotoElements = mergeTemplateElements(
        newPage,
        photoElements,
        images
      );

      newElements = newPhotoElements.concat(notPhotoElements);

      arr.push({
        pageId: page.get('id'),
        templateId: template.id,
        elements: newElements
      });
    });

    // 应用模板, 更新store上的page和page上的elements.
    if (arr.length) {
      boundProjectActions
        .applyTemplateToPages(Immutable.fromJS(arr))
        .then(() => {
          that.setState({
            loading: {
              isShown: false
            }
          });

          resolve();
        });

      // 重置到封面当book options发生改变时.
      boundPaginationActions.switchSheet(0);
    } else {
      // 失败后, 关闭loading.
      that.setState({
        loading: {
          isShown: false
        }
      });

      if (!that.autofillFailed) {
        boundNotificationActions.addNotification({
          children: (
            <div ref={node => (that.autofillFailed = node)}>
              {t('AUTOFILL_FAILED')}
            </div>
          ),
          level: 'error',
          autoDismiss: 0
        });
      }

      resolve();
    }
  });

  return promise;
};

/**
 * 下载模板, 返回下载后的模板数据以及使用该模板的page数据.
 * @param  {[type]}   that         [description]
 * @param  {[type]}   autoFillData autofill数据计算后的图片的数组集合.
 * @param  {Function} done        下载完成后的回调.
 */
const downloadTemplates = (that, autoFillData, done) => {
  const {
    settings,
    project,
    template,
    boundTemplateActions,
    boundTrackerActions
  } = that.props;

  const productType = get(settings, 'spec.product');
  const projectSize = get(settings, 'spec.size');
  const coverType = get(settings, 'spec.cover');
  let useTemplatesList = [];
  const templateDetails = get(template, 'details');
  const pageArray = project.pageArray.present;
  const coverPageArray = project.cover.present.get('containers');
  const isSupportImageInCover = checkIsSupportImageInCover(coverType);
  // 保存需要下载的模板id.
  const needDownloadTemplateIds = [];

  // 保存下载好的模板以及使用该模板的page数据.
  const pagesWithTemplate = [];

  // 根据autofill生成的image groups.为每一个group选择合适的模板.
  autoFillData.forEach((imagesGroup, index) => {
    let page;
    // 给支持图片的封面填充图片.
    if (index === 0) {
      if (isSupportImageInCover) {
        page = coverPageArray.find(
          p =>
            p.get('type') === pageTypes.full ||
            p.get('type') === pageTypes.front
        );
        useTemplatesList = get(template, 'cover');
      } else {
        let pageIndex = index;

        // 第一个sheet的第一页.不能放置图片
        pageIndex = productType !== productTypes.PS ? index : 1;

        page = pageArray.get(pageIndex);
        useTemplatesList = get(template, 'inner');
      }
    } else {
      useTemplatesList = get(template, 'inner');
      let pageIndex = index;

      // 在pressbook上, 第一个sheet的第一页和最后一个sheet的最后一页.不能放置图片.
      if (isSupportImageInCover) {
        pageIndex =
          productType !== productTypes.PS
            ? (index - 1) * 2
            : // 判断是否为最后一页.
              index === pageArray.size - 1 ? -1 : index;
      } else {
        pageIndex =
          productType !== productTypes.PS
            ? index * 2
            : // 判断是否为最后一页.
              index + 1 === pageArray.size - 1 ? -1 : index + 1;
      }

      if (pageIndex !== -1) {
        page = pageArray.get(pageIndex);
      }
    }

    if (!page) {
      return;
    }

    // 过滤掉含有textFrame的模板
    useTemplatesList = useTemplatesList.filter(item => item.textFrameNum === 0);

    // 根据传入的图片数组, 自动选出一个合适的模板.
    const currentPageType = page.get('type');
    const templateOverView = autoLayoutByImages(
      imagesGroup,
      useTemplatesList,
      boundTrackerActions,
      {
        size: projectSize,
        isCover:
          currentPageType === pageTypes.full ||
          currentPageType === pageTypes.front ||
          currentPageType === pageTypes.back
      }
    );

    // 如果找到模板.
    if (templateOverView) {
      const guid = templateOverView.guid;

      // 下载后的模板信息,会缓存到store上, 键以:<guid>_<size>两部分构成.
      const templateId = `${guid}_${projectSize}`;

      // 如果在store上找不到当前id的模板信息,说明该模板还没有下载
      if (!templateDetails[templateId]) {
        needDownloadTemplateIds.push({
          index: needDownloadTemplateIds.length,
          templateId: guid,
          images: imagesGroup,
          page
        });
      } else {
        pagesWithTemplate.push({
          template: templateDetails[templateId],
          images: imagesGroup,
          page
        });
      }
    }
  });

  if (needDownloadTemplateIds && needDownloadTemplateIds.length) {
    const ids = [];

    needDownloadTemplateIds.forEach(t => {
      ids.push(t.templateId);
    });

    boundTemplateActions.getTemplateInfo(ids, projectSize).then(
      response => {
        // 把请求返回值中的xml转成json.
        const results = convertResultToJson(response);

        // 格式化template的原始数据, 使它可以在app中可以使用的格式
        const newTemplates = formatTemplateInstance(results, ids, projectSize);

        ids.forEach((id, index) => {
          const templateId = `${id}_${projectSize}`;

          // newTemplates的结构为: [{'<id>': <template>]
          let templateObject = newTemplates.find(v => {
            for (const k in v) {
              if (v[k].id === id) {
                return true;
              }
            }

            return false;
          });

          // 解决auto fill, 填充时, 有空页面的情况.
          const needDownloadTemplate = needDownloadTemplateIds.find(
            v => v.index === index
          );

          // 下载模板失败或模板数据不正确的情况下, 那就从已下载的模板中随机选择一个.
          if (!templateObject) {
            templateObject =
              newTemplates[Math.floor(Math.random() * newTemplates.length)];
          }

          // 如果还为空, 那就从store的template details上随机的选择一个.
          if (!templateObject) {
            const templatesInStore = Object.values(templateDetails);
            if (templatesInStore && templatesInStore.length) {
              templateObject =
                templatesInStore[
                  Math.floor(Math.random() * templatesInStore.length)
                ];
            }
          }

          if (templateObject && needDownloadTemplate) {
            pagesWithTemplate.push({
              template: Object.values(templateObject)[0],
              images: needDownloadTemplate.images,
              page: needDownloadTemplate.page
            });
          }
        });

        done && done(pagesWithTemplate);
      },
      error => {
        done && done(pagesWithTemplate);
      }
    );
  } else {
    done &&
      done(
        pagesWithTemplate && pagesWithTemplate.length ? pagesWithTemplate : []
      );
  }
};

export const doAutoLayout = (that, autoFillData) => {
  const { t, boundNotificationActions } = that.props;

  const promise = new Promise((resolve, reject) => {
    downloadTemplates(that, autoFillData, pagesWithTemplate => {
      if (pagesWithTemplate && pagesWithTemplate.length) {
        doApplyTemplate(that, pagesWithTemplate).then(() => {
          resolve();
        });
      } else {
        // 失败后, 关闭loading.
        that.setState({
          loading: {
            isShown: false
          }
        });

        if (!that.autofillFailed) {
          boundNotificationActions.addNotification({
            children: (
              <div ref={node => (that.autofillFailed = node)}>
                {t('AUTOFILL_FAILED')}
              </div>
            ),
            level: 'error',
            autoDismiss: 0
          });
        }

        resolve();
      }
    });
  });

  return promise;
};
