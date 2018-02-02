import React from 'react';
import { redirectToOrder } from '../../../utils/order';

export const onPreview = (that) => {
  const { actions } = that.props;
  const { boundPreviewModalActions } = actions;
  boundPreviewModalActions.show();
};

/**
 * 点击order按钮时的处理函数
 * @param that 组件的this指向.
 */
export const onOrder = (that) => {
  if (that.isOrdering) return;
  that.isOrdering = true;
  const { actions, data } = that.props;
  const { project } = data;
  const projectId = project.property.get('projectId');
  const orderInfo = project.orderInfo;
  const {
    onSaveProject,
    boundNotificationActions,
    boundCloneModalActions,
    boundConfirmModalActions,
    boundTrackerActions
  } = actions;
  boundTrackerActions.addTracker('ClickOrder');
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions && boundCloneModalActions.showCloneModal}>clone</a> it to save
        <br/>your additional changes
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
  project.pageArray.present.forEach((item) => {
    item.toJS().elements.forEach((element) => {
      if (element.type === 'PhotoElement' && !element.encImgId) {
        trackerBlankNum++;
      }
    });
  });
  if (trackerBlankNum > 0) {
    const noPhotoMessage = (
      <div>
        Please drag and drop your photo onto the canvas before placing your order.
      </div>
    );
    boundNotificationActions.addNotification({
      children: (
        <div ref={node => (that.noPhotoMessage = node)}>
          {noPhotoMessage}
        </div>
      ),
      level: 'error',
      autoDismiss: 0
    });
    that.isOrdering = false;
  } else {
    onSaveProject(()=>{},()=>{
      that.isOrdering = false;
    }).then(() => {
      redirectToOrder(projectId);
    }, () => {
      that.isOrdering = false;
    });
  }
};

export const onSave = (that) => {
  const { actions, data } = that.props;
  const { project } = data;
  const {
    onSaveProject,
    boundNotificationActions,
    boundCloneModalActions,
    boundTrackerActions
  } = actions;
  boundTrackerActions.addTracker('ClickSave');
  const orderInfo = project.orderInfo;
  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  // 点击 save 的埋点;
  //boundTrackerActions.addTracker('ClickSave');
  if (isInCartOrOrdered) {
    const errorMessage = (
      <div>
        Your current project has been ordered or is in the cart. You need to{' '}
        <a onClick={boundCloneModalActions && boundCloneModalActions.showCloneModal}>clone</a> it to save
        <br/>your additional changes
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

    return;
  }
  onSaveProject(null,()=>{},false,true);
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


export const onClickLogo = (that, goToHome) => {
  const { actions, data } = that.props;
  const { onSaveProject, boundCloneModalActions, boundNotificationActions } = actions;
  const { project } = data;
  const orderInfo = project.orderInfo;


  const isInCartOrOrdered =
    orderInfo && orderInfo.get('isOrdered') && !orderInfo.get('isCheckFailed');

  if(isInCartOrOrdered){

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
  }else{
    onSaveProject(null, null).then(() => {
      if (goToHome && typeof goToHome === 'function') {
        // 0.5秒延迟, 让用户看到保存成功的notification.
        goToHome();
      }
    });
  }

};
