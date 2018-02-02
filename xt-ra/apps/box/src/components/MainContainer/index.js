import React, { Component, PropTypes } from 'react';
import { isEqual } from 'lodash';
import ConfirmModal from '../../components/ConfirmModal';
import XImageEditModal from '../../../common/ZNOComponents/XImageEditModal';
import XNotify from '../../../common/ZNOComponents/XNotify';
import XHeartBeat from '../../../common/ZNOComponents/XHeartBeat';
import { LoadComplete, ClickRotateImage } from '../../contants/trackerConfig';
import * as resetHandler from './handler/resetHandler';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.onRotateClick = this.onRotateClick.bind(this);
    this.onImageEditModalCanceled = this.onImageEditModalCanceled.bind(this);
  }

  componentWillMount() {
    const {
      boundSpecActions,
      boundEnvActions,
      boundProjectActions,
      projectId,
      encProjectIdString,
      boundSystemActions
    } = this.props;

    // 获取环境变量, 如各种接口的根路径
    boundEnvActions.getEnv().then(() => {
      if (encProjectIdString) {
        boundSpecActions.getSpecData();
        boundSystemActions.getFontList();
        boundProjectActions
          .getPreviewProjectData(encProjectIdString)
          .then(() => {
            boundProjectActions.projectLoadCompleted();
          });
      } else if (projectId !== -1) {
        boundSpecActions.getSpecData();
        boundSystemActions.getFontList();
        boundEnvActions.getUserInfo();
      } else {
        // 当projectId不存在，spec数据加载完毕，用户信息加载完毕时
        // 将project数据标记为已完成
        Promise.all([
          boundSpecActions.getSpecData(),
          boundEnvActions.getUserInfo(),
          boundSystemActions.getFontList()
        ])
          .then(() => {
            boundProjectActions.projectLoadCompleted();
          })
          .catch(e => console.log(e));
      }
    });
  }

  async componentWillReceiveProps(nextProps) {
    const oldUserId = this.props.userId;
    const newUserId = nextProps.userId;

    const {
      boundProjectActions,
      boundSystemActions,
      boundPriceActions,
      boundEnvActions,
      boundTrackerActions,
      onSaveProject,
      projectId,
      setting,
      baseUrls,
      project,
      isProjectLoadCompleted
    } = this.props;

    if (
      nextProps.isSpecLoaded &&
      newUserId !== -1 &&
      (oldUserId !== newUserId ||
        this.props.isSpecLoaded !== nextProps.isSpecLoaded)
    ) {
      if (!newUserId) {
        await boundSystemActions.showConfirm({
          confirmMessage: 'Please log in!',
          okButtonText: 'Done',
          cancelButtonText: 'Cancel',
          onOkClick: () => {
            window.location.href = baseUrls.baseUrl;
          }
        });
        return;
      }

      if (projectId !== -1) {
        await boundProjectActions.getProjectData(newUserId, projectId);
        await boundProjectActions.getProjectOrderedState(newUserId, projectId);
        await boundEnvActions.getAlbumId(newUserId, projectId);
        const res = await boundEnvActions.getProjectTitle(newUserId, projectId);
        boundProjectActions.changeProjectTitle(res.projectName);

        await boundProjectActions.projectLoadCompleted();
      } else {
        onSaveProject();
      }
    }

    const newProjectId = nextProps.project.projectId;
    // const oldLoaded = this.props.project.isProjectLoadCompleted;
    // const newLoaded = nextProps.project.isProjectLoadCompleted;
    // if (newLoaded && newProjectId !== -1 && (oldLoaded !== newLoaded || oldProjectId !== newProjectId)) {
    //   boundTrackerActions.addTracker(LoadComplete);
    // }

    if (projectId !== newProjectId) {
      console.log('init project');
      boundEnvActions
        .addAlbum(newUserId, nextProps.project.title, newProjectId)
        .then(() => {
          if (projectId === -1) {
            boundProjectActions.projectLoadCompleted();
            boundTrackerActions.addTracker('BookLoadComplete');
          }
        });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      onSaveProject,
      setting,
      userId,
      isProjectLoadCompleted,
      projectId,
      boundPriceActions,
      boundProjectActions,
      mainProjectUid,
      encImgId,
      pageArray,
      variableMap,
      isFromMyPhoto,
      baseUrls,
      allOptionMap
    } = this.props;

    if (isProjectLoadCompleted) {
      // 如果是usbCase, 那么给usbpage新建UsbTextElement
      if (setting.product === 'usbCase') {
        resetHandler.initialUsbTextElement({
          setting,
          pageArray,
          boundProjectActions,
          variableMap
        });
      }
    }

    if (
      isProjectLoadCompleted &&
      prevProps.isProjectLoadCompleted !== isProjectLoadCompleted
    ) {
      const title = document.querySelector('title');
      // const keywords = document.querySelector('meta[name=keywords]');
      // const description = document.querySelector('meta[name=description]');
      const productName = allOptionMap.product.find(
        option => option.id === setting.product
      ).title;

      title.innerText = title.innerText.replace('Box', productName);
      // keywords['content'] = keywords['content'].replace('Box', productName);
      // description['content'] = description['content'].replace('Box', productName);
    }

    if (
      isProjectLoadCompleted &&
      isFromMyPhoto === 'true' &&
      prevProps.isProjectLoadCompleted !== isProjectLoadCompleted
    ) {
      boundProjectActions.getMyPhotoImages(baseUrls.baseUrl, userId);
    }

    // 当project数据加载完毕
    // url后面没有initGuid
    // 用户信息获取完毕，并且project数据加载完成时
    // 保存项目信息
    if (
      projectId === -1 &&
      userId !== -1 &&
      prevProps.isProjectLoadCompleted !== isProjectLoadCompleted &&
      isProjectLoadCompleted
    ) {
      if (projectId === -1 && mainProjectUid) {
        // boundProjectActions
        //   .loadMainProjectImages(mainProjectUid, encImgId)
        //   // 加载完Main Project Images以后保存项目，生成项目guid
        //   .then(() => onSaveProject())
        //   // 此时已经有guid，再次保存即可生成切图
        //   .then(() => onSaveProject());
      } else {
        // onSaveProject();
      }
    }

    if (!isEqual(prevProps.setting, setting)) {
      boundPriceActions.getProductPrice(setting);
    }
  }

  onRotateClick() {
    const { boundTrackerActions } = this.props;
    boundTrackerActions.addTracker(ClickRotateImage);
  }

  onImageEditModalCanceled() {
    const { boundSystemActions } = this.props;
    boundSystemActions.hideImageEditModal();
  }

  render() {
    const {
      children,
      className,
      confirmData,
      notifyData,
      userId,
      imageEditModalData,
      boundSystemActions,
      boundEnvActions
    } = this.props;

    return (
      <div className={className}>
        {children}

        <ConfirmModal
          {...confirmData}
          onModalClose={boundSystemActions.hideConfirm}
        />

        <XNotify {...notifyData} hideNotify={boundSystemActions.hideNotify} />

        <XImageEditModal
          imageName={''}
          {...imageEditModalData}
          onRotateClick={this.onRotateClick}
          onCancelClick={this.onImageEditModalCanceled.bind(this)}
        />

        <XHeartBeat userId={userId} keepAlive={boundEnvActions.keepAlive} />
      </div>
    );
  }
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  boundSpecActions: PropTypes.object.isRequired,
  boundProjectActions: PropTypes.object.isRequired,
  boundEnvActions: PropTypes.object.isRequired,
  boundSystemActions: PropTypes.object.isRequired,
  boundPriceActions: PropTypes.object.isRequired,
  projectId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  setting: PropTypes.object.isRequired,
  onSaveProject: PropTypes.func.isRequired,
  isProjectLoadCompleted: PropTypes.bool.isRequired,
  encProjectIdString: PropTypes.string.isRequired,
  baseUrls: PropTypes.object.isRequired,
  className: PropTypes.string,
  confirmData: PropTypes.object,
  notifyData: PropTypes.object,
  imageEditModalData: PropTypes.object,
  mainProjectUid: PropTypes.string,
  encImgId: PropTypes.string
};

export default MainContainer;
