import React from 'react';
import qs from 'qs';
import cookie from 'react-cookies';
import { get, merge, isEmpty } from 'lodash';
import {
  loginPath,
  DEFAULT_THEME_NAME,
  HAS_SHOW_GET_STARTED_KEY
} from '../../../contants/strings';
import { getScreenShot } from '../../../utils/screenshot';
import projectParser from '../../../../../common/utils/projectParser';
import { getPxByInch } from '../../../../../common/utils/math';
import { codesOfSaveProject } from '../../../../../common/utils/errorCodes';

import {
  getInnerSheetSize,
  getInnerPageSize,
  getCoverSheetSize
} from '../../../utils/sizeCalculator';

const showIntro = that => {
  const hasShowGetStarted = !!cookie.load(HAS_SHOW_GET_STARTED_KEY);

  // 如果没有显示新手指引. 就显示第一次.
  if (!hasShowGetStarted) {
    // 显示新手指引.
    that.showIntroModal();

    // 过期为2星期.
    const expires = new Date();
    expires.setDate(expires.getDate() + 14);

    // 更新cookie.
    cookie.save(HAS_SHOW_GET_STARTED_KEY, true, {
      expires,

      // https
      secure: true
    });
  }
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
    boundThemeStickerActions,
    boundFontActions,
    boundProjectActions,
    boundCapabilitiesActions,
    boundRenderActions,
    project
  } = that.props;
  const { property } = project;
  const isParentBook = property.get('isParentBook');

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

    // 初始化权限.
    boundCapabilitiesActions.initCapabilities();

    const encProjectIdString = property.get('encProjectIdString');

    if (encProjectIdString) {
      boundSpecActions.getSpecData().then(() => {
        boundProjectActions
          .getPreviewProjectData(encProjectIdString, isParentBook)
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

  // 设置app节点的样式, 以方便在PC和移动设备上显示.
  const appStyle = that.getAppStyle();
  that.setState({ appStyle });
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
    boundTemplateActions,
    boundPriceActions,
    boundTrackerActions,
    boundConfirmModalActions,
    boundThemeActions,
    boundXtroActions,
    project,
    system,
    settings,
    translations,
    capabilities,
    boundThemeStickerActions,
    env
  } = that.props;

  const { property, setting } = project;

  const projectId = property.get('projectId');
  const bookThemeId = property.get('bookThemeId');
  const applyBookThemeId = property.get('applyBookThemeId') || bookThemeId;
  const isParentBook = property.get('isParentBook');
  const title = property.get('title');

  if (oldUserInfo !== newUserInfo) {
    if (newUserId === -1) {
      window.onbeforeunload = null;
      window.location = '/sign-in.html';
      return;
    }

    // 取得booktheme的开启状态
    boundThemeActions.getBookThemeStatus();

    // 获取theme的categories.
    boundThemeActions.getThemeCategories().then(() => {
      const { themesCategories } = that.props;
      if (themesCategories && themesCategories.size) {
        const defaultCategory = themesCategories.find(type => {
          return String(type.get('code')).toUpperCase() === DEFAULT_THEME_NAME;
        });
        if (defaultCategory) {
          const defaultThemeType = defaultCategory.get('code');
          const product = get(settings, 'spec.product');
          const size = get(settings, 'spec.size');
          // 默认 currentthemeType
          boundThemeActions.setThemeType(defaultThemeType);

          if (product && size) {
            boundThemeActions.getThemes({
              themeType: defaultThemeType,
              product,
              size,
              pageNumber: 1,
              pageSize: 10000
            });
          }
        }
      }
    });

    if (applyBookThemeId) {
      boundThemeActions.getBackgrounds({
        themeGuid: applyBookThemeId,
        pageNumber: 0,
        pageSize: 10000
      });
      boundThemeStickerActions.getThemeStickerList('', applyBookThemeId);
    }

    if (projectId !== -1) {
      Promise.all([
        boundProjectActions.getProjectData(projectId),
        boundProjectActions.getProjectTitle(projectId),
        boundProjectActions.getOrderInfo(projectId),
        boundEnvActions.getAlbumId(newUserId, projectId),

        // 检查是否有parentbook.
        boundProjectActions.hasParentBook(newUserId, projectId)
      ]).then(() => {
        boundProjectActions.projectLoadCompleted();
        const settings = that.props.settings;
        const size = get(settings, 'spec.size');
        const cover = get(settings, 'spec.cover');
        boundTrackerActions.addTracker(
          `BookLoadComplete,${projectId},${cover},${size},已有`
        );

        if (isParentBook) {
          // 项目加载完成后, 判断是不是parentbook, 如果是, 那么就弹出提示框.
          boundConfirmModalActions.showConfirm({
            confirmTitle: get(translations, 'App.CONFIRM_PARENT_BOOK_TITLE'),
            okButtonText: get(translations, 'App.CONFIRM_PARENT_BOOK_BTN'),
            cancelButtonText: '',
            confirmMessage: get(translations, 'App.CONFIRM_PARENT_BOOK_BODY'),
            onOkClick: boundConfirmModalActions.hideConfirm,
            onCancelClick: () => {},
            xCloseFun: boundConfirmModalActions.hideConfirm
          });
        }
      });
    } else if (bookThemeId) {
      const themeCode = nextProps.env.qs.get('themeCode');
      Promise.all([
        boundProjectActions.getBookThemeProjectData(bookThemeId),
        boundEnvActions.addAlbum(newUserId, themeCode)
      ]).then(() => {
        Promise.all([
          boundEnvActions.getAlbumIdByThemeCode(newUserId, themeCode),
          boundProjectActions.getBookThemeImages(newUserId, themeCode),
          // 去封面模板
          boundTemplateActions.getTemplateList(
            newUserId,
            setting.get('size'),
            setting.get('cover'),
            setting.get('product')
          ),
          // 取内页模板
          boundTemplateActions.getTemplateList(
            newUserId,
            setting.get('size'),
            setting.get('cover'),
            setting.get('product'),
            false
          )
        ]).then(() => {
          if (
            capabilities &&
            capabilities.getIn(['base', 'isDisableAutoLayout'])
          ) {
            boundProjectActions.changeBookSetting({
              autoLayout: false
            });
          }
          boundProjectActions.projectLoadCompleted();
        });
      });
    } else {
      // 取封面模板
      boundTemplateActions
        .getTemplateList(
          newUserId,
          setting.get('size'),
          setting.get('cover'),
          setting.get('product')
        )
        .then(() => {
          // 取内页模板
          boundTemplateActions.getTemplateList(
            newUserId,
            setting.get('size'),
            setting.get('cover'),
            setting.get('product'),
            false
          );
        });
      boundPriceActions.getProductPrice(setting.toJS()).then(res => {
        if (res && res.data && res.data.main && res.data.main.couponId) {
          boundPriceActions.getCouponDetail(res.data.main.couponId);
        }
      });
      // console.log(env.qs.toJS())
      const isFromMyPhoto = env.qs.get('isFromMyPhoto');
      // 拿myphoto图片
      if (isFromMyPhoto) {
        boundProjectActions.getMyPhotosInfo(newUserId);
      }
      const settings = that.props.settings;
      const size = get(settings, 'spec.size');
      const cover = get(settings, 'spec.cover');
      boundTrackerActions.addTracker(
        `BookLoadComplete,${projectId},${cover},${size},新建`
      );

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
          // 显示新手指引.
          showIntro(that);
          boundProjectActions.projectLoadCompleted();
          boundTrackerActions.addTracker('BookLoadComplete');
        }
      });
  }

  const oldApplyThemeId = get(that.props, 'project.property').get(
    'applyBookThemeId'
  );
  const newApplyThemeId = get(nextProps, 'project.property').get(
    'applyBookThemeId'
  );
  // 针对设计师 bookThemeId就是当前的projectid
  const newBookThemeId = get(nextProps, 'project.property').get('bookThemeId');

  const oldIsProjectLoadCompleted = get(that.props, 'project.property').get(
    'isProjectLoadCompleted'
  );
  const newIsProjectLoadCompleted = get(nextProps, 'project.property').get(
    'isProjectLoadCompleted'
  );

  if (oldApplyThemeId !== newApplyThemeId && newApplyThemeId) {
    boundThemeActions.getTypecodeByThemeid(newApplyThemeId).then(res => {
      if (res.data) {
        boundThemeActions.setThemeType(res.data);
      }
    });
  }

  if (oldIsProjectLoadCompleted !== newIsProjectLoadCompleted) {
    // 针对普通模式 根据applybookthemeid获取sticker list
    // 针对设计师模式 根据bookthemeid获取sticker list
    if (newApplyThemeId || newBookThemeId) {
      boundThemeStickerActions.getThemeStickerList(
        '',
        newApplyThemeId || newBookThemeId
      );
    } else {
      boundThemeStickerActions.getThemeStickerList('everyday', '');
    }
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
    case codesOfSaveProject.projectInOrder: {
      return (
        <div>
          Your current project has been ordered or is in the cart. You need to{' '}
          <a onClick={showCloneModal}>clone</a> it to save your additional
          changes
        </div>
      );
    }
    case codesOfSaveProject.sessionTimeout: {
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
  const { property } = project;
  const orderStatus = project.orderInfo;

  // 每次保存的时候发送一次同步删除图片的请求，不需要等待响应
  const isInCartOrOrdered =
    orderStatus &&
    orderStatus.get('ordered') &&
    !orderStatus.get('checkFailed');
  if (!isInCartOrOrdered) {
    boundProjectActions.deleteServerPhotos();
  }

  if (property.get('bookThemeId')) {
    return boundProjectActions
      .saveBookThemeProject(project, userInfo, specVersion)
      .then(res => {
        const isRequestSuccess = get(res, 'success');

        const guid = get(res, 'themeGuid');

        if (isRequestSuccess) {
          if (onSaveSuccessed) {
            onSaveSuccessed();
          } else {
            boundNotificationActions.addNotification({
              message: 'Project saved successfully!',
              level: 'success',
              autoDismiss: 2
            });
          }
          if (guid) {
            window.history.replaceState(
              {},
              'PhotoBook',
              `?${qs.stringify({
                themeGuid: guid,
                source: 'designer'
              })}`
            );
          }
        } else {
          boundNotificationActions.addNotification({
            message: 'Project save failed! Please try again later.',
            level: 'error',
            autoDismiss: 0
          });
        }
      });
  }

  return boundProjectActions.saveProject(project, userInfo, specVersion).then(
    res => {
      const isRequestSuccess = get(res, 'status') === 'success';

      if (isRequestSuccess) {
        const promise = new Promise((resolve, reject) => {
          //  保存成功时 埋点;
          boundTrackerActions.addTracker('SaveComplete,success');

          const guid = +get(res, 'data.guid');

          if (property.get('projectId') === -1 && guid) {
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
            getScreenShot('.screenshot canvas', isFirstTime).then(url => {
              boundProjectActions.uploadCoverImage(url).then(
                () => {
                  resolve();
                },
                () => {
                  reject();
                }
              );
            });
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
        const errorMessage = getErrorMessage(
          errorCode,
          boundCloneModalActions.showCloneModal,
          openLoginPage.bind(that, that)
        );

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
    boundCloneModalActions,
    boundTrackerActions,
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
      const oldProjectId = project.property.get('projectId');
      const isInOrder = project.orderInfo.get('isOrdered');
      if (isRequestSuccess) {
        const guid = +get(res, 'data.guid');
        if (guid) {
          boundProjectActions.changeProjectTitle(newTitle);

          boundProjectActions.updateProjectId(guid);
          boundProjectActions.clearOrderInfo();
          boundTrackerActions.addTracker(
            `ClickCloneAndDone,${oldProjectId},${guid},${isInOrder}`
          );

          // TODO: 需要更新albumId
          window.history.replaceState(
            {},
            'PhotoBook',
            `?${qs.stringify({
              initGuid: guid
            })}`
          );

          getScreenShot('.screenshot canvas').then(url => {
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

export const listSpecData = that => {
  const { settings, spec } = that.props;
  const {
    configurableOptionArray,
    allOptionMap,
    parameterArray,
    disableOptionArray
  } = spec;

  const convertParametersUnit = parameterMap => {
    if (!isEmpty(parameterMap)) {
      const { bookCoverBaseSize, bookInnerBaseSize } = parameterMap;
      const outObj = merge({}, parameterMap);
      outObj.bookCoverBaseSize = {
        height: getPxByInch(bookCoverBaseSize.heightInInch),
        width: getPxByInch(bookCoverBaseSize.widthInInch)
      };

      outObj.bookInnerBaseSize = {
        height: getPxByInch(bookInnerBaseSize.heightInInch),
        width: getPxByInch(bookInnerBaseSize.widthInInch)
      };
      return outObj;
    }
    return null;
  };

  const isPressBook = settings.spec.product === 'PS';

  if (Object.keys(spec).length) {
    const availableOptionMap = projectParser.getAvailableOptionMap(
      settings.spec,
      configurableOptionArray,
      allOptionMap,
      disableOptionArray
    );
    const sizeMap = availableOptionMap.size;
    const resultList = [];

    const filterSizeMap = sizeMap;

    filterSizeMap.forEach(sizeObj => {
      const oldSetting = settings.spec;
      const newSetting = Object.assign({}, settings.spec, {
        size: sizeObj.id
      });

      const newSettingObj = projectParser.getNewProjectSetting(
        oldSetting,
        newSetting,
        configurableOptionArray,
        allOptionMap
      );

      const parameterMap = projectParser.getParameters(
        newSettingObj,
        parameterArray
      );

      const convertedParameterMap = convertParametersUnit(parameterMap);
      const calculateInnerPageSize = isPressBook
        ? getInnerPageSize
        : getInnerSheetSize;

      const {
        bookCoverBaseSize,
        bookInnerBaseSize,
        innerPageBleed,
        coverPageBleed,
        coverExpandingSize,
        spineWidth
      } = convertedParameterMap;

      const innerSize = calculateInnerPageSize(
        bookInnerBaseSize,
        innerPageBleed
      );
      const coverSize = getCoverSheetSize(
        bookCoverBaseSize,
        coverPageBleed,
        coverExpandingSize,
        spineWidth
      );

      resultList.push({
        product: newSettingObj.product,
        size: newSettingObj.size,
        cover: newSettingObj.cover,
        coverWidth: coverSize.width,
        coverHeight: coverSize.height,
        innerWidth: innerSize.width,
        innerHeight: innerSize.height
      });
    });

    console.table(resultList);
  }
};
