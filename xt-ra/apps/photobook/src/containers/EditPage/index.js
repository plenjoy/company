import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import Immutable, { Map, fromJS } from 'immutable';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { get, merge, pick } from 'lodash';
import classNames from 'classnames';

// 导入selector
import { mapEditPageDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/editPage';

import './index.scss';

// 导入组件
import ToolTip from 'react-portal-tooltip';
import XSimplePagination from '../../../../common/ZNOComponents/XSimplePagination';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XTogglePanel from '../../../../common/ZNOComponents/XTogglePanel';
import ActionBar from '../../components/ActionBar';
import BottomPanel from '../../components/BottomPanel';
import Undo from '../../components/Undo';
import SheetsList from '../../components/SheetsList';
import OptionalButtonList from '../../components/OptionalButtonList';
import PageNumber from '../../components/PageNumber';
import ScreenShot from '../../canvasComponents/ScreenShot';
import CoverColorChanger from '../../components/CoverColorChanger';
import CoverBgColorChanger from '../../components/CoverBgColorChanger';
import { allImgColors } from '../../components/CoverColorIcon';

import projectParser from '../../../../common/utils/projectParser';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

// 导入handler
import * as handler from './handler/editPage';
import * as actionBarHandler from './handler/actionBar';
import * as cameoHandler from '../../common/handlers/cameo';
import * as paginationHandler from './handler/pagination';
import * as templateHandler from './handler/template';
import * as snippingHandler from './handler/snipping';
import * as autoLayoutHandler from './handler/autoLayout';
import * as saveLayoutHandler from './handler/saveLayout';
import * as togglePanelHandler from './handler/togglePanel';
import * as externalDropHandle from './handler/externalDrop';

import {
  checkIsSupportFullImageInCover,
  checkIsSupportHalfImageInCover
} from '../../utils/cover';
import {
  productTypes,
  coverTypes,
  elementTypes,
  filterOptions
} from '../../contants/strings';

class EditPage extends Component {
  constructor(props) {
    super(props);

    const { t, togglePanel } = this.props;

    // 判断是否已有render图.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    // 内部state.
    this.state = {
      loading: {
        isShown: false
      },
      hasCoverRender: !!coverEffectImg,
      isCameoActionBarShow: false,
      isSettingloaded: false,
      isSavingLayout: false,
      cameo: {
        cameo: 'M',
        cameoShape: 'Rect'
      },
      panelStep: togglePanel.get('step'),
      centerTop: 0,
      availableOptionMap: {},
      isShowDisableTip: false,

      isShowDropActive: false,

      // 中间区域的zindex是100, 默认btns-list的设置为99, 以至于actionbar的下拉菜单
      // 能够点击， 在鼠标移到btns-list后, 在更改zindex为200, 这时btns上的功能也可用.
      btnZindex: 99
    };

    this.onMouseEnterBtns = () => {
      this.setState({ btnZindex: 200 });
    };
    this.onMouseLeaveBtns = () => {
      this.setState({ btnZindex: 90 });
    };

    // 自动选择模板.
    this.doAutoLayout = autoFillData =>
      autoLayoutHandler.doAutoLayout(this, autoFillData);

    // 翻页时的处理函数.
    this.switchSheet = param => {
      paginationHandler.switchSheet(this, param);
    };

    // 切换page到指定的页面.
    this.switchPageTo = pageIndex => {
      paginationHandler.switchPageTo(this, pageIndex);
    };

    this.setCenterTop = () => handler.setCenterTop(this);
    this.saveCurrentPageScreenshot = (pageId, sheetIndex) =>
      handler.saveCurrentPageScreenshot(this, pageId, sheetIndex);

    this.onColorChange = colorOption =>
      handler.onColorChange(this, colorOption);

    this.onBgColorChange = coverColorObj =>
      handler.onBgColorChange(this, coverColorObj);

    // action bar的处理函数
    this.actionBarHandler = {
      onDesignSetting: () => {
        actionBarHandler.onDesignSetting(this);
      },
      onAutoFill: () => {
        actionBarHandler.onAutoFill(this);
      },
      hideTooltip: () => {
        actionBarHandler.hideTooltip(this);
      },
      onAddText: () => {
        actionBarHandler.onAddText(this);
      },
      onAddCoverText: () => {
        actionBarHandler.paintedText(this);
      },
      onAddFrame: orientation => {
        actionBarHandler.onAddFrame(this, orientation);
      },
      onFlipHorizontally: () => {
        actionBarHandler.onFlipHorizontally(this);
      },
      onFlipVertically: () => {
        actionBarHandler.onFlipVertically(this);
      },
      onUndo: () => {
        actionBarHandler.onUndo(this);
      },
      onRedo: () => {
        actionBarHandler.onRedo(this);
      },
      onClearAllImages: () => {
        actionBarHandler.onClearAllImages(this);
      },
      onRemoveAllFrames: () => {
        actionBarHandler.onRemoveAllFrames(this);
      },
      onRemoveSheet: () => {
        actionBarHandler.onRemoveSheet(this);
      },
      onRestart: () => {
        actionBarHandler.onRestart(this);
      },
      onAddToFront: () => {
        actionBarHandler.onAddToFront(this);
      },
      onAddToBack: () => {
        actionBarHandler.onAddToBack(this);
      },
      onAddAfterThisPage: () => {
        actionBarHandler.onAddAfterThisPage(this);
      },
      onAddBeforeThisPage: () => {
        actionBarHandler.onAddBeforeThisPage(this);
      },
      onSaveLayout: () => {
        saveLayoutHandler.handleSaveTemplate(this);
      },
      onChangeBgColor: () => {
        actionBarHandler.onChangeBgColor(this);
      }
    };

    // 选项卡选中时的处理函数.
    this.onSelect = selectedIndex =>
      layoutHandler.onSelect(this, selectedIndex);

    // cameo, painted text按钮的处理函数.
    this.onAddCameo = event => cameoHandler.onAddCameo(this, event);
    this.hideCameoActionBar = () => cameoHandler.hideCameoActionBar(this);
    this.onRemoveCameo = () => cameoHandler.onRemoveCameo(this);
    // this.onAddPaintedText = () => cameoHandler.onAddPaintedText(this);
    this.onSaveTemplate = () => templateHandler.onSaveTemplate(this);
    this.onAddCoverText = () => actionBarHandler.onAddCoverText(this);
    this.onAddSpineText = () => actionBarHandler.onAddSpineText(this);

    // toggle panel.
    this.onChangeStep = step => togglePanelHandler.onChangeStep(this, step);
    this.onChangeBottomPanelTab = tabIndex =>
      togglePanelHandler.onChangeBottomPanelTab(this, tabIndex);

    // 禁用默认的tabs样式.
    Tabs.setUseDefaultStyles(false);

    this.tabsText = [t('LAYOUTS'), t('PAGES')];

    /** *********拖拽电脑上的图片到app中************* */
    this.stopEvent = event => {
      event.stopPropagation();
      event.preventDefault();

      return false;
    };

    this.onDragEnterExternalFiles = event => {
      externalDropHandle.onDragEnterExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    this.onDragEndExternalFiles = event => {
      externalDropHandle.onDragEndExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    this.onDropedExternalFiles = event => {
      externalDropHandle.onDropedExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };
    /** ********************** */
  }

  componentWillMount() {
    const pageIndex = get(this.props, 'pagination.pageIndex');
    const pageId = get(this.props, 'pagination.pageId');

    // 如果pageIndex无效或pageId为空, 就重新切换到有效的页面.
    if (pageIndex === -1 || !pageId) {
      paginationHandler.switchPage(this, this.props);
    }

    const {
      configurableOptionArray,
      allOptionMap,
      disableOptionArray
    } = this.props.spec;
    const availableOptionMap = projectParser.getAvailableOptionMap(
      this.props.settings.spec,
      configurableOptionArray,
      allOptionMap,
      disableOptionArray
    );

    this.setState({
      availableOptionMap
    });
  }

  componentDidMount() {
    this.props.toggleSideBar(true);
    this.setCenterTop();

    addEventListener(document, 'dragenter', this.onDragEnterExternalFiles);
    addEventListener(document, 'dragend', this.onDragEndExternalFiles);
    addEventListener(document, 'dragleave', this.onDragEndExternalFiles);
    addEventListener(document, 'dragover', this.stopEvent);
    addEventListener(document, 'drop', this.onDropedExternalFiles);
  }

  componentWillUnmount() {
    this.props.toggleSideBar(false);

    removeEventListener(document, 'dragenter', this.onDragEnterExternalFiles);
    removeEventListener(document, 'dragend', this.onDragEndExternalFiles);
    removeEventListener(document, 'dragleave', this.onDragEndExternalFiles);
    removeEventListener(document, 'dragover', this.stopEvent);
    removeEventListener(document, 'drop', this.onDropedExternalFiles);
  }

  componentWillReceiveProps(nextProps) {
    // 当sheetIndex变化时, 更新pageId.
    const oldSheetIndex = get(this.props, 'pagination.sheetIndex');
    const newSheetIndex = get(nextProps, 'pagination.sheetIndex');

    if (oldSheetIndex !== newSheetIndex) {
      paginationHandler.switchPage(this, nextProps);
    }

    // 初始化pageId
    // 在插入新的pages后, 也需要switchPage. 这里检测sheet total是否发生变化.
    const oldPages = this.props.paginationSpread.get('pages');
    const newPages = nextProps.paginationSpread.get('pages');
    const oldPageId = get(this.props, 'pagination.pageId');
    const newPageId = get(nextProps, 'pagination.pageId');

    const oldSheetsTotal = get(this.props, 'pagination.total');
    const newSheetsTotal = get(nextProps, 'pagination.total');

    const isProjectLoadCompleted = nextProps.project.property.get(
      'isProjectLoadCompleted'
    );

    const newPageIndex = newPages.findIndex(page => {
      return page.get('id') === newPageId;
    });

    if (
      ((!Immutable.is(oldPages, newPages) && newPages.size && !oldPageId) ||
        oldSheetsTotal !== newSheetsTotal ||
        newPageIndex === -1) &&
      isProjectLoadCompleted
    ) {
      paginationHandler.switchPage(this, nextProps);
    }

    // 程序的启动时, 会初始化project两次. 这就导致了pagination上的pageId没有同步的问题.
    // 解决方案是: 等project加载完毕后, 我们再初始化pagination.
    if (isProjectLoadCompleted && !newPageId) {
      paginationHandler.switchPage(this, nextProps);
    }

    // 判断是否需要截图.
    const oldPaginationSpreadForCover = get(
      this.props,
      'paginationSpreadForCover'
    );
    const newPaginationSpreadForCover = get(
      nextProps,
      'paginationSpreadForCover'
    );

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = nextProps.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    if (coverEffectImg) {
      this.setState(
        {
          hasCoverRender: true
        },
        () => {
          this.setCenterTop();
        }
      );
    } else {
      this.setState({
        hasCoverRender: false
      });
    }

    const oldSetting = this.props.project.setting;
    const newSetting = nextProps.project.setting;
    if (!Immutable.is(oldSetting, newSetting)) {
      const {
        configurableOptionArray,
        allOptionMap,
        disableOptionArray
      } = nextProps.spec;
      const availableOptionMap = projectParser.getAvailableOptionMap(
        newSetting.toJS(),
        configurableOptionArray,
        allOptionMap,
        disableOptionArray
      );

      this.setState({
        availableOptionMap
      });
    }
  }

  render() {
    const {
      undoData,
      urls,
      size,
      env,
      ratios,
      settings,
      template,
      snipping,
      position,
      materials,
      variables,
      pagination,
      paginationSpread,
      paginationSpreadForCover,
      coverSpreadForInnerWrap,
      parameters,
      project,
      allImages,
      parentBook,
      spec,
      fontList,
      uploadedImages,
      togglePanel,
      capabilities,
      clipboardData,

      // nav pages.
      navPagesRatios,
      navPagesSize,
      navPagesPosition,
      allSheets,

      backgroundArray,
      stickerArray,

      uploadStatus,
      isUseFastCrop,

      // actions
      boundTodoActions,
      boundRandomActions,
      boundProjectActions,
      boundPaginationActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundTemplateActions,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions,
      t
    } = this.props;
    const {
      tabIndex,
      isLoaded,
      templateList,
      currentFilterTag,
      panelStep,
      centerTop
    } = this.state;

    const qs = get(env, 'qs');
    const isPreview = qs ? qs.get('isPreview') : false;
    const isAdvancedMode = capabilities.getIn(['editPages', 'isAdvancedMode']);

    const editpageStyle = {
      top: `${centerTop}px`
    };

    const toolTipStyle = {
      style: {
        fontSize: 12,
        color: '#3A3A3A',
        backgroundColor: '#fff',
        padding: '6px 10px',
        borderRadius: 4,
        boxShadow: ' 0 1px 4px 0 rgba(0,0,0,0.10)',
        whiteSpace: 'nowrap',
        zIndex: 99999
      },
      arrowStyle: {
        borderColor: '#d6d6d6'
      }
    };

    const summary = paginationSpread.get('summary');
    const { isCameoActionBarShow } = this.state;
    const hideCameoActionBar = this.hideCameoActionBar;

    // 计算页面有几个spine 如果大于0 就不能添加
    let spineCount = 0;
    const spineMap = paginationSpreadForCover
      .get('pages')
      .find(v => v.get('type') == 'Spine');
    if (spineMap) {
      spineCount = spineMap.get('elements').size;
    }

    const userInfo = get(env, 'userInfo');
    const setting = project.setting;

    // parent book
    const isEditParentBook = parentBook.isEditParentBook;

    // 封装actions方法到一个对象, 以减少组件属性的传递.
    // 顶部导航方法与数据

    // 封装actions方法到一个对象, 以减少组件属性的传递.
    // 顶部导航方法与数据
    const spreadsListActions = {
      boundProjectActions,
      boundPaginationActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundPaintedTextModalActions,
      boundPropertyModalActions,
      boundTrackerActions,
      boundTemplateActions,
      hideCameoActionBar,
      boundNotificationActions,
      boundGlobalLoadingActions,
      boundUndoActions,
      boundClipboardActions
    };

    const newRatios = merge({}, ratios);
    const newNavPagesRatios = merge({}, navPagesRatios);

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    if (
      size.coverSpreadSize.width &&
      newRatios.coverWorkspace &&
      size.coverSpreadSize.width * newRatios.coverWorkspace !==
        size.coverWorkspaceSize.width
    ) {
      newRatios.coverWorkspace =
        size.coverWorkspaceSize.width / size.coverSpreadSize.width;
      newNavPagesRatios.coverWorkspace =
        navPagesSize.coverWorkspaceSize.width /
        navPagesSize.coverSpreadSize.width;
    }

    const specData = spec;

    const spreadsListData = {
      urls,
      size,
      ratios: newRatios,
      position,
      materials,
      paginationSpread,
      paginationSpreadForCover,
      coverSpreadForInnerWrap,
      variables,
      template,
      pagination,
      settings,
      project,
      parameters,
      snipping,
      isCameoActionBarShow,
      allImages,
      undoData,
      specData,
      backgroundArray,
      stickerArray,
      clipboardData,
      capability: capabilities.get('editPages'),
      isUseFastCrop,
      env
    };

    // 封装actions方法到一个对象, 以减少组件属性的传递.
    // 顶部导航方法与数据
    const pages = paginationSpread.get('pages');
    const page = pages.find(p => p.get('id') === pagination.pageId);
    const OptionalButtonActions = {
      onAddCameo: this.onAddCameo,
      onRemoveCameo: this.onRemoveCameo,
      onAddCoverText: this.onAddCoverText,
      onAddSpineText: this.onAddSpineText,
      onSaveTemplate: this.onSaveTemplate,
      saveCurrentPageScreenshot: this.saveCurrentPageScreenshot
    };
    const isCover = summary.get('isCover');
    const isPressBook = summary.get('isPressBook');
    const isSupportHalfImageInCover = summary.get('isSupportHalfImageInCover');
    const bleed = isCover
      ? size.renderCoverSheetSize.bleed
      : size.renderInnerSheetSize.bleed;

    const optionalButtonStyle = {
      width: summary.get('isCover')
        ? `${
            isAdvancedMode
              ? size.renderCoverSheetSize.width
              : size.renderCoverSheetSizeWithoutBleed.width
          }px`
        : `${
            isAdvancedMode
              ? size.renderInnerSheetSize.width
              : size.renderInnerSheetSizeWithoutBleed.width
          }px`,
      margin: '0 auto',
      position: 'relative',
      top: '-12px'
    };

    const optionalButtonData = {
      isShowCameo:
        variables &&
        isCover &&
        get(settings, 'spec.product') !== productTypes.PS
          ? variables.get('cameoSupportCondition')
          : false,
      isShowAddCameoBtn: !summary.get('hasCameoElement') && isCover,

      isShowPaintedText: summary.get('isSupportPaintedText') && isCover,
      isShowSpineText: summary.get('isSupportSpineText') && isCover,
      isSupportSpinePaintedText:
        summary.get('isSupportSpinePaintedText') && isCover,

      // isShowSaveTemplate: !isCover,
      isShowSaveTemplate: false,
      isShowTakeShot: capabilities.getIn(['editPages', 'canShowTakeShot']),
      style: optionalButtonStyle,
      spineCount
    };

    // 只要当spread有值的时候, 才显示画布.
    const className = classNames('edit-page', { hide: !pages.size });

    const product = get(settings, 'spec.product');
    const { sheetIndex, total } = pagination;

    const minSheetNumber = project.parameterMap.getIn([
      'sheetNumberRange',
      'min'
    ]);
    const maxSheetNumber = project.parameterMap.getIn([
      'sheetNumberRange',
      'max'
    ]);

    const pageEnabled = page ? page.get('enabled') : true;
    const { errored, uploaded } = uploadStatus;
    const disableSaveLayout =
      !pageEnabled ||
      (isSupportHalfImageInCover && isCover) ||
      this.state.isSavingLayout;

    const disableInsertAfterSheet =
      (isPressBook && sheetIndex === 0) ||
      (isPressBook && sheetIndex === total);
    const disableInsertBeforeSheet =
      sheetIndex === 0 || (isPressBook && sheetIndex === 1);
    const disableInsertAfterBook = isPressBook && sheetIndex === total;

    const actionsBarActions = merge({}, this.actionBarHandler, {
      boundTrackerActions
    });
    const actionBarData = {
      disableAddText: !pageEnabled,
      disableAddFrame: !pageEnabled,
      disableFlip: !pageEnabled,

      // undo/redo
      disableUndo: !undoData.pastCount,
      disableRedo: !undoData.futureCount,

      disableAddSheet: total >= maxSheetNumber,
      addSheetPanel: {
        disableAddToBack: disableInsertAfterBook,
        disableAddToAfter: disableInsertAfterSheet,
        disableAddToBefore: disableInsertBeforeSheet
      },
      cleanUpPanel: {
        disableClearAllImages: false,
        disableRemoveAllFrames:
          isPressBook &&
          summary.get('isCover') &&
          [coverTypes.PSNC, coverTypes.PSLC].indexOf(
            get(settings, 'spec.cover')
          ) !== -1,
        disableRemoveSheet:
          summary.get('isCover') ||
          total <= minSheetNumber ||
          (isPressBook && sheetIndex === 1) ||
          (isPressBook && sheetIndex === total),
        disableRestart: false
      },
      disableSaveLayout,
      disableChangeBgColor: !pageEnabled,
      isPressBook,
      variables,
      isEditParentBook,
      capability: capabilities.get('editPages'),
      isDisableAutoFill: errored + uploaded < uploadStatus.total,

      // left, top的偏移量.
      offset: bleed,

      isContainSelfHeight: isAdvancedMode
    };

    // pageNumber
    const pageNumber = paginationSpread.get('pageNumber');
    const pageNumberStyle = {
      width: isCover
        ? `${
            isAdvancedMode
              ? size.renderCoverSheetSize.width
              : size.renderCoverSheetSizeWithoutBleed.width
          }px`
        : `${size.renderInnerSheetSize.width}px`
    };

    const pageItemStyle = {
      leftStyle: {
        marginLeft: `${
          isCover
            ? get(position, 'cover.render.left')
            : get(position, 'inner.render.left')
        }px`
      },
      rightStyle: {
        marginRight: `${
          isCover
            ? get(position, 'cover.render.left')
            : get(position, 'inner.render.left')
        }px`
      }
    };

    const pageNumberActions = {
      switchPage: this.switchPageTo,
      switchSheet: this.switchSheet
    };
    const pageNumberData = {
      pageNumber,
      pageItemStyle,
      style: pageNumberStyle,
      pages,
      isShowActive: true
    };

    // sheet容器.
    const containerWidth =
      pagination.sheetIndex === 0
        ? size.renderCoverSize.width
        : size.renderInnerSize.width;

    const containerHeight =
      pagination.sheetIndex === 0
        ? size.renderCoverSize.height
        : size.renderInnerSize.height;

    const sheetsOutContainerStyle = {
      // 去除左右翻页按钮和颜色块的空间.
      padding: isCover ? '0 80px 0 30px' : '0 30px 0 30px'
    };

    // 加一个container容器, 为了使封面和内页渲染在相同大小的容器内.
    const sheetsContainerStyle = {
      width: containerWidth,
      // height: `${containerHeight}px`,
      margin: '0 auto',
      position: 'relative',
      zIndex: 100
    };

    const editRenderStyle = {
      display: this.state.hasCoverRender ? 'block' : 'none'
    };
    const wrapStyle = {
      // display: this.state.hasCoverRender ? 'block' : 'none',
      position: 'relative'
    };

    const bottomPanelData = {
      tabIndex: togglePanel.get('tabIndex'),

      paginationSpread,
      uploadedImages,
      baseUrls: urls,
      setting,
      pagination,
      page,
      template,
      userInfo,
      panelStep,
      fontList,
      ratios: newRatios,
      isEditParentBook,
      bookSetting: project.bookSetting,

      // nav pages.
      navPagesRatios: newNavPagesRatios,
      navPagesSize,
      navPagesPosition,
      allSheets,

      specData: spec,
      urls,
      materials,
      variables,
      settings,
      parameters,
      coverSpreadForInnerWrap,
      capability: capabilities.get('editPages'),
      env
    };

    const bottomPanelAction = {
      boundTemplateActions,
      boundProjectActions,
      boundTrackerActions,
      changeStep: this.onChangeStep,
      changePanelTab: this.onChangeBottomPanelTab,
      pageNumberActions
    };

    // 翻书组件的样式.
    const paginationStyle = {
      // 44: actionbar的宽高.
      // 30: 翻页按钮的高
      // 24：效果图白边.
      top: `${containerHeight / 2 + 44 - 30 - 24}px`
    };

    const paginationActions = { onPage: this.switchSheet };

    // 计算x-simple-pagination icon的大小
    // 520 是统计得出最小的高度
    let XsimpleScaleNumber =
      size.renderCoverSize.height < 520 ? size.renderCoverSize.height / 520 : 1;

    XsimpleScaleNumber = XsimpleScaleNumber < 0.5 ? 0.5 : XsimpleScaleNumber;

    const coverColorScaleNumber =
      XsimpleScaleNumber < 0.8 ? 0.8 : XsimpleScaleNumber;

    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      style: paginationStyle,
      iconCaleStyle: { transform: `scale(${XsimpleScaleNumber})` }
    };

    // 封面颜色块 样式.
    const coverColorChangerStyle = {
      // 444px :颜色块 的高度
      // 44: actionbar的宽高.
      top: `${(containerHeight - 444) / 2 + 44}px`
      // transform: `scale(${coverColorScaleNumber})`
    };

    const togglePannelData = {
      currentStep: panelStep
    };

    if (isCover) {
      newRatios.workspace = newRatios.coverWorkspace;
    } else {
      newRatios.workspace = newRatios.innerWorkspace;
    }

    // 调整btn列表与容器的位置.
    const btnListStyle = merge({}, sheetsOutContainerStyle, {
      marginTop: `${isAdvancedMode ? bleed.top - 7 : 0}px`,

      // 设置一个值, 防止它挡住actionbar
      height: '20px',
      zIndex: this.state.btnZindex
    });

    const screenshotData = {
      variables,
      materials,
      size,
      isPreview,
      settings,
      template,
      parameters,
      position,
      ratio: newRatios,
      paginationSpread,
      paginationSpreadForCover,
      urls: fromJS(urls),
      isCurrentPage: true,
      env
    };

    const { availableOptionMap } = this.state;
    const colorOptionList = availableOptionMap.leatherColor;
    let initColorIndex = 0;
    if (colorOptionList) {
      initColorIndex = colorOptionList.findIndex(
        o => o.id === setting.get('leatherColor')
      );
    }

    const coverColorChangerProps = {
      colorOptionList,
      initColorIndex,
      colorImgMap: allImgColors[setting.get('cover')],
      onColorChange: this.onColorChange,
      coverColorChangerStyle
    };

    const coverBgColorChangerProps = {
      cover: setting.get('cover'),
      selectedBgColor: page && page.get('bgColor'),
      coverBgColorChangerStyle: coverColorChangerStyle,
      onBgColorChange: this.onBgColorChange
    };

    // 只有数据准备好了后, 才渲染截图组件, 以防止产生无效的图片请求.
    /* ASH-5953: 【Photobook】实时切图中, 出现了很多width和height值为0的请求. */
    const shouldRenderScreenShot =
      paginationSpread.get('pages') &&
      paginationSpread.get('pages').size &&
      ratios.coverWorkspace;

    const dropExternalFilesClassName = classNames('drop-external-files', {
      active: this.state.isShowDropActive
    });

    return (
      <div
        className={className}
        ref={editpageNode => (this.editpageNode = editpageNode)}
        style={editpageStyle}
      >
        <div style={wrapStyle}>
          <div style={editRenderStyle}>
            {/* action bar */}
            <ActionBar actions={actionsBarActions} data={actionBarData} />
            <ToolTip
              active={this.state.isShowDisableTip}
              position="bottom"
              arrow="center"
              parent="#autofill"
              style={toolTipStyle}
              tooltipTimeout={0}
            >
              {t('DISABLE_AUTOFILL_TIP')}
            </ToolTip>

            {/* sheets list */}
            <div style={sheetsOutContainerStyle}>
              <div style={sheetsContainerStyle}>
                <SheetsList
                  actions={spreadsListActions}
                  data={spreadsListData}
                />
              </div>
            </div>

            {/* 翻页组件. */}
            {isEditParentBook ? null : (
              <XSimplePagination
                actions={paginationActions}
                data={paginationData}
              />
            )}

            <div
              className="btns-list"
              style={btnListStyle}
              onMouseEnter={this.onMouseEnterBtns}
              onMouseLeave={this.onMouseLeaveBtns}
            >
              {/* page序号 */}
              <PageNumber actions={pageNumberActions} data={pageNumberData} />

              <OptionalButtonList
                actions={OptionalButtonActions}
                data={optionalButtonData}
              />
            </div>

            {isCover ? <CoverColorChanger {...coverColorChangerProps} /> : null}
            {isCover ? (
              <CoverBgColorChanger {...coverBgColorChangerProps} />
            ) : null}
          </div>

          {/* layouts, pages */}
          <XTogglePanel onChangeStep={this.onChangeStep} {...togglePannelData}>
            <BottomPanel data={bottomPanelData} actions={bottomPanelAction} />
          </XTogglePanel>
        </div>

        {shouldRenderScreenShot ? <ScreenShot {...screenshotData} /> : null}

        <div className={dropExternalFilesClassName}>
          <span className="text">Drop here to upload</span>
        </div>
      </div>
    );
  }
}

EditPage.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapEditPageDispatchToProps)(
  translate('EditPage')(EditPage)
);
