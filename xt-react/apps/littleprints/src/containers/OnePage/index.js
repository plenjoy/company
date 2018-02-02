import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import Immutable, { Map } from 'immutable';
import { get, merge, pick } from 'lodash';
import classNames from 'classnames';

import { getSize } from '../../../../common/utils/helper';
// 导入selector
import { mapAppDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState';
import { productTypes } from '../../constants/strings';
import { addMouseWheelEvent } from '../../../../common/utils/mouseWheel';

import './index.scss';

// 导入组件
import SimplePagination from '../../components/SimplePagination';

import * as mainHandle from './handler/main';
import * as paginationHandler from './handler/pagination';

import SheetsList from '../../components/SheetsList';
import LayoutList from '../../components/LayoutList';

class OnePage extends Component {
  constructor(props) {
    super(props);


    this.handlerMouseWheel = dir => mainHandle.handlerMouseWheel(this, dir);
    // 翻页时的处理函数.
    this.switchSheet = (param) => {
      paginationHandler.switchSheet(this, param);
    };
    this.changeContainerTop = this.changeContainerTop.bind(this);

    this.state = {
      isNeedTransition: false
    };
  }

  changeContainerTop(pageIndex) {
    const { pagination, size } = this.props;

    let containerTop = 0;
    if (pageIndex) {
      paginationHandler.switchPageTo(this, 1);
    } else {
      paginationHandler.switchPageTo(this, 0);
    };
    this.setState({
      isNeedTransition: true
    });
  }

  componentDidMount() {
    // 绑定鼠标滚轮事件
    addMouseWheelEvent(this.productArea, (dir) => {
      this.handlerMouseWheel(dir);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { pagination } = nextProps;
    const oldSheetIndex = get(this.props, 'pagination.sheetIndex');
    const newSheetIndex = get(nextProps, 'pagination.sheetIndex');


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

    if (oldSheetIndex !== newSheetIndex) {
      paginationHandler.switchPage(this, nextProps);
      this.setState({
        isNeedTransition: false
      });
    } else if (oldPageId !== newPageId
    ) {
      this.setState({
        isNeedTransition: true
      });
    }

    if (
      ((!Immutable.is(oldPages, newPages) && newPages.size && !oldPageId) ||
        oldSheetsTotal !== newSheetsTotal) &&
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

  render() {
    const {
      t,
      env,
      size,
      ratios,
      urls,
      paginationSpread,
      spec,
      variables,
      pagination,
      settings,
      project,
      parameters,
      allImages,
      capability,
      template,
      styles,
      uploadedImages,

      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTemplateActions,
      boundTrackerActions
    } = this.props;

    const pages = paginationSpread.get('pages');

    const page = pages.find(p => p.get('id') === pagination.pageId);
    const isLandscapeShape = page && page.get('width') > page.get('height');
    const pageIndex = pages.findIndex(p => p.get('id') === pagination.pageId);
    const isPageEnable = page && page.get('enabled');
    const isCover = pagination.sheetIndex === 0;

    let newSize = size;
    if (isLandscapeShape) {
      newSize = merge({}, size, {
        renderCoverSheetSize: get(size, 'renderCoverSheetSize'),
        renderInnerSize: get(size, 'renderInnerSizeLandscape'),
        renderInnerContainerSize: get(size, 'renderInnerContainerSizeLandscape'),
        renderInnerSheetSize: get(size, 'renderInnerSheetSizeLandscape'),
        renderInnerSheetSizeWithoutBleed: get(size, 'renderInnerSheetSizeWithoutBleedLandscape')
      });
    }
    const ratio = {
      workspace: isCover
        ? get(ratios, 'coverWorkspace')
        : isLandscapeShape ? get(ratios, 'innerWorkspaceLandscape') : get(ratios, 'innerWorkspace')
    };
    const newRatios = merge({}, ratios, {
      innerWorkspace: isLandscapeShape ? get(ratios, 'innerWorkspaceLandscape') : get(ratios, 'innerWorkspace')
    });
    const coverTemplateList = merge({}, template, { list: get(template, 'list.coverTemplateList') });
    const innerTemplateList = merge({}, template, { list: get(template, 'list.innerTemplateList') });

    const coverLayoutListData = { paginationSpread, pagination, template: coverTemplateList, setting: settings, styles, page, baseUrls: urls, ratios: ratio, uploadedImages, isShow: isCover && isPageEnable, isCover };
    const innerLayoutListData = { paginationSpread, pagination, template: innerTemplateList, setting: settings, styles, page, baseUrls: urls, ratios: ratio, uploadedImages, isShow: !isCover, isCover };
    const layoutListActions = { boundTemplateActions, boundProjectActions, boundTrackerActions, boundPaginationActions };

    const { isNeedTransition } = this.state;

    const className = classNames('one-page');
    const productType = get(settings, 'spec.product');

    const containerWidth = pagination.sheetIndex === 0
        ? get(newSize, 'renderCoverSize.width')
        : get(newSize, 'renderInnerSize.width');

    const screenSize = getSize();
    const availableClient = {
      position: 'relative',
      width: `${screenSize.width - 280}px`,
      height: `${screenSize.height -77 - 130}px`
      // overflow: 'hidden'
    };

    const containerTop = 30;
    const sheetsContainerStyle = {
      width: `${containerWidth}px`,
      // height: `${containerHeight}px`,
      margin: '0 auto',
      position: 'relative',
      zIndex: 100,
      top: `${containerTop}px`,
      transition: pagination.sheetIndex === 0 || !isNeedTransition ? '' : 'top 0.7s'
    };

    const userId = get(env, 'userInfo').get('id');

    const spreadsListActions = {
      boundProjectActions,
      boundPaginationActions,
      boundTrackerActions,
      boundUploadImagesActions,
      boundImageEditModalActions,
      boundTextEditModalActions
    };

    const spreadsListData = {
      urls,
      size: newSize,
      ratios: newRatios,
      paginationSpread,
      variables,
      pagination,
      settings,
      project,
      parameters,
      allImages,
      userId,
      specData: spec,
      capability,
      isLandscapeShape
    };

    const paginationActions = { onPage: this.switchSheet };
    const paginationData = {
      total: pagination.total,
      current: pagination.sheetIndex,
      minSheetIndex: (productType === productTypes.LC || productType === productTypes.LPS) ? 1 : 0
    };

    return (
      <div className={className}>
        <div
          ref={productArea => this.productArea = productArea}
          className="available-client"
          style={availableClient}>
          {/* sheets list */}
          <div className="sheet-container" style={sheetsContainerStyle}>

            { get(size, 'renderCoverSize.width')
              ? <SheetsList actions={spreadsListActions} data={spreadsListData} />
              : null
            }
          </div>

          {/* 翻页组件. */}
          <SimplePagination
            actions={paginationActions}
            data={paginationData}
          />

          <div className="layout-wrap">
            <LayoutList key="coverLayout" data={coverLayoutListData} actions={layoutListActions} />
            <LayoutList key="innerLayout" data={innerLayoutListData} actions={layoutListActions} />
          </div>
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
