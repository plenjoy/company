import React from 'react';
import { hashHistory } from 'react-router';
import { redirectToOrder, redirectParentBook } from '../../utils/order';
import { orderType, productTypes } from '../../contants/strings';
import { errors } from '../../contants/errorMessage';
import { FAQ_ADDRESS, ORDER_PATH } from '../../contants/apiUrl';
import { reviewPhotoBook } from '../../utils/reviewPhotoBook';

export const onClone = (that) => {
  const { actions } = that.props;
  const { boundCloneModalActions } = actions;
  boundCloneModalActions.showCloneModal();
};

/**
 * 点击help按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onHelp = (that) => {
  // todo
};

/**
 * 点击preview按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onPreview = (that) => {
  const { actions } = that.props;
  const { boundPreviewModalActions } = actions;
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
  const { project, isEditParentBook } = data;

  const orderInfo = project.orderInfo;

  if (isEditParentBook) {
    return onSaveProject(onSaveSuccessed, onSaveFailed);
  }

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  // 点击 save 的埋点;
  boundTrackerActions.addTracker('ClickSave');
  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions.showCloneModal}>clone</a> it to save
        your additional changes
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

/**
 * 点击share按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onShare = (that) => {
  const { actions, data } = that.props;
  const { project } = data;
  const { boundShareProjectActions, onSaveProject } = actions;
  boundShareProjectActions.showShareProjectModal();

  const orderInfo = project.orderInfo;

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');
  if (!isInCartOrOrdered) {
    onSaveProject(() => {});
  }
};

export const onClickLogo = (that, goToHome) => {
  const { actions } = that.props;
  const { onSaveProject } = actions;
  onSaveProject(() => {}, null).then(() => {
    if (goToHome && typeof goToHome === 'function') {
      // 0.5秒延迟, 让用户看到保存成功的notification.
      goToHome();
    }
  });
};

export const showIntroModal = (that) => {
  const { actions } = that.props;
  const { showIntroModal, boundSidebarActions } = actions;

  // 跳转到editpage
  hashHistory.push('/editpage');

  // sidebar中, 切换到photo tab.
  boundSidebarActions.changeTab(1);

  showIntroModal && showIntroModal();
};

/**
 * 点击order按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onOrder = (that) => {
  const { actions, data, t } = that.props;
  const {
    boundConfirmModalActions,
    boundPaginationActions,
    boundTrackerActions,
    boundCloneModalActions,
    boundNotificationActions,
    boundApprovalPageActions,
    onSaveProject
  } = actions;

  const { project, isEditParentBook, env } = data;
  const reviewResult = reviewPhotoBook(project, isEditParentBook);

  // 如果当前的状态是 在购物车中或者订单状态，直接提示 clone。
  const orderInfo = project.orderInfo;

  // 以下情况不支持保存:
  // - 在订单中, 并且不是打回状态.
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  // 获取crossSell信息.
  const crossSell = env.qs.get('crossSell');

  if (isInCartOrOrdered && !isEditParentBook) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions.showCloneModal}>clone</a> it to save
        your additional changes
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
  boundTrackerActions.addTracker('ClickOrder');

  const reviewResultCount = reviewResult.cover.length;
  const errorItemsCount = reviewResult.errorItems.length;

  if (
    reviewResultCount &&
    reviewResult.cover[0].errorMessage === errors.blankCameo
  ) {
    boundConfirmModalActions.showConfirm({
      confirmTitle: t('ORDER_ERROR_TITLE'),
      confirmMessage: t('ORDER_ERROR_EMPTYCAMEO_MESSAGE'),
      onOkClick: () => {
        boundPaginationActions.switchSheet(0);
      },
      okButtonText: t('ORDER_ERROR_EMPTYCAMEO_BUTTONTEXT')
    });
    return;
  }

  boundApprovalPageActions.showApprovalPage({ reviewResult });
};

export const directToFAQ = (that) => {
  const { actions } = that.props;
  const { boundTrackerActions } = actions;
  boundTrackerActions.addTracker('ClickFAQ');
  window.open(FAQ_ADDRESS, '_blank');
};

export const onSubmitCheckFailProject = (that) => {
  const { actions, t, data } = that.props;
  const {
    boundProjectActions,
    boundNotificationActions,
    onSaveProject
  } = actions;
  const { isEditParentBook, project } = data;

  const { property } = project;
  const projectId = property.get('projectId');
  const hasParentBook = property.get('hasParentBook');

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
      // 如果是parentbook, 那就直接submit即可.
      if (isEditParentBook) {
        submit();
      } else if (hasParentBook) {
        redirectParentBook(projectId);
      } else {
        submit();
      }
    },
    () => {
      that.isSubmitingCheckFail = false;
    }
  );
};
