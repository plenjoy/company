import React from 'react';
import qs from 'qs';
import { get } from 'lodash';
import {
  loginPath,
  pageTypes,
  smallViewWidthInMyProjects,
  templateCoverTypes
} from '../../../contants/strings';
import {
  createSpineTextElement,
  createCoverPagePhotoElement
} from '../../../utils/elementHelper';
import { getScreenShot } from '../../../utils/screenshot';
import { autoFill } from './layout';

const addTextElementToSpine = (that, project, text = '') => {
  const containers = project.getIn(['cover', 'containers']);

  if (containers) {
    const spinePage = containers.find(c => c.get('type') === pageTypes.spine);

    if (spinePage) {
      const { boundProjectActions } = that.props;
      const bookSetting = project.get('bookSetting').toJS();
      const fontColor = project.getIn(['variableMap', 'coverForegroundColor']);

      const textElement = createSpineTextElement(
        spinePage,
        bookSetting,
        fontColor,
        text
      );
      return boundProjectActions.createElement(
        spinePage.get('id'),
        textElement
      );
    }

    return Promise.resolve();
  }

  return Promise.resolve();
};

/**
 * 做app的初始化.
 * @param that app组件的this指向.
 */
export const doPrepare = that => {
  const {
    // bound actions
    boundEnvActions,
    boundSpecActions,
    boundQueryStringActions,
    boundFontActions,
    boundProjectActions,
    boundRenderActions,
    boundCapabilitiesActions,
    project
  } = that.props;

  // 获取query string并转换成object对象.
  boundQueryStringActions.parser();

  // FIXME: 需要想办法, 如何使用通过entry打包后的bundle. 而不是直接放在window对象上.
  // 从materials entry中获取素材.
  const coverOriginalMaterials = window._APPMATERIALS;

  // 更新封面的原始素材到store.
  boundRenderActions.setOriginalMaterials(coverOriginalMaterials);

  // 更新素材的状态, 表示素材下载完成.
  boundRenderActions.changeMaterialsStatus(true);

  boundEnvActions.getEnv().then(() => {
    const { env } = that.props;
    const isPreview = env.qs.get('isPreview');
    if (!isPreview) {
      boundFontActions.getFontList();
    }

    boundCapabilitiesActions.initCapabilities();

    const encProjectIdString = project.get('encProjectIdString');

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

export const toggleModal = (boundUploadImagesActions, type, status) => {
  boundUploadImagesActions.toggleUpload(status);
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
    boundConfirmModalActions,
    boundPreviewModalActions,
    boundTemplateActions,
    boundSelectModalActions,
    project,
    fontList,
    translations,
    env
  } = that.props;
  const isFromMyPhoto = env.qs.get('isFromMyPhoto');
  const projectId = project.get('projectId');
  const title = project.get('title');
  const setting = project.get('setting');
  const webClientId = project.get('webClientId');

  // 如果用户在create时, 输入了新的title而不是使用自动生成的title, 那么
  // spineText上就使用用户输入的title. 否则为空显示.
  const defaultTitle = env.qs.get('defaultTitle');
  const spineText = title !== defaultTitle ? title : '';

  if (oldUserInfo !== newUserInfo) {
    if (newUserId === -1) {
      window.onbeforeunload = null;
      window.location = '/sign-in.html';
      return;
    }

    if (projectId !== -1) {
      Promise.all([
        boundProjectActions.getProjectData(
          newUserId,
          projectId,
          webClientId,
          fontList
        ),
        boundProjectActions.getProjectTitle(newUserId, projectId),
        boundEnvActions.getAlbumId(newUserId, projectId),

        // 获取订单的状态.
        boundProjectActions.getProjectOrderedState(newUserId, projectId)
      ]).then(() => {
        boundProjectActions.projectLoadCompleted();
        boundTrackerActions.addTracker('BookLoadComplete');

        // 获取所有cover类型的模板.
        const newSize = that.props.project.getIn(['setting', 'size']);
        templateCoverTypes.forEach(tmplCoverType => {
          boundTemplateActions.getTemplateList(newSize, tmplCoverType);
        });

        // 获取内页的模板.
        // 目前8x8的内页, 需要使用6x6的模板.
        const fixedSize = newSize !== '5X7' ? '6X6' : '5X7';
        boundTemplateActions.getTemplateList(fixedSize, null, false, newSize);
      });
    } else {
      // 获取所有cover类型的模板.
      const promiseArray = [];
      templateCoverTypes.forEach(tmplCoverType => {
        promiseArray.push(
          boundTemplateActions.getTemplateList(
            setting.get('size'),
            tmplCoverType
          )
        );
      });

      // 获取内页的模板.
      // 目前8x8的内页, 需要使用6x6的模板.
      const newSize = setting.get('size');
      const fixedSize = newSize !== '5X7' ? '6X6' : '5X7';
      promiseArray.push(
        boundTemplateActions.getTemplateList(fixedSize, null, false, newSize)
      );

      const { env } = that.props;

      // 拿 myphoto 的照片
      Promise.all(promiseArray)
        .then(() => {
          if (isFromMyPhoto) {
            boundProjectActions.getMyPhotosInfo(newUserId).then(() => {
              const { project } = that.props;
              const imageArray = project.get('imageArray');
              autoFill(that, imageArray.toJS());
            });
          }
        })
        .catch(ex => {
          if (isFromMyPhoto) {
            boundProjectActions.getMyPhotosInfo(newUserId);
          }
        });

      boundPriceActions.getProductPrice(setting.toJS());

      onSaveProject({ props: nextProps }, () => {}, null, true);
    }
  }

  const newProjectId = nextProps.project.get('projectId');
  const newProjectTitle = nextProps.project.get('title');

  if (projectId !== newProjectId) {
    console.log('init project');
    boundEnvActions
      .addAlbum(newUserId, newProjectTitle, newProjectId)
      .then(() => {
        if (projectId === -1) {
          Promise.all([addTextElementToSpine(that, project, spineText)]).then(
            () => {
              boundProjectActions.autoSaveProject(true);
              if (!isFromMyPhoto) {
                boundSelectModalActions.showSelect();
              }
            }
          );
          boundProjectActions.projectLoadCompleted();
          boundTrackerActions.addTracker('BookLoadComplete');
        }
      });
  }
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

function getErrorMessage(errorCode, showCloneModal, openLoginPage) {
  switch (errorCode) {
    case -108: {
      return (
        <div>
          Your current project has ordered or is in the cart. You need to{' '}
          <a onClick={showCloneModal}>clone</a> it to save your additional
          changes
        </div>
      );
    }
    case -111: {
      return (
        <div>
          Your session has timed out. You must log in again to continue.
          Clicking <a onClick={openLoginPage}>log in</a> will open a new window.
          Once successfully log in, you may return to this window to continue
          editing.
        </div>
      );
    }

    default:
      return 'Project save failed! Please try again later.';
  }
}

export function onSaveProject(
  that,
  onSaveSuccessed,
  onSaveFailed,
  isFirstTime = false,
  isUploadCoverImg = true,
  nextProps = null
) {
  const {
    boundProjectActions,
    boundNotificationActions,
    boundAlertModalActions,
    boundCloneModalActions,
    boundTrackerActions,
    boundGlobalLoadingActions,
    project,
    env,
    spec
  } = nextProps || that.props;
  const { userInfo } = env;
  const orderStatus = project.get('orderStatus');
  const specVersion = spec.version;

  // 每次保存的时候发送一次同步删除图片的请求，不需要等待响应
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');
  if (!isInCartOrOrdered) {
    boundProjectActions.deleteServerPhotos();
  }
  return boundProjectActions.saveProject(project, userInfo, specVersion).then(
    res => {
      const isRequestSuccess = get(res, 'status') === 'success';

      if (isRequestSuccess) {
        const promise = new Promise((resolve, reject) => {
          const guid = +get(res, 'data.guid');

          if (project.get('projectId') === -1 && guid) {
            boundProjectActions.updateProjectId(guid);
            window.history.replaceState(
              {},
              'PhotoBook',
              `?${qs.stringify({
                initGuid: guid
              })}`
            );
          }
          if (guid) {
            //  保存成功时 埋点;
            boundTrackerActions.addTracker('SaveComplete,success');
            if (onSaveSuccessed && typeof onSaveSuccessed === 'function') {
              onSaveSuccessed();
              if (!isUploadCoverImg) {
                resolve();
              }
            } else {
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

            if (isUploadCoverImg) {
              getScreenShot('.screenshot canvas', isFirstTime).then(url => {
                boundProjectActions.uploadCoverImage(guid, url).then(
                  () => {
                    resolve();
                  },
                  () => {
                    reject();
                  }
                );
              });
            } else {
              resolve();
            }
          }
        });

        return promise;
      }
      //  保存失败时 埋点;
      boundTrackerActions.addTracker('SaveComplete,failed');

      if (project.get('projectId') === -1) {
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
        const errorMessage = getErrorMessage(
          errorCode,
          boundCloneModalActions.showCloneModal,
          openLoginPage.bind(that, that)
        );

        if (onSaveFailed && typeof onSaveFailed === 'function') {
          onSaveFailed();
        } else if (!that.errorMessageNode) {
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

      boundGlobalLoadingActions.hide();

      return Promise.reject();
    }
  );
}

export function onCloneProject(that, newTitle, onCloneSuccessed) {
  const {
    boundProjectActions,
    boundNotificationActions,
    boundCloneModalActions,
    project,
    env,
    spec
  } = that.props;
  const { userInfo } = env;
  const specVersion = spec.get('version');

  boundProjectActions
    .cloneProject(project, userInfo, specVersion, newTitle)
    .then(res => {
      const isRequestSuccess = get(res, 'status') === 'success';

      if (isRequestSuccess) {
        const guid = +get(res, 'data.guid');
        if (guid) {
          boundProjectActions.changeProjectTitle(newTitle);

          boundProjectActions.updateProjectId(guid);
          boundProjectActions.resetProjectInfo();
          boundProjectActions.resetProjectOrderedState();

          // TODO: 需要更新albumId
          window.history.replaceState(
            {},
            'PhotoBook',
            `?${qs.stringify({
              initGuid: guid
            })}`
          );

          getScreenShot('.screenshot canvas', true).then(url => {
            boundProjectActions.uploadCoverImage(guid, url).then(() => {
              if (onCloneSuccessed) {
                onCloneSuccessed();
              } else if (!that.clonedProjectSuccessNode) {
                boundNotificationActions.addNotification({
                  children: (
                    <div ref={node => (that.clonedProjectSuccessNode = node)}>
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
      } else {
        const errorCode = +get(res, 'errorCode');
        const errorMessage = getErrorMessage(
          errorCode,
          boundCloneModalActions.showCloneModal,
          openLoginPage.bind(that, that)
        );

        if (!that.projectClonedFailedNode) {
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
      }
    });
}

export const checkIsEditPage = () => {
  const href = window.location.href;

  return /editpage/i.test(href) || !/#\//i.test(href);
};
