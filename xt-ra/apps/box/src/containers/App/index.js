import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { set, get, isEqual, merge, isUndefined } from 'lodash';

import qs from 'qs';

// 导入用于本地化的组件
import { TranslatorProvider } from 'react-translate';

import 'normalize.css';
import './index.scss';

import XCloneModal from '../../../../common/ZNOComponents/XCloneModal';

import * as specActions from '../../actions/specActions';
import * as projectActions from '../../actions/projectActions';
import * as envActions from '../../actions/envActions';
import * as loginActions from '../../actions/loginActions';
import * as uploadedImagesActions from '../../actions/imagesActions';
import * as systemActions from '../../actions/systemActions';
import * as priceActions from '../../actions/priceActions';
import * as workspaceActions from '../../actions/workspaceActions';
import * as trackerActions from '../../actions/trackerActions';
import * as paginationActions from '../../actions/paginationActions';
import * as useSpecModal from '../../actions/useSpecModalActions';
import {
  spreadTypes,
  errorTypes,
  textEditorTypes
} from '../../contants/strings';

import MainContainer from '../../components/MainContainer';
import PageHeader from '../../components/PageHeader';
import SideBar from '../../components/SideBar';
import WorkSpace from '../../components/WorkSpace';
import UseSpecModal from '../../components/UseSpecModal';
import UploadModal from '../../components/UploadModal';
import XLoginModal from '../../../common/ZNOComponents/XLoginModal';

import PreviewModel from '../../components/PreviewModal';

import ItemPrice from '../../components/ItemPrice';
import TextEditor from '../../components/TextEditor';
import TextEditorModal from '../../components/TextEditModal';
import USBTextEditModal from '../../components/USBTextEditModal';
import Loading from '../../components/Loading';
import { ClickPreview, AddText } from '../../contants/trackerConfig';
import * as paginationSpreadHandler from './handler/paginationSpread';

class App extends Component {
  constructor(props) {
    super(props);

    const queryStringObj = qs.parse(window.location.search.substr(1));
    const hasPreview = Boolean(queryStringObj.isPreview === 'true');
    const mainProjectUid = queryStringObj.mainProjectUid;
    const encImgId = queryStringObj.encImageId;
    const isFromMyPhoto = queryStringObj.isFromMyPhoto;
    // 定义一些初始化值.
    this.state = {
      modalSwitches: {
        // options设置弹框
        options: false,
        // upload 弹框
        upload: false,
        // 登录弹框
        login: false,

        // 预览弹框
        preview: false,

        // texteditor弹框
        texteditorShow: false,

        usbtexteditorShow: false,

        textEditorType: ''
      },

      spreads: [],

      textOptions: null,

      // 标记是否为preview模式.
      hasPreview,
      // 主工程Uid，用来获取Project图片列表
      mainProjectUid,
      // 主工程图片ID
      encImgId,
      isFromMyPhoto
    };

    this.addText = this.addText.bind(this);
    this.editText = this.editText.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onSaveProject = this.onSaveProject.bind(this);
    this.onCloneProject = this.onCloneProject.bind(this);
    this.getImageDetail = this.getImageDetail.bind(this);
    this.editTextWithoutJustify = this.editTextWithoutJustify.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { spreads, currentSpread, boundWorkspaceActions } = nextProps;
    if (spreads && !isEqual(this.state.spreads, spreads)) {
      const newSpreads = spreads.map(s => {
        return merge({}, s, {
          width: s.w,
          height: s.h,
          bgColor: '#f6f6f6'
        });
      });

      this.setState({
        spreads: newSpreads,
        currentSpread
      });
    }

    if (
      this.state.hasPreview &&
      !this.props.isProjectLoadCompleted &&
      nextProps.isProjectLoadCompleted
    ) {
      boundWorkspaceActions.takeWorkspaceToPreview(true);
    }
  }

  componentWillMount() {
    // 如果为preview模式, 就直接打开预览modal.
    if (this.state.hasPreview) {
      this.toggleModal('preview', true);
    }
  }

