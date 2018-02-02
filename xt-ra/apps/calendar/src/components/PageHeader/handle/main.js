import React from 'react';
import { redirectToOrder } from '../../../utils/order';
import { productTypes } from '../../../constants/strings';

/**
 * 点击order按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onOrder = (that) => {
  if (that.isOrdering) return;
  const { data, actions } = that.props;
  const { project } = data;
  const { setting } = project;
  const { onSaveProject, boundConfirmModalActions, boundCloneModalActions, boundNotificationActions, boundTrackerActions, boundUpgradeModalActions } = actions;
  that.isOrdering = true;
  const projectId = project.property.get('projectId');
  const orderInfo = project.orderInfo;
  const startYear = project.calendarSetting.get('startYear');
  const startMonth = project.calendarSetting.get('startMonth');
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');


  const onSaveProjectFun = () => {
    onSaveProject(() => {}, () => {
      that.isOrdering = false;
    }).then(() => {
          // order 时提示有空白页 仍点击 continue 且 成功加入购物车 的 埋点;
      boundTrackerActions.addTracker(`ClickOrderAndContinueThenSuccess,${trackerBlankNum}`);
          // 加入购物车.
      redirectToOrder(projectId);
    });
  };


  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions && boundCloneModalActions.showCloneModal}>clone</a> it to save
        your additional changes
      </div>
    );

    if (!that.errorMessageNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.errorMessageNode = node)}>
            {errorMessage}
          </div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }
    that.isOrdering = false;
    return;
  }
  let trackerBlankNum = 0;
  project.cover.get('containers').forEach((item) => {
    item.toJS().elements.forEach((element) => {
      if (element.type === 'PhotoElement' && !element.encImgId) {
        trackerBlankNum++;
      }
    });
  });
  project.pageArray.forEach((item) => {
    item.toJS().elements.forEach((element) => {
      if (element.type === 'PhotoElement' && !element.encImgId) {
        trackerBlankNum++;
      }
    });
  });
  const routeStatu = /allpages/.test(window.location.hash) ? 'AllPages' : 'SinglePage';
  const startTime = `${startYear}-${startMonth}`;
  boundTrackerActions.addTracker(`ClickOrder,${trackerBlankNum},${routeStatu},${startTime}`);
  if (trackerBlankNum > 0) {
    boundConfirmModalActions.showConfirm({
      confirmMessage: (
        <div className="text-center">
          The calendar you are ordering has {trackerBlankNum} blank layout(s).
          <br />
          Do you wish to continue?
        </div>
      ),
      onOkClick: () => {
        // order 时提示有空白页 仍点击 continue 的埋点;
        boundTrackerActions.addTracker(`ClickOrderAndContinue,${trackerBlankNum}`);
        if (setting.get('size') === '7X5' && setting.get('product') === productTypes.LC) {
          boundUpgradeModalActions.showUpgrade(onSaveProjectFun);
          that.isOrdering = false;
        } else {
          onSaveProject(() => {}, () => {
            that.isOrdering = false;
          }).then(() => {
          // order 时提示有空白页 仍点击 continue 且 成功加入购物车 的 埋点;
            boundTrackerActions.addTracker(`ClickOrderAndContinueThenSuccess,${trackerBlankNum}`);
          // 加入购物车.
            redirectToOrder(projectId);
          });
        }
      },
      xCloseFun: () => {
        that.isOrdering = false;
      },
      onCancelClick: () => {
        that.isOrdering = false;
      },
      okButtonText: 'Continue',
      cancelButtonText: 'Cancel'
    });
  } else {
    boundTrackerActions.addTracker(`ClickOrderAndContinue,${trackerBlankNum}`);
    if (setting.get('size') == '7X5' && setting.get('product') == 'LC') {
      boundUpgradeModalActions.showUpgrade(onSaveProjectFun);
      that.isOrdering = false;
    } else {
      onSaveProject(() => {}, () => {
        that.isOrdering = false;
      }).then(() => {
          // order 时提示有空白页 仍点击 continue 且 成功加入购物车 的 埋点;
        boundTrackerActions.addTracker(`ClickOrderAndContinueThenSuccess,${trackerBlankNum}`);
          // 加入购物车.
        redirectToOrder(projectId);
      });
    }
  }
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

export const onSave = (that, onSaveSuccessed, onSaveFailed) => {
  const { actions, data } = that.props;
  const {
    onSaveProject,
    boundTrackerActions,
    boundNotificationActions,
    boundCloneModalActions
  } = actions;
  const { project } = data;
  const orderInfo = project.orderInfo;

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
        <a onClick={boundCloneModalActions && boundCloneModalActions.showCloneModal}>clone</a> it to save
        your additional changes
      </div>
    );

    if (!that.errorMessageNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.errorMessageNode = node)}>
            {errorMessage}
          </div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }

    return Promise.resolve()
  }
  return onSaveProject(onSaveSuccessed, onSaveFailed);
};

export const onClickLogo = (that, goToHome) => {
  const { actions, data } = that.props;
  const { onSaveProject, boundCloneModalActions, boundNotificationActions } = actions;
  const { project } = data;
  const orderInfo = project.orderInfo;


  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions && boundCloneModalActions.showCloneModal}>clone</a> it to save
        your additional changes
      </div>
    );

    if (!that.errorMessageNode) {
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.errorMessageNode = node)}>
            {errorMessage}
          </div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }
  } else {
    onSaveProject(() => {}, null).then(() => {
      if (goToHome && typeof goToHome === 'function') {
        // 0.5秒延迟, 让用户看到保存成功的notification.
        goToHome();
      }
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
