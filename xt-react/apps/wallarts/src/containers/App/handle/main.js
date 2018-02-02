import React from 'react';
import { coverTypes, loginPath } from '../../../constants/strings';
import { get, merge, isEmpty } from 'lodash';
import { getScreenShot } from '../../../utils/screenshot';
import qs from 'qs';
import { codesOfSaveProject } from '../../../../../common/utils/errorCodes';

export const doPrepare = that => {
  const {
    boundEnvActions,
    boundSpecActions,
    boundQueryStringActions,
    boundProjectActions,
    project,
    boundCapabilitiesActions,
    boundFontActions,
    boundMaterialActions
  } = that.props;

  // 获取query string并转换成object对象.
  boundQueryStringActions.parser();

  // 从materials entry中获取素材.
  // const coverOriginalMaterials = window._APPMATERIALS;

  // 更新封面的原始素材到store.

  // boundMaterialActions.setOriginalMaterials(coverOriginalMaterials);

  // 更新素材的状态, 表示素材下载完成.
  boundMaterialActions.changeMaterialsStatus(true);

  boundEnvActions.getEnv().then(() => {
    const { env } = that.props;
    const isPreview = env.qs.get('isPreview');
    if (!isPreview) {
      // boundFontActions.getFontList();
    }
    // 初始化权限.
    boundCapabilitiesActions.initCapabilities();

    const encProjectIdString = project.property.get('encProjectIdString');
    if (encProjectIdString) {
      boundSpecActions.getSpecData().then(() => {
        boundProjectActions
          .getPreviewProjectData(encProjectIdString)
          .then(() => {
            boundProjectActions.projectLoadCompleted();
          });
      });
    } else {
      boundSpecActions.getSpecData().then(() => {
        boundEnvActions.getUserInfo();
      });
    }
  });
};

export function doUserThings(that, nextProps) {
  const oldUserInfo = that.props.env.userInfo;
  const newUserInfo = nextProps.env.userInfo;
  const newUserId = newUserInfo.get('id');

  const {
    boundProjectActions,
    boundEnvActions,
    boundPriceActions,
    boundTrackerActions,
    project
  } = that.props;

  const { property, setting } = project;

  const projectId = property.get('projectId');
  const title = property.get('title');
  const produtType = setting.get('product');

  if (oldUserInfo !== newUserInfo) {
    if (newUserId === -1) {
      window.onbeforeunload = null;
      window.location = '/sign-in.html';
      return;
    }

    if (projectId !== -1) {
      Promise.all([
        boundProjectActions.getProjectData(projectId),
        boundProjectActions.getProjectTitle(projectId),
        boundProjectActions.getOrderInfo(projectId),
        boundEnvActions.getAlbumId(newUserId, projectId)
      ]).then(() => {
        boundProjectActions.projectLoadCompleted();
        boundTrackerActions.addTracker('LoadComplete');
      });
    } else {
      boundPriceActions.getProductPrice(setting.toJS());
      boundTrackerActions.addTracker('LoadComplete');

      onSaveProject({ props: nextProps }, () => {}, null, true);
    }
  }

  const newProjectId = nextProps.project.property.get('projectId');
  const newProjectTitle = nextProps.project.property.get('title');

  if (projectId !== newProjectId) {
    console.log('init project');
    boundEnvActions
      .addAlbum(newUserId, newProjectTitle, newProjectId)
      .then(() => {
        if (projectId === -1) {
          boundProjectActions.projectLoadCompleted();
          boundTrackerActions.addTracker('BookLoadComplete');
        }
      });
  }
}

export const toggleModal = (boundUploadImagesActions, type, status) => {
  boundUploadImagesActions.toggleUpload(status);
};

