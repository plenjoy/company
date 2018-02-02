import React from 'react';
import { get, merge } from 'lodash';
import { getColorSchemaList } from '../../../utils/projectOptions';
import { getLayoutTypeByCover } from '../../../utils/template';
import { coverTypes, pageTypes } from '../../../contants/strings';
import { toEncode } from '../../../../../common/utils/encode';

const getBackgroundAndForegroundColor = (spinePage, allElements) => {
  let coverBackgroundColor = '';
  let coverForegroundColor = '';

  if (spinePage) {
    coverBackgroundColor = spinePage.get('bgColor');

    const pageElementIds = spinePage.get('elements');
    if (pageElementIds) {
      const id = pageElementIds.get(0);
      const element = allElements.get(id);

      if (element) {
        coverForegroundColor = element.get('fontColor');
      }
    }
  }

  return {
    coverBackgroundColor,
    coverForegroundColor
  };
};

/**
 * schema list做过调整, 为了确保老项目能够正常显示.
 * 验证project中存的schema id是否在schema list中还能找到.
 * - 如果还能找到, 就继续设置选中项目.
 * - 如果在当前的序号中, 没有找到, 那么查看一下是否序号变了.
 * - 如果根据当前项目的bgColor和fontColor, 在schema list都找不到, 说明一切的schema已经下架了.
 * @return {[type]} [description]
 */
const getCurrentColorSchemaId = (paginationSpreadForCover, colorSchemas) => {
  let schemaId = '';

  // 获取当前project中已经使用的colorSchem的coverBackgroundColor和coverForegroundColor.
  const pages = paginationSpreadForCover.get('pages');
  const spinePage = pages.find(p => p.get('type') === pageTypes.spine);
  const {
    coverBackgroundColor,
    coverForegroundColor
  } = getBackgroundAndForegroundColor(spinePage, paginationSpreadForCover.get('elements'));

  if (colorSchemas && colorSchemas.length) {
    const matchedSchema = colorSchemas.find((s) => {
      return s.value && coverBackgroundColor && s.value.toLowerCase() === coverBackgroundColor.toLowerCase();
    });
    if (matchedSchema) {
      schemaId = matchedSchema.id;
    }
  }

  return schemaId;
};

/**
 * 更改产品的spec设置.
 * @param  {[type]} that    [description]
 * @param  {object} setting 新的产品设置.
 */
export const changeProjectSetting = (that, newSetting, oldSetting) => {
  const {
    boundProjectActions,
    boundTemplateActions,
    paginationSpreadForCover,
    boundNotificationActions,
    boundGlobalLoadingActions,
    boundRenderActions,
    t
  } = that.props;
  const templateSources = that.props.template.get('templateSources');

  const projectSize = newSetting.size;
  const containers = paginationSpreadForCover.get('pages');

  const doChangeSettings = (templateId) => {
    return new Promise((resolve, reject) => {
      boundProjectActions.changeProjectSetting(newSetting).then(
        () => {
          const {
            boundPaginationActions,
            paginationSpread,
            pagination
          } = that.props;
          const { pageIndex } = pagination;
          const pages = paginationSpread.get('pages');

          // 更新pagination上的pageId.
          const pageId = pages && pages.size ? pages.getIn([pageIndex, 'id']) : '';
          if (pageId) {
            boundPaginationActions.switchPage(pageIndex, pageId);
          }

          // 如果封面类型发生变化, 就需要重新应用模板.
          if (
            newSetting.cover !== oldSetting.cover ||
            newSetting.size !== oldSetting.size
          ) {
            if (templateId) {
              that.applyTemplate(templateId);
            }
          }

         // boundGlobalLoadingActions.hide();
          resolve();
        },
        () => {
          if (!that.upgradeFailedNode) {
            boundNotificationActions.addNotification({
              children: (
                <div ref={node => (that.upgradeFailedNode = node)}>
                  {t('UPGRADE_PROJECT_FAILED')}
                </div>
              ),
              level: 'error',
              autoDismiss: 0
            });
          }

         // boundGlobalLoadingActions.hide();

          reject();
        }
      );
    });
  };

  const showError = () => {
    if (!that.upgradeFailedNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.upgradeFailedNode = node)}>
            {t('UPGRADE_PROJECT_FAILED')}
          </div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }
  };

  // 如果封面类型和产品大小都没有变化. 那么就不需要重新应用模板.
  if (newSetting.cover === oldSetting.cover &&
    newSetting.size === oldSetting.size) {
    return doChangeSettings();
  }

  const fullPage = containers.find(
    p => p.get('type') === pageTypes.full || p.get('type') === pageTypes.sheet
  );

  if (fullPage) {
    // 情况store上的合成的效果图, 避免渲染中间状态给用户界面.
    boundRenderActions.updateCoverMaterial({
      img: null
    });

    const currentTemplateId = fullPage.getIn(['template', 'tplGuid']);

    if (currentTemplateId) {
      return boundTemplateActions.getRelationTemplate(
        currentTemplateId,
        newSetting.size,
        getLayoutTypeByCover(newSetting.cover)
      ).then((result) => {
        const templateId = get(result, 'data.guid');

        // 为-1表示, 封面类型没有变化. 那么就不需要重新下载模板.
        if (!templateId) {
          showError();
          boundGlobalLoadingActions.hide();

          return Promise.reject();
        }

        return boundTemplateActions.getTemplateInfo(templateId, projectSize).then(
          () => {
            return doChangeSettings(templateId);
          },
          () => {
            const isPaperCover = paginationSpreadForCover.getIn([
              'summary',
              'isPaperCover'
            ]);

            that.setState({
              paperTypeSwitchValue: isPaperCover ? 1 : 2
            });

            showError();
            boundGlobalLoadingActions.hide();

            return Promise.reject();
          }
        );
      }, () => {
        showError();
        boundGlobalLoadingActions.hide();

        return Promise.reject();
      });
    }
    return doChangeSettings();
  }

  showError();
  boundGlobalLoadingActions.hide();

  return Promise.reject();
};

