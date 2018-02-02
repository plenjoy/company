import React, { Component, PropTypes } from 'react';
import { merge, template, get, set, isEqual } from 'lodash';
import { translate } from "react-translate";
import XAddText from '../../../common/ZNOComponents/XAddText';
import { getSize, getScreenSize } from '../../../common/utils/helper';
import { convertObjIn } from '../../../common/utils/typeConverter';
import { workSpacePrecent, sideBarWidth, spreadTypes, bottomHeight, topHeight } from '../../contants/strings';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import { combineImgCopperUrl, loadImg } from '../../../common/utils/image';
import { getRotatedAngle, getDefaultCropLRXY } from '../../../common/utils/crop';
import { elementTypes, panelTypes, productTypes, pageTypes } from '../../contants/strings';
import { Element } from '../../../common/utils/entry';
import { getDefaultCrop } from '../../../common/utils/crop';
import { ClickCropImage, ClickRotateImage, ClickRemoveImage, AddText } from '../../contants/trackerConfig';

import XDrop from '../../../common/ZNOComponents/XDrop';

import Spread from '../Spread';
import Loading from '../Loading';
import OutInSide from '../OutInSide';
import MainRenderContainer from '../MainRenderContainer';
import OperationPanel from '../OperationPanel';
import AddCoverElementButtons from '../AddCoverElementButtons';
import PageNumberIcon from '../PageNumberIcon';
import PageRotateButtons from '../PageRotateButtons';

import * as textHandler from './handler/textHandler';
import * as cameoHandler from './handler/cameo';
import * as paginationHandler from './handler/pagination';

import { initWorkspace } from './handler/initWorkspace';
import './index.scss';

class WorkSpace extends Component {
  constructor(props) {
    super(props);

    // 初始化state
    const { paginationSpread, isPreview, coverPageSpread } = this.props;
    const coverBackgroundSize = get(coverPageSpread, 'backgroundSize');
    this.state = initWorkspace(paginationSpread, coverBackgroundSize, isPreview);
    this.addResizeEvent = this.addResizeEvent.bind(this);
    // this.getMainRenderHtml = this.getMainRenderHtml.bind(this);

    // cameo, painted text按钮的处理函数.
    this.onAddCameo = event => cameoHandler.onAddCameo(this, event);
    this.hideCameoActionBar = () => cameoHandler.hideCameoActionBar(this);
    this.onRemoveCameo = () => cameoHandler.onRemoveCameo(this);
    this.onAddSpineText = () => cameoHandler.onAddSpineText(this);
    this.onAddCoverText = pageType => cameoHandler.onAddCoverText(this, pageType);

    this.switchPageTo = pageIndex => paginationHandler.switchPageTo(this, pageIndex);
  }

  componentWillReceiveProps(nextProps) {
    const oldPaginationSpread = this.props.paginationSpread;
    const newPaginationSpread = nextProps.paginationSpread;

    const coverBackgroundSize = get(nextProps, 'coverPageSpread.backgroundSize');

    const { boundWorkspaceActions, isPreview } = this.props;
    if (!isEqual(oldPaginationSpread, newPaginationSpread)) {
      const workSpaceParams = initWorkspace(newPaginationSpread, coverBackgroundSize, isPreview);
      this.setState(workSpaceParams);
      if (workSpaceParams.rate !== this.state.rate) {
        boundWorkspaceActions && boundWorkspaceActions.updateWorkspaceRatio(workSpaceParams.rate);
      };
    }

    // 当sheetIndex变化时, 更新pageId.
     const oldSheetIndex = get(this.props, 'pagination.sheetIndex');
     const newSheetIndex = get(nextProps, 'pagination.sheetIndex');

     if (oldSheetIndex !== newSheetIndex) {
       paginationHandler.switchPage(this, nextProps);
     }

     const pageIndex = get(nextProps, 'pagination.pageIndex');
     const pageId = get(nextProps, 'pagination.pageId');
     const { pages } = newPaginationSpread;
     const isPageIdMatched = pages.some(p => p.id === pageId);

    // 如果pageIndex无效或pageId为空, 就重新切换到有效的页面.
     if (pageIndex === -1 || !pageId || !isPageIdMatched) {
       paginationHandler.switchPage(this, nextProps);
     }
  }

