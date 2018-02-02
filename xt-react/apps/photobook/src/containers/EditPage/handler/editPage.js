import { get } from 'lodash';
import Immutable from 'immutable';
import {
  elementTypes,
  smallViewWidthInMyProjects
} from '../../../contants/strings';
import { getScreenShot } from '../../../utils/screenshot';
import { toCanvas } from '../../../utils/snippingHelper';

export const hasCameoElement = (props) => {
  let has = false;
  const { paginationSpreadForCover } = props;

  if (paginationSpreadForCover) {
    const pages = paginationSpreadForCover.get('pages');

    if (pages) {
      pages.forEach((p) => {
        const elements = p.get('elements');

        if (elements) {
          const cameo = elements.find(
            ele => ele.get('type') === elementTypes.cameo
          );
          if (cameo) {
            has = true;
          }
        }
      });
    }
  }

  return has;
};

export const saveProject = (that) => {
  const { env, specVersion, project, boundProjectActions } = that.props;
  const { userInfo } = env;
  boundProjectActions.saveProject(project, userInfo, specVersion).then((res) => {
    const isRequestSuccess = get(res, 'status') === 'success';
    if (isRequestSuccess) {
      const screenshot = document.querySelector('.screenshot canvas');
      toCanvas(screenshot, smallViewWidthInMyProjects).then((params) => {
        boundProjectActions.uploadCoverImage(params.url);
      });
    }
  });
};

export const setCenterTop = (that) => {
  const { size, paginationSpread } = that.props;
  const { panelStep } = that.state;
  const height = window.innerHeight - panelStep * 104 - 77;

  const summary = paginationSpread.get('summary');
  const isCover = summary.get('isCover');
  const sheetSize = isCover ? size.renderCoverSheetSize : size.renderInnerSheetSize;

  that.setState({
    // 42: actionbar的高.
    centerTop: ((height - (sheetSize.height + 42)) / 2) + sheetSize.bleed.top
  });
};

export const saveCurrentPageScreenshot = (that) => {
  const {
    pagination,
    boundProjectActions,
    boundNotificationActions,
    boundPreviewScreenshotActions,
    boundGlobalLoadingActions
  } = that.props;
  const { pageId, sheetIndex } = pagination;
  return new Promise((resolve, reject) => {
    getScreenShot('.current-page-screenshot canvas', false, null, true).then(
      (url) => {
        boundPreviewScreenshotActions.show({
          screenshot: url,
          onClickUpload: () => {
            boundGlobalLoadingActions.showGlobalLoading();
            boundProjectActions.uploadPageImage(url, pageId, sheetIndex).then(
              (res) => {
                const code = get(res, 'code');
                boundGlobalLoadingActions.hideGlobalLoading();
                if (code == 200) {
                  boundNotificationActions.addNotification({
                    message: 'Upload screenshot successful!',
                    level: 'success',
                    autoDismiss: 3
                  });
                } else {
                  boundNotificationActions.addNotification({
                    message: get(res, 'message'),
                    level: 'success',
                    autoDismiss: 3
                  });
                }
              },
              () => {
                boundNotificationActions.addNotification({
                  message: 'Upload screenshot failed! Please try again later.',
                  level: 'error',
                  autoDismiss: 0
                });
                boundGlobalLoadingActions.hideGlobalLoading();
              }
            );
          }
        });
      }
    );
  });
};

export function onColorChange(that, colorOption) {
  if (colorOption) {
    const { boundProjectActions } = that.props;
    boundProjectActions.changeProjectSetting({
      leatherColor: colorOption.id
    });
  }
}

export function onBgColorChange(that, coverColorObj) {
  if (coverColorObj) {
    const {
      boundProjectActions,
      boundUndoActions,
      pagination,
      paginationSpreadForCover
    } = that.props;
    const { pageId } = pagination;

    boundUndoActions.stopUndo();

    boundProjectActions.changePageDefaultFontColor(
      pageId,
      coverColorObj.fontColor
    );
    boundProjectActions.applyDefaultBackground();

    const pages = paginationSpreadForCover.get('pages');
    let updateObjectArray = Immutable.List();

    pages.forEach((page) => {
      if (page.get('id') !== pageId) {
        boundProjectActions.changePageBgColor(
          page.get('id'),
          coverColorObj.bgColor
        );
      }

      const pageTextElements = page.get('elements').filter((o) => {
        return o.get('type') === elementTypes.text;
      });

      if (pageTextElements.size) {
        updateObjectArray = updateObjectArray.push(
          Immutable.Map({
            elements: pageTextElements.map((element) => {
              return Immutable.Map({
                id: element.get('id'),
                fontColor: coverColorObj.fontColor
              });
            })
          })
        );
      }
    });

    if (updateObjectArray.size) {
      boundProjectActions.updateElements(updateObjectArray);
    }

    boundUndoActions.startUndo();

    boundProjectActions.changePageBgColor(pageId, coverColorObj.bgColor);
  }
}