/**
 * 获取所有的主题列表. 并设置到state中.
 */
export const setColorSchemas = (that) => {
  const { paginationSpreadForCover } = that.props;
  const colorSchemas = getColorSchemaList();

  if (colorSchemas && colorSchemas.length) {
    that.setState({
      colorSchemas,
      currentSchemaId: getCurrentColorSchemaId(paginationSpreadForCover, colorSchemas)
    });
  }
};

/**
 * 更改产品的主题.
 * @param  {[type]} that   [description]
 * @param  {object} schema {id: 'colorSchema0', value: '#000000'}
 */
export const changeColorSchema = (that, schema) => {
  const { variables } = that.props;
  const { spec } = that.props.settings;
  const preBackgroundColor = variables.get('coverBackgroundColor');
  const encodePreBackgroundColor = toEncode(preBackgroundColor);

  const setting = merge({}, spec, {
    colorScheme: schema.id
  });

  changeProjectSetting(that, setting, spec).then(() => {
    const {
      variables,
      isImageCover,
      settings,
      boundTrackerActions
    } = that.props;
    const { spec } = settings;
    const newBackgroundColor = variables.get('coverBackgroundColor');
    const encodeNewBackgroundColor = toEncode(newBackgroundColor);
    const coverType = isImageCover ? 'Photo' : 'Text';
    boundTrackerActions.addTracker(
      `SwitchCoverColor,${encodePreBackgroundColor},${encodeNewBackgroundColor},${coverType},${spec.cover}`
    );
  }, () => {});
};

/**
 * 更改封面类型.
 * @param  {[type]} that  [description]
 * @param  {number} value [description]
 */
export const onSwitchPaperType = (that, value) => {
  const { boundTrackerActions, variables, isImageCover, paginationSpread,boundGlobalLoadingActions} = that.props;
  const backgroundColor = variables.get('coverBackgroundColor');
  const EncodeBackgroundColor = toEncode(backgroundColor);
  const imageOrTextHard = isImageCover ? 'Photo' : 'Text';

  const isPaperCover = paginationSpread.getIn([
    'summary',
    'isPaperCover'
  ]);

  const currentSwitchValue = isPaperCover ? 1 : 2;
  if (currentSwitchValue === value) {
    return;
  }

  boundGlobalLoadingActions.show();

  // 1: paper cover
  // 2: hard cover
  switch (value) {
    case 1: {
      const { spec } = that.props.settings;
      const setting = merge({}, spec, {
        cover: coverTypes.LBPAC
      });

      changeProjectSetting(that, setting, spec).then(() => {
        boundTrackerActions.addTracker(
          `SwitchToPaperCover,${EncodeBackgroundColor}`
        );
      }, () => {});

      break;
    }
    case 2: {
      const { spec } = that.props.settings;
      const setting = merge({}, spec, {
        cover: coverTypes.LBHC
      });

      changeProjectSetting(that, setting, spec).then(() => {
        boundTrackerActions.addTracker(
          `SwitchToHardCover,${EncodeBackgroundColor}`
        );
      }, () => {});

      break;
    }
    default: {
      break;
    }
  }
};