  /**
   * 挂载后, 就加上onresize事件.
   */
  componentDidMount() {
    // 当窗口大小改变时, 重新设置workspace的大小.
    this.addResizeEvent();
  }

  /**
   * 在卸载之前, 取消onresize事件.
   */
  componentWillUnmount() {
    window.onresize = null;
  }

  /**
   * onresize的处理函数, 更改state.
   */
  addResizeEvent() {
    let timer = null;

    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const { boundWorkspaceActions, paginationSpread, isPreview, coverPageSpread } = this.props;
        const coverBackgroundSize = get(coverPageSpread, 'backgroundSize');
        const state = initWorkspace(paginationSpread, coverBackgroundSize, isPreview);
        this.setState(state);
        boundWorkspaceActions && boundWorkspaceActions.updateWorkspaceRatio(state.rate);
      }, 500);
    });
  }

  /**
   * 点击查看封面页时.
   */
  onOutside() {
    const { boundPaginationActions, pagination } = this.props;
    const { sheetIndex } = pagination;
    if (sheetIndex !== 0) {
      boundPaginationActions.switchSheet(0);
    }
  }

  /**
   * 点击查看里面页时.
   */
  onInside() {
    const { boundPaginationActions, pagination } = this.props;
    const { sheetIndex } = pagination;
    if (sheetIndex !== 1) {
      boundPaginationActions.switchSheet(1);
    }
  }

  /**
   * 当panel type是 image wrapped时, 才需要显示切换按钮.
   */
  getBottomBtnHtml() {
    let html = '';
    const { setting, pagination } = this.props;
    const { sheetIndex } = pagination;
    if (setting && setting.product !== productTypes.woodBox) {
      html = (<OutInSide
        sheetIndex={sheetIndex}
        onLeftClicked={this.onOutside.bind(this)}
        onRightClicked={this.onInside.bind(this)}
      />);
    }

    return html;
  }

  addText() {
    const {
      boundProjectActions,
      baseUrls,
      ratio,
      boundTrackerActions,
      pagination,
      paginationSpread,
      elementArray
    } = this.props;

    textHandler.addText({
      boundProjectActions,
      baseUrls,
      ratio,
      boundTrackerActions,
      pagination,
      paginationSpread,
      elementArray
    });

    boundTrackerActions.addTracker(AddText);
  }

  render() {
    // console.log('workspace state', this.state);
    // t方法是用于本地化, 通过传入的key, 来获取对应的value.
    const {
      children,
      t,
      loadingData,
      addText,
      operationPanel,
      paginationSpread,
      boundProjectActions,
      baseUrls,
      pagination,
      boundPaginationActions,
      boundSystemActions,
      boundTrackerActions,
      setting,
      variableMap,
      parameterMap,
      boundUploadedImagesActions,
      toggleModal,
      boundWorkspaceActions,
      editText,
      coverPageSpread,
      innerPageSpread,
      isPreview,
      isProjectLoadCompleted,
      elementArray,
      editTextWithoutJustify,
      orderState,
      userInfo
    } = this.props;
    const { workspaceSize, rate, left } = this.state;
    const { pages, summary, backgroundSize } = paginationSpread;
    const {
      cameo,
      isCover,
      hasCameoElement,
      isSupportPaintedText
    } = summary;
    const product = get(setting, 'product');

    const workSpaceStyle = {
      width: `${workspaceSize.width}px`,
      height: `${workspaceSize.height}px`,
      left: `${left}px`,
      marginTop: isPreview ? '50px' : '112px',
      position: 'absolute'
    };

    let spineCount = 0;
    const spinePage = get(coverPageSpread, 'pages').find(p => get(p, 'type') == pageTypes.spine);
    if (spinePage) {
      spineCount = get(spinePage, 'elements').length;
    }

    const cameoPaintedActions = {
      onAddCameo: this.onAddCameo,
      onRemoveCameo: this.onRemoveCameo,
      onAddSpineText: this.onAddSpineText,
      onAddCoverText: this.onAddCoverText
    };

    const cameoPaintedData = {
      isShowCameo: isCover && cameo !== 'none',
      // isShowCameo: variableMap && isCover ? variableMap.cameoSupportCondition : false,
      isShowAddCameoBtn: !hasCameoElement,
      isTwoDvdType: get(setting, 'dvdType') === 'two',
      isShowPaintedText: isSupportPaintedText,
      shouldShowSpineText: isSupportPaintedText,
      spineCount,
      isSupportSpinePaintedText: isSupportPaintedText
    };

    // 查看当前页面是否有可以操作的页面。
    const hasEnablePage = pages.some(p => p.enabled);

    const { bgImageWidth, paddingLeft, paddingRight } = backgroundSize;

    const centerAreaWidth = (bgImageWidth - paddingLeft - paddingRight) * rate;

    const pageNumberStyle = {
      width: `${centerAreaWidth}px`
    };

    const hasLeftPage = pages.find(p => p.position === 'left');
    const hasRightPage = pages.find(p => p.position === 'right') && product !== productTypes.usbCase;

    const pageNumberActions = { switchPage: this.switchPageTo };
    const pageNumberData = { pagination, style: pageNumberStyle, hasLeftPage, hasRightPage, pagesLength: pages.length };

    // 判断 woodbox cover 页面的 旋转值
    let woodCoverRotation = false;
    if (isCover && product === productTypes.woodBox) {
      const fullPage = pages.find(p => p.type === pageTypes.full);
      if (fullPage) {
        woodCoverRotation = get(fullPage, 'rotate');
      }
    }

    return (
      <section className="work-space" ref="workSpace" style={workSpaceStyle}>
        {children}

          {/* add text 按钮 */}
          {
            !isPreview
              ? (
                <div className="btn-list">
                  {
                    product === productTypes.woodBox
                      ? <PageRotateButtons rotateCover={boundProjectActions.rotateCover} rotation={woodCoverRotation} />
                      : hasEnablePage
                          ? <XAddText text={t('ADD_TEXT')} onClicked={this.addText.bind(this)} />
                          // ? <XAddText text={t('ADD_TEXT')} onClicked={addText} />
                          : null
                  }
                </div>
              )
              : null
          }

        <div className="image-editor">
          <MainRenderContainer
            paginationSpread={paginationSpread}
            boundProjectActions={boundProjectActions}
            boundPaginationActions={boundPaginationActions}
            boundSystemActions={boundSystemActions}
            boundUploadedImagesActions={boundUploadedImagesActions}
            boundWorkspaceActions={boundWorkspaceActions}
            boundTrackerActions={boundTrackerActions}
            toggleModal={toggleModal}
            pagination={pagination}
            parameterMap={parameterMap}
            variableMap={variableMap}
            setting={setting}
            urls={baseUrls}
            rate={rate}
            editText={editText}
            editTextWithoutJustify={editTextWithoutJustify}
            isPreview={isPreview}
            coverPageSpread={coverPageSpread}
            innerPageSpread={innerPageSpread}
            isProjectLoadCompleted={isProjectLoadCompleted}
            elementArray={elementArray}
            userInfo ={userInfo}
          />
        </div>

        {/* 查看封面和里面的按钮 */}
        <div className="btn-list m-b-66" style={pageNumberStyle}>
          {
            isPreview || !isProjectLoadCompleted
              ? null
              : isCover
                  ? (!orderState || orderState.checkFailed) ? null : (<AddCoverElementButtons actions={cameoPaintedActions} data={cameoPaintedData} />)
                  : product === productTypes.dvdCase && pages.length === 2
                    ? <PageNumberIcon actions={pageNumberActions} data={pageNumberData} />
                    : null
          }
          {
            isProjectLoadCompleted
              ? this.getBottomBtnHtml()
              : null
          }
        </div>
      </section>
    );
  }
}

WorkSpace.propTypes = {
  spreads: PropTypes.any,
  baseUrls: PropTypes.any,
  uploadBaseUrl: PropTypes.string
  // spreads: PropTypes.arrayOf(PropTypes.shape({
  //   textInCenter: PropTypes.string,
  //   bgColor: PropTypes.string,
  //   width: PropTypes.number,
  //   height: PropTypes.number,
  //   bleedTop: PropTypes.number,
  //   bleedBottom: PropTypes.number,
  //   bleedLeft: PropTypes.number,
  //   bleedRight: PropTypes.number,
  //   spineThicknessWidth: PropTypes.number,
  //   wrapSize: PropTypes.number
  // }),
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('WorkSpace')(WorkSpace);