export function onSaveProject(
  that,
  onSaveSuccessed,
  onSaveFailed,
  isFirstTime = false,
  isShowNotification = true
) {
  const {
    boundProjectActions,
    boundNotificationActions,
    boundAlertModalActions,
    boundCloneModalActions,
    boundTrackerActions,
    project,
    env,
    spec
  } = that.props;

  // 每次保存的时候发送一次同步删除图片的请求，不需要等待响应
  const orderStatus = project.orderInfo;
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');
  if (!isInCartOrOrdered) {
    boundProjectActions.deleteServerPhotos();
  }

  return boundProjectActions.saveProject().then(
    (res) => {
        const isRequestSuccess = get(res, 'status') === 'success';

        if (isRequestSuccess) {
          const promise = new Promise((resolve, reject) => {
            //  保存成功时 埋点;
            boundTrackerActions.addTracker('SaveComplete,success');

            const guid = +get(res, 'data.guid');

            if (project.property.get('projectId') === -1 && guid) {
              boundProjectActions.updateProjectId(guid);
              window.history.replaceState(
                {},
                'Wallarts',
                `?${qs.stringify({
                  initGuid: guid
                })}`
              );
            }
            if (guid) {
              if (onSaveSuccessed && typeof onSaveSuccessed === 'function') {
                onSaveSuccessed();
              } else if (isShowNotification) {
                if (!that.projectSaveSuccessNode) {
                  boundNotificationActions.addNotification({
                    children: (
                      <div ref={node => (that.projectSaveSuccessNode = node)}>
                        Project saved successfully!
                      </div>
                    ),
                    level: 'success',
                    autoDismiss: 2
                  });
                }
                // resolve();
              }

            getScreenShot('.book-cover-screenshot canvas', isFirstTime)
              .then(url => {
                boundProjectActions.uploadCoverImage(url).then(() => {
                      resolve();
                    },
                    () => {
                  reject();
                });
              })
              .catch(err => {
                      resolve();
                }
              );
            }
          });

          return promise;
        }
        //  保存失败时 埋点;
        boundTrackerActions.addTracker('SaveComplete,failed');

        if (onSaveFailed && typeof onSaveFailed === 'function') {
          onSaveFailed();
        }

        if (project.property.get('projectId') === -1) {
          boundAlertModalActions.showAlertModal({
            title: 'Error',
            message:
              'We are so apologize that something error occurred,' +
              ' please try again later',
            escapeClose: false,
            isHideIcon: true,
            onButtonClick: () => {
              window.onbeforeunload = null;
              window.location = '/create.html';
            }
          });
        } else {
          const errorCode = +get(res, 'errorCode');
          let errorMessage = 'Project save failed! Please try again later.';

          // Project在购物车或者订单中
          // if (codesOfSaveProject.projectInOrder === errorCode) {
          //   errorMessage = (
          //     <div>
          //       Your current project has ordered or is in the cart. You need to{' '}
          //       <a onClick={boundCloneModalActions.showCloneModal}>clone</a> it to
          //       save your additional changes
          //     </div>
          //   );
          // }

          // session 失效
          if (codesOfSaveProject.sessionTimeout === errorCode) {
            errorMessage = (
              <div>
                Your session has timed out. You must log in again to continue.
                Clicking <a onClick={openLoginPage.bind(that, that)}>log in</a>{' '}
                will open a new window. Once successfully log in, you may return
                to this window to continue editing.
              </div>
            );
          }

          if (isShowNotification) {
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
          }
        }

        return Promise.reject();
      },
      () => {
        if (!that.networkDisconnectNode) {
          boundNotificationActions.addNotification({
            children: (
              <div ref={node => (that.networkDisconnectNode = node)}>
                No interenet connection, please check your network and try
                again.{' '}
              </div>
            ),
            level: 'error',
            autoDismiss: 0
          });
        }

        return Promise.reject();
      }
    )
}

export function onCloneProject(that, newTitle, onCloneSuccessed) {
  const {
    boundProjectActions,
    boundNotificationActions,
    project,
    env,
    spec
  } = that.props;
  const { userInfo } = env;
  const specVersion = spec.version;

  boundProjectActions.cloneProject(newTitle).then(res => {
    const isRequestSuccess = get(res, 'status') === 'success';

    if (isRequestSuccess) {
      const guid = +get(res, 'data.guid');
      if (guid) {
        boundProjectActions.changeProjectTitle(newTitle);

        boundProjectActions.updateProjectId(guid);
        boundProjectActions.clearOrderInfo();

        // TODO: 需要更新albumId
        window.history.replaceState(
          {},
          'Wallarts',
          `?${qs.stringify({
            initGuid: guid
          })}`
        );

        getScreenShot('.book-cover-screenshot canvas').then(url => {
          boundProjectActions.uploadCoverImage(url).then(() => {
            if (onCloneSuccessed) {
              onCloneSuccessed();
            } else if (!that.projectClonedSuccessNode) {
              boundNotificationActions.addNotification({
                children: (
                  <div ref={node => (that.projectClonedSuccessNode = node)}>
                    Project cloned successfully!
                  </div>
                ),
                level: 'success',
                autoDismiss: 2
              });
            }
          });
        });
      }
    } else if (!that.projectClonedFailedNode) {
      const errorCode = +get(res, 'errorCode');
      let errorMessage = 'Project clone failed! Please try again later.';

      // session 失效
      if (codesOfSaveProject.sessionTimeout === errorCode) {
        errorMessage = (
          <div>
            Your session has timed out. You must log in again to continue.
            Clicking <a onClick={openLoginPage.bind(that, that)}>log in</a> will
            open a new window. Once successfully log in, you may return to this
            window to continue editing.
          </div>
        );
      }
      boundNotificationActions.addNotification({
        children: (
          <div ref={node => (that.projectClonedFailedNode = node)}>
            {errorMessage}
          </div>
        ),
        level: 'error',
        autoDismiss: 0
      });
    }
  });
}

export function loadMainProjectImages(that) {
  const { boundProjectActions, project } = that.props;
  const mainProjectUid = project.property.get('mainProjectUid');
  const crossSellMainEncImgId = project.property.get('crossSellMainEncImgId');
  boundProjectActions
    .loadMainProjectImages(mainProjectUid, crossSellMainEncImgId)
    .then(imageArray => {
      that.autoFill(imageArray, false).then(() => {
        boundProjectActions.changeProjectProperty({
          shouldSaveProjectAfterCrossSell: true
        });
      });
    });
}

export function openLoginPage(that) {
  const { boundNotificationActions } = that.props;

  // 移除所有的notification
  boundNotificationActions.clearNotification();

  window.onbeforeunload = null;
  window.open(loginPath, 'newwindow');
  setTimeout(() => {
    window.onbeforeunload = () =>
      'Unsaved changes(If any) will be discarded. Are you sure to exit?';
  }, 0);
}
