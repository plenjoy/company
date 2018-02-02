import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import Immutable, { Map } from 'immutable';
import { get, merge, pick } from 'lodash';
import classNames from 'classnames';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

// 导入selector
import { mapEditPageDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/editPage';

import './index.scss';

// 导入组件
import XSimplePagination from '../../../../common/ZNOComponents/XSimplePagination';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import SheetsList from '../../components/SheetsList';
import RichCoverTypesSwitch from '../../components/RichCoverTypesSwitch';
import PaperTypesSwitch from '../../components/PaperTypesSwitch';
import ColorSchemasList from '../../components/ColorSchemas';
import LayoutList from '../../components/LayoutList';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import XTogglePanel from '../../../../common/ZNOComponents/XTogglePanel';
import PageNavigation from '../../components/PageNavigation';
import PageNumber from '../../components/PageNumber';

// 导入handler
import * as handler from './handler/editPage';
import * as paginationHandler from './handler/pagination';
import * as layoutHandler from './handler/layout';
import * as coverTypeHandler from './handler/coverType';
import * as projectSettingsHandler from './handler/projectSettings';
import * as togglePanelHandler from './handler/togglePanel';
import * as externalDropHandle from './handler/externalDrop';

class EditPage extends Component {
  constructor(props) {
    super(props);
    const { t, togglePanel } = this.props;
    // 判断是否已有render图.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    const isPaperCover = props.paginationSpread.getIn([
      'summary',
      'isPaperCover'
    ]);
    // 内部state.
    this.state = {
      loading: {
        isShown: false
      },
      hasCoverRender: !!coverEffectImg,
      isSettingloaded: false,

      // 1: switch to image cover
      // 2: switch to text cover
      coverTypeSwitchValue: props.isImageCover ? 1 : 2,

      // 1: paper cover
      // 2: hard cover
      paperTypeSwitchValue: isPaperCover ? 1 : 2,

      // 主题列表.
      colorSchemas: [],
      currentSchemaId: '',
      panelStep: togglePanel.get('step'),
      centerTop: 0,
      colorSchemasTop: 0,
      isShowDropActive: false
    };

    // toggle panel.
    this.onChangeStep = step => togglePanelHandler.onChangeStep(this, step);

    // 保存项目
    this.saveProject = () => handler.saveProject(this);

    this.setCenterTop = () => handler.setCenterTop(this);
    this.changeColorSchema = (schema, index) => {
      projectSettingsHandler.changeColorSchema(this, schema, index);
    };

    // 翻页时的处理函数.
    this.switchSheet = (param) => {
      paginationHandler.switchSheet(this, param);
    };

    // 切换page到指定的页面.
    this.switchPageTo = (pageIndex) => {
      paginationHandler.switchPageTo(this, pageIndex);
    };

    this.onSwitchCoverType = (value) => {
      coverTypeHandler.onSwitchCoverType(this, value);
    };

    this.onSwitchPaperType = (value) => {
      projectSettingsHandler.onSwitchPaperType(this, value);
    };

    this.applyTemplate = guid => layoutHandler.applyTemplate(this, guid);
    this.doAutoLayout = addedElements =>
      layoutHandler.doAutoLayout(this, addedElements);

    /** *********拖拽电脑上的图片到app中************* */
    this.stopEvent = (event) => {
      event.stopPropagation();
      event.preventDefault();

      return false;
    };

    this.onDragEnterExternalFiles = (event) => {
      externalDropHandle.onDragEnterExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    this.onDragEndExternalFiles = (event) => {
      externalDropHandle.onDragEndExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    this.onDropedExternalFiles = (event) => {
      externalDropHandle.onDropedExternalFiles(event, this);

      event.stopPropagation();
      event.preventDefault();
      return false;
    };
    /** ********************** */
  }

  componentDidMount() {
    // 从arrangePage跳转到editPage时，需要切换到正确的page
    paginationHandler.switchPage(this, this.props);

    addEventListener(document, 'dragenter', this.onDragEnterExternalFiles);
    addEventListener(document, 'dragend', this.onDragEndExternalFiles);
    addEventListener(document, 'dragleave', this.onDragEndExternalFiles);
    addEventListener(document, 'dragover', this.stopEvent);
    addEventListener(document, 'drop', this.onDropedExternalFiles);
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

    const oldSheetsTotal = get(this.props, 'pagination.total');
    const newSheetsTotal = get(nextProps, 'pagination.total');

    const isProjectLoadCompleted = nextProps.project.get('isProjectLoadCompleted');

    if (
      ((!Immutable.is(oldPages, newPages) && newPages.size && !oldPageId) ||
        oldSheetsTotal !== newSheetsTotal) &&
      isProjectLoadCompleted
    ) {
      paginationHandler.switchPage(this, nextProps);
    }

    // 程序的启动时, 会初始化project两次. 这就导致了pagination上的pageId没有同步的问题.
    // 解决方案是: 等project加载完毕后, 我们再初始化pagination.
    const newPageId = get(nextProps, 'pagination.pageId');
    if (isProjectLoadCompleted && !newPageId) {
      paginationHandler.switchPage(this, nextProps);
    }

    // 设置color schemas.
    if (isProjectLoadCompleted) {
      projectSettingsHandler.setColorSchemas(this);
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

    // 判断当前的封面是image cover还是text cover.
    if (this.props.isImageCover !== nextProps.isImageCover) {
      this.setState({
        coverTypeSwitchValue: nextProps.isImageCover ? 1 : 2
      });
    }

    // 判断当前的封面是paper covr还是hard cover.
    const isPaperCoverInOld = this.props.paginationSpread.getIn([
      'summary',
      'isPaperCover'
    ]);
    const isPaperCoverInNew = nextProps.paginationSpread.getIn([
      'summary',
      'isPaperCover'
    ]);
    if (isPaperCoverInOld !== isPaperCoverInNew) {
      this.setState({
        paperTypeSwitchValue: isPaperCoverInNew ? 1 : 2
      });
    }
  }

  componentWillUnmount() {
    removeEventListener(document, 'dragenter', this.onDragEnterExternalFiles);
    removeEventListener(document, 'dragend', this.onDragEndExternalFiles);
    removeEventListener(document, 'dragleave', this.onDragEndExternalFiles);
    removeEventListener(document, 'dragover', this.stopEvent);
    removeEventListener(document, 'drop', this.onDropedExternalFiles);
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
      parameters,
      project,
      allImages,
      allSheets,
      specData,
      navPagesRatios,
      navPagesPosition,
      navPagesSize,
      arrangePagesSize,
      capability,
      allElements,

      // actions
      boundProjectActions,
      boundPaginationActions,
      boundPaintedTextModalActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTemplateActions,
      boundTrackerActions
    } = this.props;

    const specSize = get(settings, 'spec.size');
    const pageId = get(pagination, 'pageId');

    const summary = paginationSpread.get('summary');
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
      boundTrackerActions,
      boundTemplateActions,
      doAutoLayout: this.doAutoLayout,
      applyTemplate: this.applyTemplate,
      switchSheet: this.switchSheet
    };
    const {
      panelStep,
      hasCoverRender,
      centerTop,
      colorSchemasTop
    } = this.state;

    const editpageStyle = {
      top: `${centerTop}px`
    };

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    const newRatios = merge({}, ratios);
    const newNavPagesRatios = merge({}, navPagesRatios);

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

    const userId = get(env, 'userInfo').get('id');

    const spreadsListData = {
      urls,
      size,
      ratios: newRatios,
      position,
      materials,
      paginationSpread,
      variables,
      template,
      pagination,
      settings,
      project,
      parameters,
      snipping,
      allImages,
      allElements,
      undoData,
      userId,
      capability,
      env
    };

    // 封装actions方法到一个对象, 以减少组件属性的传递.
    // 顶部导航方法与数据
    const pages = paginationSpread.get('pages');
    const page = pages.find((p) => {
      return p.get('id') === pageId;
    });

    const isCover = summary.get('isCover');

    // 只要当spread有值的时候, 才显示画布.
    const className = classNames('edit-page', { hide: !pages.size });

    // sheet容器.
    const containerWidth =
      pagination.sheetIndex === 0
        ? size.renderCoverSize.width
        : size.renderInnerSize.width;
    const containerHeight =
      pagination.sheetIndex === 0
        ? size.renderCoverSize.height
        : size.renderInnerSize.height;

    // 加一个container容器, 为了使封面和内页渲染在相同大小的容器内.
    const sheetsContainerStyle = {
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      margin: '0 auto',
      position: 'relative',
      zIndex: 100,
      display: hasCoverRender ? 'block' : 'none'
    };

    const wrapStyle = {};
    const btnListStyle = {
      display: hasCoverRender ? 'block' : 'none'
    };
    const togglePannelData = {
      currentStep: panelStep,
      hasIcons: false
    };
    const scaleNumber = handler.setColorSchemaScaleNumber(containerHeight);
    // 翻书组件的样式.
    const paginationStyle = {
      // 48: top btn的宽高.
      top: `${(containerHeight - 48) / 2}px`,
      right: '10px',
      left: '10px'
    };
    const rightBtnStyle = {
      // 右边rightBtn+colorshemy高度425
      top: `${(containerHeight - 425) / 2}px`,
      transform: `scale(${scaleNumber})`
    };
    const paginationActions = { onPage: this.switchSheet };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      style: paginationStyle,
      iconCaleStyle: { transform: `scale(${scaleNumber})` }
    };

    // pageNumber
    const pageNumber = paginationSpread.get('pageNumber');
    const pageNumberStyle = {
      width: isCover
        ? `${size.renderCoverSize.width}px`
        : `${size.renderInnerSize.width}px`
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

    // PageNavigation
    const pageNavigationActions = {
      pageNumberActions
    };
    const pageNavigationData = {
      pagination,
      allSheets,
      specData,
      urls,
      materials,
      variables,
      settings,
      parameters,
      navPagesRatios: newNavPagesRatios,
      navPagesPosition,
      navPagesSize,
      env
    };

    // 6X6, 8X8公用一套内页的模板.
    const fixedProductSize = isCover
      ? specSize
      : specSize !== '5X7' ? '6X6' : '5X7';
    const layoutListData = {
      template,
      page,
      size: fixedProductSize,
      templateThumbnailPrefx: get(urls, 'templateThumbnailPrefx')
    };

    const layoutListActions = {
      applyTemplate: this.applyTemplate
    };

    const btnStyle = {
      visibility: isCover ? 'visible' : 'hidden'
    };

    // 内页: 只有包含两张图时, 才显示layout list.
    const isShowLayoutList = hasCoverRender;

    const dropExternalFilesClassName = classNames('drop-external-files', {
      active: this.state.isShowDropActive
    });

    return (
      <div
        className={className}
        ref={editpageNode => (this.editpageNode = editpageNode)}
        style={editpageStyle}
      >
        <div style={wrapStyle} className="wrap">
          {/* sheets list */}
          <div style={sheetsContainerStyle} className="edit-page-core">
            <SheetsList actions={spreadsListActions} data={spreadsListData} />
          </div>

          <XSimplePagination
            actions={paginationActions}
            data={paginationData}
          />

          <div className="btns-list" style={btnListStyle}>
            {/* page序号 */}
            <PageNumber actions={pageNumberActions} data={pageNumberData} />
          </div>

          {/* layouts, pages */}
          <XTogglePanel onChangeStep={this.onChangeStep} {...togglePannelData}>
            <PageNavigation
              actions={pageNavigationActions}
              data={pageNavigationData}
            />
          </XTogglePanel>

          {/* 主题列表 */}
          {hasCoverRender && isCover ? (
            <div className="right-btn-list" style={rightBtnStyle}>
              <RichCoverTypesSwitch
                value={this.state.paperTypeSwitchValue}
                onSwitch={this.onSwitchPaperType}
              />

              <ColorSchemasList
                schemas={this.state.colorSchemas}
                currentSchemaId={this.state.currentSchemaId}
                onClicked={this.changeColorSchema}
              />
            </div>
          ) : null}
        </div>

        {isShowLayoutList ? (
          <LayoutList data={layoutListData} actions={layoutListActions} />
        ) : null}

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
export default connect(mapStateToProps, mapEditPageDispatchToProps)(translate('EditPage')(EditPage));
