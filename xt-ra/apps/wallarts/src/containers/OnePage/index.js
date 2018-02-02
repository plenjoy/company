import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import classNames from 'classnames';

// 导入组件
import SideBar from '../../components/SideBar';
import SideMenu from '../../components/SideMenu';
import SheetsList from '../../components/SheetsList';
import PhotoQuantitySwitch from '../../components/PhotoQuantitySwitch';
import ColorMenus from '../../components/ColorMenus';
import ShapeMenus from '../../components/ShapeMenus';
import SimplePagination from '../../components/SimplePagination';
import OrientationSelector from '../../components/OrientationSelector';
// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';

import { toggleModal } from './handler/main';
import * as paginationHandler from './handler/pagination';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import * as externalDropHandle from './handler/externalDrop';

import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';

import './index.scss';

class OnePage extends Component {
  constructor(props) {
    super(props);
    const { boundUploadImagesActions } = props;
    this.toggleModal = (type, status) =>
      toggleModal(boundUploadImagesActions, type, status);
    // 翻页时的处理函数.
    this.switchSheet = param => {
      paginationHandler.switchSheet(this, param);
    };

    this.stopEvent = event => {
      event.stopPropagation();
      event.preventDefault();

      return false;
    };

    this.onDragEnterExternalFiles = ev => {
      externalDropHandle.onDragEnterExternalFiles(ev, this);

      ev.stopPropagation();
      ev.preventDefault();
      return false;
    };

    this.onDragEndExternalFiles = ev => {
      externalDropHandle.onDragEndExternalFiles(ev, this);

      ev.stopPropagation();
      ev.preventDefault();
      return false;
    };

    this.onDropedExternalFiles = ev => {
      externalDropHandle.onDropedExternalFiles(ev, this);

      ev.stopPropagation();
      ev.preventDefault();
      return false;
    };
    this.state = {
      isShowDropActive: false
    };
  }

  componentWillMount() {
    const pageIndex = get(this.props, 'pagination.pageIndex');
    const pageId = get(this.props, 'pagination.pageId');

    // 如果pageIndex无效或pageId为空, 就重新切换到有效的页面.
    if (pageIndex === -1 || !pageId) {
      paginationHandler.switchPage(this, this.props);
    }
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
  }

  componentDidMount() {
    addEventListener(document, 'dragenter', this.onDragEnterExternalFiles);
    addEventListener(document, 'dragend', this.onDragEndExternalFiles);
    addEventListener(document, 'dragleave', this.onDragEndExternalFiles);
    addEventListener(document, 'dragover', this.stopEvent);
    addEventListener(document, 'drop', this.onDropedExternalFiles);
  }

  componentDidUpdate() {
    const { boundLoadingModalAction } = this.props;
    window.timer && clearTimeout(window.timer);
    window.timer = setTimeout(function() {
      boundLoadingModalAction.hide();
    }, 1000);
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
      t,
      env,
      spec,
      settings,
      project,
      imageStatus,
      pagination,
      parameters,
      variables,
      allImages,
      materials,
      urls,
      size,
      ratios,
      snipping,
      capabilities,
      uploadedImages,
      imageUsedMap,
      toggleModal,
      isSplit,
      isShowSwitch,
      paginationSpread,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundPaginationActions,
      boundUploadImagesActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      loadingModal,
      boundLoadingModalAction
    } = this.props;
    const baseUrls = env.urls;
    const { uploadStatus } = this;
    const useNewUpload = false;
    const isPreview = false;
    const productSize = settings.get('size');
    const isSquareSize =
      productSize && productSize.split('X')[0] === productSize.split('X')[1];
    const userId = env.userInfo.get('id');
    const orientation = settings.get('orientation');

    const sideBarActions = {
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      toggleModal: this.toggleModal,
      boundLoadingModalAction
    };
    const sideBarData = {
      settings,
      project,
      uploadedImages,
      baseUrls,
      imageUsedMap,
      uploadStatus: imageStatus,
      useNewUpload,
      spec
    };
    const paginationActions = { onPage: this.switchSheet };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      minSheetIndex: 0
    };
    const spreadsListActions = {
      boundProjectActions,
      boundPaginationActions,
      boundTrackerActions,
      boundUploadImagesActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundLoadingModalAction,
      boundImagesActions
    };
    const spreadsListData = {
      urls,
      size,
      ratios,
      paginationSpread,
      variables,
      pagination,
      settings,
      project,
      parameters,
      allImages,
      materials,
      userId,
      snipping,
      specData: spec,
      capability: capabilities.get('editPages'),
      isSplit
    };

    const photoQuantitySwitchData = {
      settings
    };

    const photoQuantitySwitchActions = {
      boundProjectActions
    };

    const sideMenuData = { size, project };
    const sideMenuActions = {};
    const colorMenusData = { project };
    const colorMenusActions = { boundProjectActions };
    const shapeMenusData = { project };
    const shapeMenusActions = { boundProjectActions };

    const dropExternalFilesClassName = classNames('drop-external-files', {
      active: this.state.isShowDropActive
    });

    return (
      <div className="one-page">
        <SideBar actions={sideBarActions} data={sideBarData} />
        <div className="available-client">
          {/* 翻页组件. */}
          {/* <SimplePagination
            actions={paginationActions}
            data={paginationData}
          /> */}
          {isSquareSize ? null : (
            <div className="top-buttons-wrap">
              <OrientationSelector
                changeOrientation={boundProjectActions.changeProjectSetting}
                orientation={orientation}
                applyRelativeTemplate={this.applyRelativeTemplate}
                boundTrackerActions={boundTrackerActions}
              />
            </div>
          )}

          {/* sheets list */}
          <div className="sheet-container">
            {get(size, 'renderBgSize.width') ? (
              <SheetsList actions={spreadsListActions} data={spreadsListData} />
            ) : null}

            {get(size, 'renderBgSize.width') ? (
              <SideMenu data={sideMenuData} actions={sideMenuActions}>
                {isShowSwitch ? (
                  <PhotoQuantitySwitch
                    data={photoQuantitySwitchData}
                    actions={photoQuantitySwitchActions}
                  />
                ) : null}
                <ShapeMenus data={shapeMenusData} actions={shapeMenusActions} />
                <ColorMenus data={colorMenusData} actions={colorMenusActions} />
              </SideMenu>
            ) : null}
          </div>
          <div className={dropExternalFilesClassName}>
            <span className="text">Drop here to upload</span>
          </div>
          <XLoading
            loadingText="Loading..."
            isShown={loadingModal.get('isShown')}
            hasText={'loading'}
          />
        </div>
      </div>
    );
  }
}

OnePage.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapAppDispatchToProps)(
  translate('OnePage')(OnePage)
);