  componentDidMount() {
    window.onbeforeunload = () => {
      return 'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    };
  }

  /**
   * 显示或关闭modal
   * @param {string} type 待关闭的modal在state中key的值(this.state.modalSwitches).
   * @param {bool} status true/false, modal是显示还是关闭
   */
  toggleModal(type, status) {
    const state = set(this.state, `modalSwitches.${type}`, status);
    this.setState(state);
  }

  toggleNewAdded(status) {
    const state = set(this.state, 'textOptions.newAdded', status);
    this.setState(state);
  }

  handleLogin() {
    // 隐藏login弹框
    this.toggleModal.bind(this, 'login', false);
  }

  addText() {
    const { boundTrackerActions } = this.props;
    this.toggleModal('texteditorShow', true);
    this.setState({
      textOptions: null
    });
    boundTrackerActions.addTracker(AddText);
  }

  editText(options) {
    this.toggleModal('texteditorShow', true);
    this.setState({
      textOptions: options,
      textEditorType: textEditorTypes.TEXT_EDITOR
    });
  }

  editTextWithoutJustify(options) {
    const { orderState } = this.props;

    if (orderState && !orderState.checkFailed) {
      this.toggleModal('usbtexteditorShow', true);
      this.setState({
        textOptions: options,
        textEditorType: textEditorTypes.TEXT_EDITOR_NO_JUSTIFY
      });
    }
  }

  onSaveProject(onSaveSuccessed) {
    const {
      boundProjectActions,
      boundSystemActions,
      boundTrackerActions,
      project,
      userInfo,
      baseUrls
    } = this.props;

    const { mainProjectUid } = this.state;
    // 请求project订单状态，如果是新建项目，就不发送请求
    return boundProjectActions
      .getProjectOrderedState(userInfo.id, project.projectId)
      .then(({ orderState }) => {
        // 如果已经在购物车或者已经下单，则无法保存项目，并且弹框
        if (
          (orderState.isInCart || orderState.isOrdered) &&
          !orderState.checkFailed
        ) {
          return boundSystemActions.showConfirm({
            confirmMessage:
              'Your current project has been ordered or is in the cart. You need to clone it to save your additional changes',
            onOkClick: () => {
              boundSystemActions.hideConfirm();
              boundSystemActions.showCloneModal();
            },
            onCancelClick: () => {
              boundSystemActions.hideConfirm();
            },
            okButtonText: 'Clone',
            cancelButtonText: 'Cancel'
          });
          // return boundSystemActions.showConfirm({
          //   confirmMessage: 'Your current project was already ordered ' +
          //   'or added to cart. You need to create a new project ' +
          //   'to make additional changes.',
          //   onOkClick: () => {
          //     boundSystemActions.hideConfirm();
          //   },
          //   okButtonText: 'OK'
          // });
        }
        // 如果不在购物车，则走保存数据接口
        // 每次保存的时候发送一次同步删除图片的请求，不需要等待响应
        boundProjectActions.deleteServerPhotos();
        return boundProjectActions
          .saveProject(project, userInfo, mainProjectUid, boundProjectActions)
          .then(res => {
            const isRequestSuccess = get(res, 'status') === 'success';
            if (!isRequestSuccess) {
              const errorCode = +get(res, 'errorCode');
              // 错误代码分类，目前没有错误分类
              switch (errorCode) {
                case -111:
                  boundSystemActions.showConfirm({
                    confirmMessage:
                      'Your session has timed out. You must log in again to continue.',
                    okButtonText: 'Log in',
                    cancelButtonText: 'Cancel',
                    onOkClick: () => window.open('/sign-in.html', '_blank')
                  });
                  break;
                default:
                  boundSystemActions.showNotify('Saving project failed!');
                  break;
              }
            } else {
              // 项目保存成功时，若url参数中没有initGuid
              // 将url参数进行替换
              const initGuid = get(res, 'data.guid');

              if (project.projectId === -1 && initGuid) {
                window.history.replaceState(
                  {},
                  'Box',
                  `?${qs.stringify({
                    initGuid,
                    webClientId: 1
                  })}`
                );
              }

              if (!isUndefined(onSaveSuccessed)) {
                onSaveSuccessed();
              }
            }
          });
      })
      .catch(error => {
        console.log('>>>>>error', error);
        switch (error.code) {
          case errorTypes.NETWORK_ERROR: {
            boundSystemActions.showConfirm({
              confirmMessage: 'Your network is offline!',
              onOkClick: () => {
                boundSystemActions.hideConfirm();
              },
              okButtonText: 'OK'
            });
            break;
          }
          default: {
            boundSystemActions.showConfirm({
              confirmMessage: 'An unexpected error occurred. Try again',
              onOkClick: () => {
                boundSystemActions.hideConfirm();
              },
              okButtonText: 'OK'
            });
          }
        }
      });
  }

  onCloneProject(newTitle, onCloneSuccessed) {
    const {
      boundProjectActions,
      boundSystemActions,
      project,
      userInfo,
      spec
    } = this.props;
    const { mainProjectUid } = this.state;

    boundProjectActions
      .cloneProject(project, userInfo, mainProjectUid, newTitle)
      .then(res => {
        const isRequestSuccess = get(res, 'status') === 'success';

        if (isRequestSuccess) {
          const guid = +get(res, 'data.guid');
          if (guid) {
            boundProjectActions.changeProjectTitle(newTitle);

            boundProjectActions.updateProjectId(guid);
            boundProjectActions.uploadCoverImage(guid);
            boundProjectActions.getProjectOrderedState(userInfo, guid);

            window.history.replaceState(
              {},
              'Box',
              `?${qs.stringify({
                initGuid: guid
              })}`
            );

            if (onCloneSuccessed) {
              onCloneSuccessed();
            } else {
              boundSystemActions.showNotify('Project cloned successfully!');
            }
          }
        } else {
          const errorCode = +get(res, 'errorCode');
          // 错误代码分类，目前没有错误分类
          switch (errorCode) {
            case -111:
              boundSystemActions.showConfirm({
                confirmMessage:
                  'Your session has timed out. You must log in again to continue.',
                okButtonText: 'Log in',
                cancelButtonText: 'Cancel',
                onOkClick: () => window.open('/sign-in.html', '_blank')
              });
              break;
            default:
              boundSystemActions.showNotify('Saving project failed!');
              break;
          }
        }
      });
  }

  // get orig image detail
  getImageDetail(imgId) {
    const { imageArray } = this.props;
    const currentImg = imageArray.filter(image => {
      return image.id === imgId;
    });
    return currentImg ? currentImg[0] : {};
  }

  onPreviewHandle() {
    const { boundWorkspaceActions, boundTrackerActions } = this.props;
    boundWorkspaceActions.takeWorkspaceToPreview(true);
    this.toggleModal('preview', true);
    boundTrackerActions.addTracker(ClickPreview);
  }

  onClosedPreview() {
    const { boundWorkspaceActions } = this.props;
    boundWorkspaceActions.takeWorkspaceToPreview(false);
    this.toggleModal('preview', false);
  }

  render() {
    const {
      translations,
      boundSpecActions,
      boundProjectActions,
      boundLoginActions,
      boundEnvActions,
      boundSystemActions,
      boundNotifyActions,
      boundUploadedImagesActions,
      boundPriceActions,
      boundWorkspaceActions,
      boundTrackerActions,
      boundPaginationActions,
      boundUseSpecActions,

      projectId,
      optionMap,
      setting,
      userId,
      albumId,
      spreadArray,
      imageArray,
      imageUsedCountMap,
      isProjectLoadCompleted,
      isProjectEdited,
      encProjectIdString,
      orderState,

      uploadingImages,
      price,

      notifyData,
      confirmData,
      loadingData,
      imageEditModalData,
      currentSpread,
      operationPanel,
      inPreviewWorkspace,
      allSpreads,
      baseUrls,

      ratio,
      containerBaseSize,
      pagination,

      allOptionMap,
      variableArray,
      parameterMap,
      configurableOptionArray,
      cover,
      inner,
      pageArray,
      elementArray,
      userInfo,
      variableMap,
      fontList,
      project,
      isSpecLoaded,
      cloneModalData,
      useSpecModal
    } = this.props;

    const {
      hasPreview,
      mainProjectUid,
      encImgId,
      isFromMyPhoto,
      textEditorType
    } = this.state;

    // 获取当前的spread的type, 看看是innerPage还是cover page.
    const spreadType = get(currentSpread, 'spreadOptions.type');
    const spreadTypeText = !spreadType
      ? '[ERROR]'
      : spreadType === spreadTypes.innerPage ? 'Inner' : 'Cover';
    const paginationSpread = paginationSpreadHandler.getPaginationSpread({
      setting,
      cover,
      pageArray,
      elementArray,
      imageArray,
      pagination,
      inner
    });
    const coverPageSpread = paginationSpreadHandler.getPageSpread({
      setting,
      cover,
      pageArray,
      elementArray,
      imageArray,
      pagination,
      sheetIndex: 0,
      inner
    });
    const innerPageSpread = paginationSpreadHandler.getPageSpread({
      setting,
      cover,
      pageArray,
      elementArray,
      imageArray,
      pagination,
      sheetIndex: 1,
      inner
    });

    // Item Price 方法与数据
    const itemPriceActions = { boundTrackerActions };
    const itemPriceData = {
      price,
      parameters: parameterMap,
      allCovers: cover,
      allElements: elementArray,
      settings: setting,
      allPages: pageArray
    };

    return (
      <TranslatorProvider translations={translations}>
        <MainContainer
          className="app"
          boundSpecActions={boundSpecActions}
          boundProjectActions={boundProjectActions}
          boundEnvActions={boundEnvActions}
          boundSystemActions={boundSystemActions}
          boundPriceActions={boundPriceActions}
          boundTrackerActions={boundTrackerActions}
          imageEditModalData={imageEditModalData}
          projectId={projectId}
          userId={userInfo.id}
          setting={setting}
          baseUrls={baseUrls}
          onSaveProject={this.onSaveProject}
          confirmData={confirmData}
          notifyData={notifyData}
          isProjectLoadCompleted={isProjectLoadCompleted}
          encProjectIdString={encProjectIdString}
          mainProjectUid={mainProjectUid}
          isFromMyPhoto={isFromMyPhoto}
          encImgId={encImgId}
          pageArray={pageArray}
          variableMap={variableMap}
          project={project}
          isSpecLoaded={isSpecLoaded}
          allOptionMap={allOptionMap}
        >
          <PageHeader
            onLoginHandle={this.toggleModal.bind(this, 'login', true)}
            onPreviewHandle={this.onPreviewHandle.bind(this)}
            onSaveProject={this.onSaveProject}
            setting={setting}
            typeText={spreadTypeText}
            baseUrls={baseUrls}
            projectId={projectId}
            boundSystemActions={boundSystemActions}
            isProjectEdited={isProjectEdited}
            orderState={orderState}
            boundProjectActions={boundProjectActions}
            boundTrackerActions={boundTrackerActions}
            boundPaginationActions={boundPaginationActions}
            useSpecModal={useSpecModal}
            boundUseSpecActions={boundUseSpecActions}
            userId={userInfo.id}
            elementArray={elementArray}
            project={project}
            showCloneModal={boundSystemActions.showCloneModal}
          />

          {Object.keys(price).length ? (
            <ItemPrice actions={itemPriceActions} data={itemPriceData} />
          ) : null}
          <SideBar
            boundUploadedImagesActions={boundUploadedImagesActions}
            boundProjectActions={boundProjectActions}
            boundWorkspaceActions={boundWorkspaceActions}
            boundTrackerActions={boundTrackerActions}
            toggleModal={this.toggleModal.bind(this)}
            imageArray={imageArray}
            imageUsedCountMap={imageUsedCountMap}
            baseUrls={baseUrls}
            paginationSpread={paginationSpread}
            setting={setting}
            allOptionMap={allOptionMap}
            variableArray={variableArray}
            configurableOptionArray={configurableOptionArray}
            orderState={orderState}
            userInfo={userInfo}
          />
          <WorkSpace
            boundSystemActions={boundSystemActions}
            boundProjectActions={boundProjectActions}
            boundWorkspaceActions={boundWorkspaceActions}
            boundTrackerActions={boundTrackerActions}
            setting={setting}
            baseUrls={baseUrls}
            loadingData={loadingData}
            imageArray={imageArray}
            boundUploadedImagesActions={boundUploadedImagesActions}
            addText={this.addText}
            editText={this.editText}
            toggleModal={this.toggleModal}
            getImageDetail={this.getImageDetail}
            ratio={ratio}
            pagination={pagination}
            boundPaginationActions={boundPaginationActions}
            cover={cover}
            pageArray={pageArray}
            elementArray={elementArray}
            variableMap={variableMap}
            paginationSpread={paginationSpread}
            parameterMap={parameterMap}
            coverPageSpread={coverPageSpread}
            innerPageSpread={innerPageSpread}
            isPreview={false}
            isProjectLoadCompleted={isProjectLoadCompleted}
            editTextWithoutJustify={this.editTextWithoutJustify}
            orderState={orderState}
            userInfo={userInfo}
          >
            {/* 显示弹窗 */}
            {/* <input */}
            {/* type="button" */}
            {/* className="cursor-p" */}
            {/* value="显示弹窗" */}
            {/* onClick={this.toggleModal.bind(this, 'options', true)} */}
            {/* /> */}
          </WorkSpace>

          <UploadModal
            opened={this.state.modalSwitches.upload}
            boundSystemActions={boundSystemActions}
            uploadingImages={uploadingImages}
            boundUploadedImagesActions={boundUploadedImagesActions}
            boundWorkspaceActions={boundWorkspaceActions}
            currentSpread={currentSpread}
            boundTrackerActions={boundTrackerActions}
            toggleModal={this.toggleModal.bind(this)}
          />

          <XLoginModal
            loginActions={boundLoginActions}
            onClosed={this.toggleModal.bind(this, 'login', false)}
            opened={this.state.modalSwitches.login}
          />

          {this.state.modalSwitches.preview ? (
            <PreviewModel
              onClosed={this.onClosedPreview.bind(this)}
              opened={this.state.modalSwitches.preview}
              hasPreview={hasPreview}
              boundSystemActions={boundSystemActions}
              boundProjectActions={boundProjectActions}
              boundWorkspaceActions={boundWorkspaceActions}
              boundTrackerActions={boundTrackerActions}
              setting={setting}
              baseUrls={baseUrls}
              loadingData={loadingData}
              imageArray={imageArray}
              boundUploadedImagesActions={boundUploadedImagesActions}
              toggleModal={this.toggleModal}
              getImageDetail={this.getImageDetail}
              ratio={ratio}
              pagination={pagination}
              boundPaginationActions={boundPaginationActions}
              cover={cover}
              pageArray={pageArray}
              elementArray={elementArray}
              variableMap={variableMap}
              paginationSpread={paginationSpread}
              parameterMap={parameterMap}
              coverPageSpread={coverPageSpread}
              innerPageSpread={innerPageSpread}
              isProjectLoadCompleted={isProjectLoadCompleted}
              userInfo={userInfo}
            />
          ) : null}

          {/*
            fontList.length
              ? (
                <TextEditor
                  fontList={fontList}
                  opened={this.state.modalSwitches.texteditorShow}
                  textOptions={this.state.textOptions}
                  baseUrls={baseUrls}
                  onClosed={this.toggleModal.bind(this, 'texteditorShow', false)}
                  ratio={ratio}
                  containerBaseSize={containerBaseSize}
                  boundProjectActions={boundProjectActions}
                  boundTrackerActions={boundTrackerActions}
                  pagination={pagination}
                  paginationSpread={paginationSpread}
                  elementArray={elementArray}
                />
                )
              : null
          */}

          {fontList.length && textEditorType === textEditorTypes.TEXT_EDITOR ? (
            <TextEditorModal
              fontList={fontList}
              baseUrls={baseUrls}
              isShown={this.state.modalSwitches.texteditorShow}
              element={this.state.textOptions}
              pagination={pagination}
              paginationSpread={paginationSpread}
              elementArray={elementArray}
              closeTextEditModal={this.toggleModal.bind(
                this,
                'texteditorShow',
                false
              )}
              updateElement={boundProjectActions.updateElement}
              ratio={ratio}
            />
          ) : null}

          {fontList.length &&
          textEditorType === textEditorTypes.TEXT_EDITOR_NO_JUSTIFY ? (
            <USBTextEditModal
              fontList={fontList}
              baseUrls={baseUrls}
              isShown={this.state.modalSwitches.usbtexteditorShow}
              element={this.state.textOptions}
              pagination={pagination}
              paginationSpread={paginationSpread}
              elementArray={elementArray}
              closeTextEditModal={this.toggleModal.bind(
                this,
                'usbtexteditorShow',
                false
              )}
              updateElement={boundProjectActions.updateElement}
              ratio={ratio}
            />
          ) : null}

          {cloneModalData.isShown ? (
            <XCloneModal
              userId={userInfo.id}
              isShown={cloneModalData.isShown}
              title={project && project.title}
              onCloneProject={this.onCloneProject}
              addAlbum={boundEnvActions.addAlbum}
              closeCloneModal={boundSystemActions.hideCloneModal}
              checkProjectTitle={boundProjectActions.checkProjectTitle}
              addTracker={boundTrackerActions.addTracker}
            />
          ) : null}

          <UseSpecModal
            userId={userInfo.id}
            isShown={useSpecModal.get('isShown')}
            onClone={boundUseSpecActions.hideUseSpecModal}
            addTracker={boundTrackerActions.addTracker}
            useSpecModal={useSpecModal}
            boundUseSpecActions={boundUseSpecActions}
          />
        </MainContainer>
      </TranslatorProvider>
    );
  }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
const mapStateToProps = state => ({
  optionMap: get(state, 'project.availableOptionMap'),
  setting: get(state, 'project.setting'),
  spreadArray: get(state, 'project.spreadArray'),
  imageArray: get(state, 'project.imageArray'),
  projectId: get(state, 'project.projectId'),
  createdDate: get(state, 'project.createdDate'),
  coverThumbnail: get(state, 'project.coverThumbnail'),
  encProjectIdString: get(state, 'project.encProjectIdString'),
  albumId: get(state, 'system.env.albumId'),
  orderState: get(state, 'project.orderState'),

  // 标识图片的使用次数.
  imageUsedCountMap: get(state, 'project.imageUsedCountMap'),
  useSpecModal: get(state, 'system.useSpecModal'),

  // project spreads.
  spreads: get(state, 'project.spreadArray'),

  // 当前workspace上活动的spread.
  currentSpread: get(state, 'system.workspace.currentSpread'),

  // 当前workspace上活动的spread.
  allSpreads: get(state, 'system.workspace.allSpreads'),

  // 显示或隐藏workspace上的操作面板.
  operationPanel: get(state, 'system.workspace.operationPanel'),

  // 标记当前的workspace是否处于预览状态.
  inPreviewWorkspace: get(state, 'system.workspace.inPreviewWorkspace'),

  uploadingImages: state.system.images.uploading,
  price: state.system.price,

  baseUrls: get(state, 'system.env.urls'),
  notifyData: state.system.notifyData,
  confirmData: state.system.confirmData,
  loadingData: state.system.loadingData,
  imageEditModalData: get(state, 'system.imageEditModalData'),
  ratio: get(state, 'system.workspace.workspaceRatio'),
  isProjectLoadCompleted: get(state, 'project.isProjectLoadCompleted'),
  isProjectEdited: get(state, 'project.isProjectEdited'),
  containerBaseSize: get(
    state,
    'system.workspace.currentSpread.containerSizeBaseOnScreen'
  ),

  configurableOptionArray: get(state, 'project.configurableOptionArray'),
  allOptionMap: get(state, 'spec.allOptionMap'),
  variableArray: get(state, 'project.variableArray'),
  variableMap: get(state, 'project.variableMap'),
  parameterMap: get(state, 'project.parameterMap'),
  cover: get(state, 'project.cover'),
  inner: get(state, 'project.inner'),
  pageArray: get(state, 'project.pageArray'),
  elementArray: get(state, 'project.elementArray'),
  pagination: get(state, 'system.pagination'),
  userInfo: get(state, 'system.env.userInfo'),
  fontList: get(state, 'system.fontList'),
  project: get(state, 'project'),
  isSpecLoaded: get(state, 'project.isSpecLoaded'),
  cloneModalData: get(state, 'system.cloneModalData')
});

const mapDispatchToProps = dispatch => ({
  boundSpecActions: bindActionCreators(specActions, dispatch),
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundLoginActions: bindActionCreators(loginActions, dispatch),
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundUploadedImagesActions: bindActionCreators(
    uploadedImagesActions,
    dispatch
  ),
  boundSystemActions: bindActionCreators(systemActions, dispatch),
  boundPriceActions: bindActionCreators(priceActions, dispatch),
  boundWorkspaceActions: bindActionCreators(workspaceActions, dispatch),
  boundTrackerActions: bindActionCreators(trackerActions, dispatch),
  boundPaginationActions: bindActionCreators(paginationActions, dispatch),
  boundUseSpecActions: bindActionCreators(useSpecModal, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
