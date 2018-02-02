import React from 'react';
import { fromJS } from 'immutable';
import { merge, get } from 'lodash';
import { redirectToOrder } from '../../utils/order';
import { getCropOptions } from '../../utils/crop';
import { getLayoutTypeByCover } from '../../utils/template';
import { pageTypes, coverTypes } from '../../contants/strings';
import { errors } from '../../contants/errorMessage';
import { reviewPhotoBook } from '../../utils/reviewPhotoBook';
import { upgradeItemTypes } from '../../contants/strings';

const getCoverElement = (project) => {
  let element = fromJS({});
  const containers = project.getIn(['cover', 'containers']);
  const elementArray = project.get('elementArray');

  const fullPage = containers.find(
    m => m.get('type') === pageTypes.full && m.getIn(['backend', 'isPrint'])
  );
  if (fullPage) {
    const elementsId = fullPage.get('elements');
    if (elementsId && elementsId.size) {
      const id = elementsId.get(0);

      element = elementArray.find(ele => ele.get('id') === id);
    }
  }

  return element;
};

const updateElementWithDefaultCropOptions = (element, allImages) => {
  let newElement = element;
  if (newElement && allImages) {
    const image = allImages.find(
      img => img.get('encImgId') === newElement.get('encImgId')
    );

    if (image) {
      const {
        cropLUX = 0,
        cropLUY = 0,
        cropRLX = 0,
        cropRLY = 0
      } = getCropOptions(
        image.get('width'),
        image.get('height'),
        newElement.get('width'),
        newElement.get('height'),
        newElement.get('imgRot')
      );

      newElement = newElement.merge({
        cropLUX,
        cropLUY,
        cropRLX,
        cropRLY
      });
    }
  }

  return newElement;
};

const getCoverTemplateId = (project) => {
  const coverContainers = project && project.getIn(['cover', 'containers']);

  const fullPage =
    coverContainers &&
    coverContainers.find(page => page.get('type') === pageTypes.full);

  let templateId;
  if (fullPage) {
    templateId = fullPage.getIn(['template', 'tplGuid']);
  }

  return templateId;
};

const showUpgradeModal = (that) => {
  const { actions, data, t } = that.props;
  const {
    boundUpgradeModalActions,
    boundProjectActions,
    boundTemplateActions,
    boundNotificationActions,
    boundGlobalLoadingActions,
    boundTrackerActions,
    onSaveProject,
    onApplyTemplate
  } = actions;
  const { project, allTemplate, settings, productPrice } = data;

  const projectId = project.get('projectId');
  const coverTemplateId = getCoverTemplateId(project);
  const element = getCoverElement(project);

  const productSize = settings.spec.size;
  const coverType = settings.spec.cover;

  let toProductSize = productSize;
  let toCoverType = coverType;

  // 是否为paper cover
  const isPaperCover = coverType === coverTypes.LBPAC;
  const is6X6 = productSize === '6X6';

  // 设置允许upgrade的项目.
  // paper -> hard
  // 6x6 -> 8x8
  const upgradeCheckedItems = [];
  if (isPaperCover) {
    upgradeCheckedItems.push(upgradeItemTypes.toHardCover);
    toCoverType = coverTypes.LBHC;
  }

  if (is6X6) {
    upgradeCheckedItems.push(upgradeItemTypes.toSize8X8);

    // 默认size升级选项不勾选.
    toProductSize = '6X6';
  }

  const from = element.merge({
    summary: {
      productSize,
      coverType
    }
  });

  let to = updateElementWithDefaultCropOptions(
    element,
    project.get('imageArray')
  ).merge({
    summary: {
      productSize: toProductSize,
      coverType: toCoverType
    }
  });

  const show = () => {
    boundUpgradeModalActions.showUpgrade({
      onOkClick: (options) => {
        const {
          isUpgradeToHardCover,
          isUpgradeToSize8X8,
          hasUpgradeCoverOption,
          hasUpgradeSizeOption
        } = options;

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

        // 如果选中：UpgradeCover=1，UpgradeSize=1；否则值为0；如果看不到这个选项，则显示-1。
        const upgradeCover = isUpgradeToHardCover
          ? 1
          : hasUpgradeCoverOption ? 0 : -1;
        const upgradeSize = isUpgradeToSize8X8
          ? 1
          : hasUpgradeSizeOption ? 0 : -1;

        boundTrackerActions.addTracker(
          `UpgradeOption,upgradeCover=${upgradeCover},upgradeSize=${upgradeSize}`
        );

        boundGlobalLoadingActions.show();

        // 如果不需要upgrade, 那么直接保存加入购物车即可.
        if (!isUpgradeToHardCover && !isUpgradeToSize8X8) {
          onSaveProject(
            () => {
              // 加入购物车.
              redirectToOrder(projectId);
            }
          ).then(() => {
            boundGlobalLoadingActions.hide();
          }, () => {
            boundGlobalLoadingActions.hide();
          });

          return;
        }

        const setting = project.get('setting').toJS();
        const newSetting = merge({}, setting);
        if (isUpgradeToHardCover) {
          newSetting.cover = coverTypes.LBHC;
        }

        if (isUpgradeToSize8X8) {
          newSetting.size = '8X8';
        }

        const projectSize = newSetting.size;
        const containers = project.getIn(['cover', 'containers']);

        const doChangeProjectSettings = (tmplId) => {
          boundProjectActions.changeProjectSetting(newSetting).then(() => {
            if (tmplId) {
              onApplyTemplate(tmplId).then(() => {
                // isUpgrade为true, 会跳转到购物车.
                that.setState({
                  isUpgrade: true
                });

                boundGlobalLoadingActions.hide();
              });
            } else {
              // isUpgrade为true, 会跳转到购物车.
              that.setState({
                isUpgrade: true
              });

              boundGlobalLoadingActions.hide();
            }
          });
        };

        const fullPage = containers.find(
          p =>
            p.get('type') === pageTypes.full ||
            p.get('type') === pageTypes.sheet
        );

        if (fullPage) {
          const currentTemplateId = fullPage.getIn(['template', 'tplGuid']);

          if (currentTemplateId) {
            boundTemplateActions
              .getRelationTemplate(
                currentTemplateId,
                newSetting.size,
                getLayoutTypeByCover(newSetting.cover)
              )
              .then(
                (result) => {
                  const templateId = get(result, 'data.guid');

                  // 为-1表示, 封面类型没有变化. 那么就不需要重新下载模板.
                  if (templateId && templateId !== -1) {
                    boundTemplateActions
                      .getTemplateInfo(templateId, projectSize)
                      .then(
                        () => {
                          doChangeProjectSettings(templateId);
                        },
                        () => {
                          boundGlobalLoadingActions.hide();
                          showError();
                        }
                      );
                  } else {
                    boundGlobalLoadingActions.hide();
                    showError();
                  }
                },
                () => {
                  boundGlobalLoadingActions.hide();
                  showError();
                }
              );
          } else {
            doChangeProjectSettings();
          }
        }
      },
      from,
      to,
      upgradeCheckedItems,
      basePrice: productPrice
    });
  };

  if (coverTemplateId) {
    boundTemplateActions
      .getRelationTemplate(
        coverTemplateId,
        toProductSize,
        getLayoutTypeByCover(toCoverType)
      )
      .then(
        (result) => {
          const templateElement = get(result, 'data.templateElement');

          if (templateElement) {
            to = to.set('px', templateElement.px);
            to = to.set('py', templateElement.py);
            to = to.set('pw', templateElement.pw);
            to = to.set('ph', templateElement.ph);
          }

          show();
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
        }
      );
  } else {
    show();
  }
};

