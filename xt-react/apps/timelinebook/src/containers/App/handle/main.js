import qs from 'qs';
import React from 'react';
import { is } from 'immutable';
import { get } from 'lodash';
import { coverTypes } from '../../../constants/strings';
import { getScreenShot } from '../../../utils/screenshot';

export const doPrepare = (that) => {
  const {
    boundEnvActions,
    boundSpecActions,
    boundQueryStringActions,
    boundRatioActions,
    boundProjectsActions,
    boundConfirmModalActions
  } = that.props;

  const materials = window._APPMATERIALS;

  changePageTitle();

  // 获取query string并转换成object对象.
  boundQueryStringActions.parser();
  boundEnvActions.getEnv();

  cleanLocationUrl();
  // 创建全局图片和promise并发控制线程池
  window.imagePool = initImagePool(5);
  window.promisePool = initPromisePool(5);
};

export function onSpecChange(nextProps) {
  const { currentSpec: oldCurrentSpec } = this.props;
  const { currentSpec: newCurrentSpec } = nextProps;

  if(newCurrentSpec && !is(oldCurrentSpec, newCurrentSpec)){
    this.onResize(nextProps);
  }
}

export async function perpareSystem (nextProps) {
  const { urls: oldUrls } = this.props.env;
  const { urls: newUrls } = nextProps.env;

  if(newUrls && !is(oldUrls, newUrls)) {
    const { boundEnvActions, boundProjectsActions, boundPreviewModalActions } = nextProps;
    const { qs } = nextProps.env;
    const [TLBSC, TLBHC] = await fetchAllSpecs(this);

    if(!qs.get('isPreview')) {
      const {userSessionData: response} = await boundEnvActions.getUserInfo();
      boundProjectsActions.changeSummary(TLBSC.data.spec);

      if(response.status.code === '400') {
        showLoginDialog(this);
      }
    } else {
      await boundProjectsActions.getPreviewProject();
      boundPreviewModalActions.showPreviewModal();
    }
  }
};

function fetchAllSpecs(that) {
  const { boundSpecActions } = that.props;

  return Promise.all([
    boundSpecActions.getSpec(coverTypes.TLBSC, '6X6'),
    boundSpecActions.getSpec(coverTypes.TLBHC, '6X6')
  ]);
}

function changePageTitle() {
  const title = document.querySelector('title');
  // const keywords = document.querySelector('meta[name=keywords]');
  // const description = document.querySelector('meta[name=description]');

  title.innerText = 'Zno - Make Little Timeline Book';
  // keywords['content'] = 'Zno - Make Little Timeline Book';
  // description['content'] = 'Zno - Make Little Timeline Book';
}

function cleanLocationUrl() {
  let validQueryKeys = ['initGuid', 'source', 'isPreview'];
  let queryObj = qs.parse(window.location.search.replace(/^\?/g, ''));
  let oldQueryStr = window.location.search;
  
  for(const name in queryObj) {
    if(validQueryKeys.indexOf(name) === -1) {
      delete queryObj[name];
    }
  }

  const newQueryStr = qs.stringify(queryObj);
  const newUrl = window.location.href.replace(oldQueryStr, newQueryStr ? `?${newQueryStr}` : '');
  window.history.replaceState({}, '', newUrl);
}

export const onSaveProject = (that) => {
  const {
    boundProjectsActions,
    boundNotificationActions,
    boundConfirmModalActions,
    boundOrderModalActions,
    volumes,
    env
  } = that.props;

  const { urls } = env;
  const baseUrl = urls.get('baseUrl');

  const allPromises = [];
  const orderedVolumesIdx = [];
  volumes.map((volume, index) => {
    if (volume.get('isOrder')) {
      allPromises.push(boundProjectsActions.saveProject(index));
      orderedVolumesIdx.push(index);
    }
  });

  return Promise.all(allPromises)
    .then((res) => {
      checkRequestFailed(res, that);

      const allProjectIds = [];
      const allProjectsSucceed = res.every((item) => {
        if (get(item, 'status') === 'success' && get(item, 'errorCode') === 200) {
          allProjectIds.push(get(item, 'data.guid'));
          return true;
        }
      });
      if (allProjectsSucceed) {
        boundProjectsActions.uploadThirdPartyImages(volumes);

        // 延时，防止截图没画完就上传
        setTimeout(() => {
          const allUploadCoverPromises = [];
          allProjectIds.forEach((id, index) => {
            allUploadCoverPromises.push(getScreenShot(`.page-screenshots${orderedVolumesIdx[index]} .konvajs-content canvas`).then((url) => {
              return boundProjectsActions.uploadCoverImage(url, id);
            }));
          });
          Promise.all(allUploadCoverPromises)
            .then(() => {
              const projectIdsObj = {};
              allProjectIds.forEach((itemId) => {
                projectIdsObj[itemId] = 1;
              });
              window.onbeforeunload = null;
              const projectIdsString = JSON.stringify(projectIdsObj);
              window.location = `${baseUrl}commonProduct/addShoppingCart.html?timelineBookCart=${projectIdsString}`;
            });
        }, 500);
      } else {
        boundNotificationActions.addNotification({
          message: 'Project saved failed, please try again later.',
          level: 'error',
          autoDismiss: 0
        });
      }
    })
    .catch((e) => {
      boundOrderModalActions.hideOrderLoading();

      boundNotificationActions.addNotification({
        message: 'No interenet connection, please check your network and try again.',
        level: 'error',
        autoDismiss: 0
      });
    });
}

function checkRequestFailed(resArray, that) {
  const { boundNotificationActions } = that.props;
  let result = 'success';

  if(resArray.some(res => res.errorCode === -111)) {
    result = 'sessionTimeOut';
  }

  switch(result) {
    case 'success': {
      break;
    }
    case 'sessionTimeOut': {
      showLoginDialog(that);
      break;
    }
    default: {
      boundNotificationActions.addNotification({
        message: 'Project saved failed, please try again later.',
        level: 'error',
        autoDismiss: 0
      });
      break;
    }
  }
}

function showLoginDialog(that) {
  const {
    boundConfirmModalActions,
    boundOrderModalActions
  } = that.props;

  boundConfirmModalActions.showConfirm({
    confirmMessage: (
      <div className="text-center">
        You must log in to open your little timeline book.
      </div>
    ),
    onOkClick: () => window.open('/sign-in.html', '_blank'),
    okButtonText: 'OK',
  });

  boundOrderModalActions.hideOrderLoading();
}