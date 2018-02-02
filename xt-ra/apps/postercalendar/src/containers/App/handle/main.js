import qs from 'qs';
import React from 'react';
import { get } from 'lodash';
import {
  convertResultToJson,
  formatTemplateInstance
} from '../../../utils/template';
import { getScreenShot } from '../../../utils/screenshot';
import { loginPath, templateTypes } from '../../../constants/strings';
import { codesOfSaveProject } from '../../../../../common/utils/errorCodes';

export const doPrepare = that => {
  const {
    boundEnvActions,
    boundSpecActions,
    boundQueryStringActions,
    boundProjectActions,
    project,
    boundCapabilitiesActions,
    boundFontActions
  } = that.props;

  const { setting } = project;

  // 获取query string并转换成object对象.
  boundQueryStringActions.parser();

  boundEnvActions.getEnv().then(() => {
    const { env } = that.props;
    const isPreview = env.qs.get('isPreview');
    if (!isPreview) {
      boundFontActions.getFontList();
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
    boundTemplateActions,
    boundPriceActions,
    boundTrackerActions,
    boundConfirmModalActions,
    project,
    translations,
    boundStyleActions
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
      boundStyleActions.getStyleList(setting.get('size'), produtType);
      boundTemplateActions.getTemplateList(
        newUserInfo.get('id'),
        setting.get('size'),
        templateTypes[produtType]
      );

      boundPriceActions.getProductPrice(setting.toJS());
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

export const applyDefaultTemplateToPage = (that, temGuid, isCover = false) => {
  const { boundProjectActions, boundTemplateActions, project } = that.props;
  const { setting } = project;
  const size = setting.get('size');
  boundTemplateActions.getTemplateInfo(temGuid, size).then(response => {
    const templateId = `${temGuid}_${size}`;
    const results = convertResultToJson(response);
    // 格式化template的原始数据, 使它可以在app中可以使用的格式
    const newTemplates = formatTemplateInstance(results, [temGuid], size);
    if (isCover) {
      boundProjectActions.applyDefaultTemplateToCover(
        newTemplates[0][templateId]
      );
    } else {
      boundProjectActions.applyDefaultTemplateToPages(
        newTemplates[0][templateId]
      );
    }
  });
};

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

  const { userInfo } = env;
  const specVersion = spec.version;

  return boundProjectActions.saveProject(project, userInfo, specVersion).then(
    res => {
      const isRequestSuccess = get(res, 'status') === 'success';
      if (isRequestSuccess) {
        const promise = new Promise((resolve, reject) => {
          //  保存成功时 埋点;
          boundTrackerActions.addTracker('SaveComplete,success');
          boundProjectActions.deleteServerPhotos();

          const guid = +get(res, 'data.guid');

          if (project.property.get('projectId') === -1 && guid) {
            boundProjectActions.updateProjectId(guid);
            window.history.replaceState(
              {},
              'calendar',
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
              resolve();
            }
            getScreenShot('.book-cover-screenshot canvas', isFirstTime).then(
              url => {
                boundProjectActions.uploadCoverImage(url).then(
                  () => {
                    resolve();
                  },
                  () => {
                    reject();
                  }
                );
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
              No interenet connection, please check your network and try again.
            </div>
          ),
          level: 'error',
          autoDismiss: 0
        });
      }

      return Promise.reject();
    }
  );
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

  boundProjectActions
    .cloneProject(project, userInfo, specVersion, newTitle)
    .then(res => {
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
            'PhotoBook',
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
        boundNotificationActions.addNotification({
          children: (
            <div ref={node => (that.projectClonedFailedNode = node)}>
              Project clone failed! Please try again later.
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