/**
 * 点击preview按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onPreview = (that) => {
  const { actions } = that.props;
  const { boundPreviewModalActions, boundTrackerActions } = actions;
  boundPreviewModalActions.show();
};

/**
 * 点击save按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onSave = (that, onSaveSuccessed, onSaveFailed) => {
  const { actions, data } = that.props;
  const {
    onSaveProject,
    boundTrackerActions,
    boundNotificationActions,
    boundCloneModalActions
  } = actions;
  const { project } = data;

  const orderStatus = project.get('orderStatus');

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');

  // 点击 save 的埋点;
  boundTrackerActions.addTracker('ClickSave');
  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions.showCloneModal}>clone</a> it to save your additional changes
      </div>
    );

    if (!that.errorMessageNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.errorMessageNode = node)}>{errorMessage}</div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }

    return Promise.resolve();
  }
  return onSaveProject(onSaveSuccessed, onSaveFailed);
};

export const onClone = (that) => {
  const { actions } = that.props;
  const { boundCloneModalActions } = actions;
  boundCloneModalActions.showCloneModal();
};

/**
 * 点击share按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onShare = (that) => {
  const { actions, data } = that.props;
  const { project } = data;
  const {
    boundShareProjectActions,
    onSaveProject,
    boundTrackerActions
  } = actions;

  // 如果当前的状态是 在购物车中或者订单状态，直接提示 clone。
  const orderStatus = project.get('orderStatus');

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');

  boundShareProjectActions.showShareProjectModal();
  if (!isInCartOrOrdered) {
    onSaveProject(() => {});
  }
};

export const onClickLogo = (that, goToHome) => {
  onSave(that, null, null).then(() => {
    if (goToHome && typeof goToHome === 'function') {
      // 1秒延迟, 让用户看到保存成功的notification.
      setTimeout(() => {
        goToHome();
      }, 3000);
    }
  });
};

/**
 * 点击order按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onOrder = (that) => {
  const { actions, data, t } = that.props;
  const {
    boundConfirmModalActions,
    boundTrackerActions,
    boundCloneModalActions,
    boundNotificationActions,
    boundUpgradeModalActions,
    onSaveProject
  } = actions;
  const { project, settings } = data;
  const { spec } = settings;

  const pages = project.get('pageArray');
  const imageArray = project.get('imageArray');
  const imageUsedCountMap = project.get('imageUsedCountMap');

  const reviewResult = reviewPhotoBook(project);

  const showNext = () => {
    // 是否为paper cover
    const isPaperCover =
      project.getIn(['setting', 'cover']) === coverTypes.LBPAC;

    const is5X7 = project.getIn(['setting', 'size']) === '5X7';
    const is8X8 = project.getIn(['setting', 'size']) === '8X8';

    // 5x7 hard cover, 8x8 hard cover就不需要显示upgrade modal.
    if ((is5X7 || is8X8) && !isPaperCover) {
      const projectId = project.get('projectId');
      // 确保截图渲染完成.
      onSaveProject(() => {}, null, true).then(() => {
        // boundUpgradeModalActions.hideUpgrade();
        // 加入购物车.
        redirectToOrder(projectId);
      });
    } else {
      showUpgradeModal(that);
    }
  };

  // 如果当前的状态是 在购物车中或者订单状态，直接提示 clone。
  const orderStatus = project.get('orderStatus');

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');

  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions.showCloneModal}>clone</a> it to save your additional changes
      </div>
    );

    if (!that.errorMessageNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.errorMessageNode = node)}>{errorMessage}</div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }

    return;
  }

  // 点击 order 的时候先埋点。
  boundTrackerActions.addTracker(`ClickOrder,${spec.cover},${spec.size}`);

  // 计算图片里面那些属于 facebook 那些属于instagram,google
  // 计算 使用的Instagram照片数量
  let facebookNum = 0;
  let instagramNum = 0;
  let googleNum = 0;
  let facebookUseNum = 0;
  let instagramUseNum = 0;
  let googleUseNum = 0;
  imageArray.map((img) => {
    if (img.get('name') == 'facebook') {
      facebookNum++;
      const encImgId = img.get('encImgId');
      facebookUseNum += imageUsedCountMap.get(String(encImgId));
    }
    if (img.get('name') == 'instagram') {
      instagramNum++;
      const encImgId = img.get('encImgId');
      instagramUseNum += imageUsedCountMap.get(String(encImgId));
    }
    if (img.get('name') == 'google') {
      googleNum++;
      const encImgId = img.get('encImgId');
      console.log(imageUsedCountMap);
      googleUseNum += imageUsedCountMap.get(String(encImgId));
    }
  });
  boundTrackerActions.addTracker(`PhotosInTotal,${imageArray.count()},${facebookNum},${facebookUseNum},${instagramNum},${instagramUseNum},${googleNum},${googleUseNum}`);
  const errorItemsCount = reviewResult.emptyPageCount;

  // 如果没有需要客户review的点， 就直接跳到下单页面.
  if (!errorItemsCount) {
    showNext();
  } else {
    // images
    const imageCount =
      reviewResult.usageImagesCount > 1
        ? `${reviewResult.usageImagesCount} images`
        : `${reviewResult.usageImagesCount} image`;

    let blankImageCount = pages.size - reviewResult.usageImagesCount;
    blankImageCount =
      blankImageCount > 1
        ? `${blankImageCount} blank pages`
        : `${blankImageCount} blank page`;

    boundConfirmModalActions.showConfirm({
      cancelInFirst: false,
      activeButton: 'cancel',
      confirmTitle: '',
      confirmMessage: t('ORDER_ERROR_CONTENT', { imageCount, blankImageCount }),
      onOkClick: () => {
        showNext();
      },
      okButtonText: t('CONTINUE'),
      cancelButtonText: t('CANCEL')
    });
  }
};

export const onSubmitCheckFailProject = (that) => {
  const { actions, t, data } = that.props;
  const {
    boundProjectActions,
    boundNotificationActions,
    onSaveProject
  } = actions;
  const { project } = data;

  const submit = () => {
    boundProjectActions.submitCheckFailProject().then(
      (code) => {
        if (code === '200') {
          if (!that.submitProjectSuccessNode) {
            boundNotificationActions.addNotification({
              children: (
                <div ref={node => (that.submitProjectSuccessNode = node)}>
                  {t('SUBMIT_PROJECT_SUCCESS')}
                </div>
              ),
              level: 'success',
              autoDismiss: 2
            });
          }
        } else if (!that.submitProjectFailedNode) {
          boundNotificationActions.addNotification({
            children: (
              <div ref={node => (that.submitProjectFailedNode = node)}>
                {t('SUBMIT_PROJECT_FAILED')}
              </div>
            ),
            level: 'error',
            autoDismiss: 0
          });
        }

        that.isSubmitingCheckFail = false;
      },
      (error) => {
        if (!that.submitProjectFailedNode) {
          boundNotificationActions.addNotification({
            children: (
              <div ref={node => (that.submitProjectFailedNode = node)}>
                {t('SUBMIT_PROJECT_FAILED')}
              </div>
            ),
            level: 'error',
            autoDismiss: 0
          });
        }

        that.isSubmitingCheckFail = false;
      }
    );
  };

  if (that.isSubmitingCheckFail) {
    return;
  }

  that.isSubmitingCheckFail = true;

  onSaveProject().then(
    () => {
      submit();
    },
    () => {
      that.isSubmitingCheckFail = false;
    }
  );
};
