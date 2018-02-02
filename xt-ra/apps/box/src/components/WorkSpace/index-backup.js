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
import { elementTypes, panelTypes } from '../../contants/strings';
import { Element } from '../../../common/utils/entry';
import { getDefaultCrop } from '../../../common/utils/crop';
import { ClickCropImage, ClickRotateImage, ClickRemoveImage } from '../../contants/trackerConfig';
import securityString from '../../../../common/utils/securityString';
import XDrop from '../../../common/ZNOComponents/XDrop';

import Spread from '../Spread';
import Loading from '../Loading';
import OutInSide from '../OutInSide';
import MainRenderContainer from '../MainRenderContainer';
import OperationPanel from '../OperationPanel';

import { getBgParams } from './handler/carculate';
import './index.scss';

class WorkSpace extends Component {
  constructor(props) {
    super(props);

    // 初始化state
    this.state = this.initWorkspace();
    this.getMainRenderHtml = this.getMainRenderHtml.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const baseUrls = get(nextProps, 'baseUrls');

    // spreads有更新时, 就只更新spreadsOptions
    if (!isEqual(this.props.spreads, nextProps.spreads)) {
      const { boundWorkspaceActions } = nextProps;
      const { spreads, texts } = nextProps;
      const spreadOptions = this.formatSpreadOptions(spreads, texts);
      boundWorkspaceActions.updateSpreads(spreadOptions);

      if (spreadOptions && spreadOptions.length) {
        let index = this.getCurrentSpreadIndex();

        // bug修复: ASH-1171: 【image box】编辑页面中image wrapped处于inside，options中切换到black leatherette时无任何反应
        // 方案: 检查上一次显示的spread的索引, 是否大于当前所有的spread的长度, 如果大于, 就使用第一个spread作为默认显示值.
        index = spreadOptions.length > index ? index : 0;
        boundWorkspaceActions.changeSpread(spreadOptions[index !== -1 ? index : 0]);
      }

      this.setState({
        spreadOptions
      });
    }

    // currentSpread有更新时, 就只更新currentSpread数据
    if (!isEqual(this.props.currentSpread, nextProps.currentSpread)) {

      this.setState({
        currentSpread: nextProps.currentSpread
      });
    }

    // baseUrls数据有更新时, 就只更新baseUrls的数据.
    if (!isEqual(this.state.baseUrls, baseUrls) && baseUrls) {
      const imageBaseUrl = template(IMAGES_CROPPER)(baseUrls);
      this.setState({
        baseUrls,
        imageBaseUrl
      });
    }
  }

  /**
   * 挂载后, 就加上onresize事件.
   */
  componentDidMount() {
    // 当窗口大小改变时, 重新设置workspace的大小.
    this.addResizeEvent();

    const { boundWorkspaceActions } = this.props;

    window.addEventListener('click', () => {
      boundWorkspaceActions.toggleOperationPanel(false);
    });
  }

  /**
   * 在卸载之前, 取消onresize事件.
   */
  componentWillUnmount() {
    window.onresize = null;
  }

  /**
   * 根据props的值, 初始化state的值.
   */

  initWorkspace(props) {
    const { spreads, baseUrls, currentSpread, texts, boundWorkspaceActions } = props || this.props;
    const spreadOptions = this.formatSpreadOptions(spreads, texts);

    boundWorkspaceActions.updateSpreads(spreadOptions);

    const state = {
      baseUrls,

      // spread的绘制参数
      spreadOptions,

      // 当前显示的spread
      currentSpread,

      // 在当前的spread中, 渲染的photoelement的索引.
      activePhotoElementIndex: 0,

      // 点击画布, 弹出的操作面板.
      // operations: {
      //   shown: false,
      //   offset: {
      //     top: 150,
      //     left: 500
      //   }
      // }
    };

    return state;
  }

  formatSpreadOptions(spreads, texts) {
    const { imageArray } = this.props;
    const spreadsOptions = [];
    if (!spreads || !spreads.length) {
      return spreadsOptions;
    }

    spreads.forEach((s) => {
      const pageSize = getSize();

      let wsPrecent;
      switch (s.type) {
        case spreadTypes.coverPage:
          wsPrecent = workSpacePrecent.big;
          break;
        case spreadTypes.innerPage:
          wsPrecent = workSpacePrecent.big;
          break;
        default:
          break;
      }

      if (wsPrecent) {
        const realBgSize = getBgParams(s.width - 2*(s.bleedLeft + s.wrapSize), s.height - 2*(s.bleedTop + s.wrapSize));

        // const wsSize = this.getWorkspaceAvailableSize(pageSize, s.width, s.height, wsPrecent);
        const wsSize = this.getWorkspaceAvailableSize(pageSize, realBgSize.realBgWidth, realBgSize.realBgHeight, wsPrecent);
        // const containerSizeBaseOnScreen = this.getWorkspaceAvailableSize(getScreenSize(), s.width, s.height, wsPrecent);
        const containerSizeBaseOnScreen = this.getWorkspaceAvailableSize(getScreenSize(), realBgSize.realBgWidth, realBgSize.realBgHeight, wsPrecent);

        // console.log('wssize', wsSize);
        const workspaceWidth = wsSize.workspaceWidth; //(pageSize.width - sideBarWidth) * wsPrecent;
        // const rate = workspaceWidth / s.width;
        const rate = workspaceWidth / realBgSize.realBgWidth;
        const left = sideBarWidth + (((pageSize.width - sideBarWidth) - workspaceWidth) / 2);
        const opt = merge({}, s, {
          bgWidth: realBgSize.realBgWidth * rate,
          bgHeight: realBgSize.realBgHeight * rate,
          bgX: realBgSize.realX * rate,
          bgY: realBgSize.realY * rate,
          width: s.width * rate,
          height: s.height * rate,
          bleedTop: s.bleedTop * rate,
          bleedBottom: s.bleedBottom * rate,
          bleedLeft: s.bleedLeft * rate,
          bleedRight: s.bleedRight * rate,
          spineThicknessWidth: s.spineThicknessWidth * rate,
          wrapSize: s.wrapSize * rate
        });

        // 检查spread下面的elements, 是否提供encImgId.
        const elements = [];
        if (s.elements && s.elements.length) {
          s.elements.forEach((ele) => {
            if (ele.type === elementTypes.photo) {
              const img = imageArray.find((v) => {
                return v.id == ele.imageid;
              });

              elements.push(merge({}, ele, {
                encImgId: ele.img ? img.encImgId : ''
              }));

            } else {
              elements.push(ele);
            }
          });
        }

        spreadsOptions.push({
          rate,
          pageSize,
          workspaceWidth,
          spreadOptions: opt,
          elementsOptions: elements,
          textsOptions: texts,
          originalOptions: s,
          left,
          containerSizeBaseOnScreen
        });
      }
    });

    return spreadsOptions;
  }

  /**
   * 获取可用的workspace宽和高.
   * @param wsPrecent
   */
  getWorkspaceAvailableSize(pageSize, spreadWidth, spreadHeight, wsPrecent) {
    //const pageSize = getSize();
    const maxWidth = (pageSize.width - sideBarWidth) * wsPrecent;
    const maxHeight = (pageSize.height - topHeight - bottomHeight);

    // 根据workspace的高度, 计算workspace的宽.
    let width = (maxHeight * spreadWidth) / spreadHeight;
    let height = (maxWidth * spreadHeight) / spreadWidth;

    // 如果根据最大高度计算出来的宽大于最大宽, 那就使用最大宽.
    if (width > maxWidth) {
      width = maxWidth;
    } else {
      height = maxHeight;
    }

    return {
      workspaceWidth: width,
      workspaceHeight: height
    }
  }

  getCurrentSpreadIndex() {
    // 查找当前显示的是那一个spread
    const index = this.state.spreadOptions.findIndex((v) => {
      return v.spreadOptions.id === this.state.currentSpread.spreadOptions.id;
    });

    return index;
  }

  /**
   * onresize的处理函数, 更改state.
   */
  addResizeEvent() {
    let timer = null;

    window.onresize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const { boundWorkspaceActions } = this.props;
        const state = this.initWorkspace();

        // resize后, 继续显示当前的spread, 而不是调到默认的spread中.
        const index = this.getCurrentSpreadIndex();
        const spreadOptions = state.spreadOptions;
        if (spreadOptions && spreadOptions.length && index !== -1) {
          boundWorkspaceActions.changeSpread(spreadOptions[index]);
        }
      }, 500);
    };
  }

  /**
   * 点击查看封面页时.
   */
  onOutside() {
    const { boundWorkspaceActions } = this.props;

    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length && !Object.is(index, 0)) {
      boundWorkspaceActions.changeSpread(spreadOptions[0]);
    }
  }

  /**
   * 点击查看里面页时.
   */
  onInside() {
    const { boundWorkspaceActions } = this.props;

    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length > 1 && !Object.is(index, 1)) {
      boundWorkspaceActions.changeSpread(spreadOptions[1]);
    }
  }

  /**
   * 显示或隐藏操作面板
   */
  toggleOperationPanel(ev) {
    const { operationPanel, boundWorkspaceActions } = this.props;

    const event = ev || window.event;
    event.stopPropagation();

    // 隐藏或显示操作面板
    const offset = {
      top: event.clientY,
      left: event.clientX
    };

    boundWorkspaceActions.toggleOperationPanel(!operationPanel.status, offset);
  }

  /**
   * 裁剪图片的处理函数
   * @param ev
   */
  onCropImage(ev) {
    const {
      boundSystemActions,
      baseUrls,
      imageArray,
      boundProjectActions,
      boundWorkspaceActions,
      boundTrackerActions
    } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { currentSpread } = this.state;

    const elements = currentSpread.spreadOptions.elements;

    const activePhotoElementIndex = elements.findIndex(element=>{
      return element.type === elementTypes.photo;
    });

    // activePhotoElementIndex
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // console.log('activePhotoElement', activePhotoElement);

    // 如果活动状态的photoelement不为空.
    if (activePhotoElement) {
      const corpApiTemplate = template(IMAGES_CROPPER)(baseUrls) + IMAGES_CROPPER_PARAMS;
      const { width, height, cropLUX = 0, cropLUY = 0, cropRLX = 1, cropRLY = 1, imgRot = 0, imageid = 0, encImgId = '' } = activePhotoElement;
      let eId = encImgId;
      const img = imageArray.find((v) => {
        return v.id == imageid;
      });

      if (!eId) {
        eId = img ? img.encImgId : '';
      }

      boundTrackerActions.addTracker(ClickCropImage);
      boundSystemActions.showImageEditModal({
        imageEditApiTemplate: corpApiTemplate,
        imageName: img.name,
        encImgId: eId,
        imageId: eId ? 0 : imageid,
        rotation: imgRot,
        imageWidth: img.width,
        imageHeight: img.height,
        elementWidth: width,
        elementHeight: height,
        crop: {
          cropLUX,
          cropLUY,
          cropRLX,
          cropRLY
        },
        securityString,
        onDoneClick: (encImgId, crop, rotate) => {
          const spreadId = currentSpread.spreadOptions.id;
          const elementId = activePhotoElement.id;
          boundProjectActions.updateElement(spreadId, elementId, merge({}, crop, { imgRot: rotate }));
        }
      });
    }
  }

  /**
   * 旋转图片的处理函数
   * @param ev
   */
  onRotateImage(ev) {
    const { boundWorkspaceActions, imageArray, boundTrackerActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { currentSpread } = this.state;
    const elements = currentSpread.spreadOptions.elements;
    const activePhotoElementIndex = elements.findIndex(element=>{
      return element.type === elementTypes.photo;
    });
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);
    const { width, height } = activePhotoElement;
    const newDegree = getRotatedAngle(activePhotoElement.imgRot, 90);

    const img = imageArray.find((v) => {
      return v.id == activePhotoElement.imageid;
    });

    // 如果图片的旋转角度的绝对值是90度, 那么裁剪时就对element的宽高互换.
    const imageWidth = Math.abs(newDegree) === 90 ? img.height : img.width;
    const imageHeight = Math.abs(newDegree) === 90 ? img.width : img.height;
    const newImageCorpParams = getDefaultCropLRXY(imageWidth, imageHeight, width, height);

    const newAttributes = merge({}, newImageCorpParams, { imgRot: newDegree });
    this.updateElement(newAttributes);

    // 更新currentspread in store.
    set(currentSpread, `elementsOptions[${activePhotoElementIndex}]`, merge({}, activePhotoElement, newAttributes));
    boundWorkspaceActions.changeSpread(currentSpread);
    boundTrackerActions.addTracker(ClickRotateImage);
  }

  /**
   * 删除图片的处理函数
   * @param ev
   */
  onRemoveImage(ev) {
    const { boundProjectActions, boundWorkspaceActions, boundTrackerActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { currentSpread } = this.state;
    const elements = currentSpread.spreadOptions.elements;
    const activePhotoElementIndex = elements.findIndex(element=>{
      return element.type === elementTypes.photo;
    });
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;
    const elementId = activePhotoElement.id;

    boundProjectActions.deleteElement(spreadId, elementId);
    boundTrackerActions.addTracker(ClickRemoveImage);
  }

  /**
   * 图片拖拽到工作区并释放鼠标时触发的处理函数.
   */
  onSpreadDroped(event) {
    event.stopPropagation();
    event.preventDefault();

    const { boundProjectActions, boundWorkspaceActions } = this.props;

    let data;
    if (event.dataTransfer) {
      data = JSON.parse(event.dataTransfer.getData('text'));
    } else {
    //  ie11 dataTransfer不支持，使用节点传值
      data = JSON.parse(document.querySelector("body").getAttribute("data-drag"));
      document.querySelector("body").removeAttribute("data-drag");
    }

    const { boundSystemActions, boundUploadedImagesActions } = this.props;

    if (data) {
      // 显示loading icon
      boundSystemActions.showLoading(true);
      const { width, height, w, h } = this.state.currentSpread.spreadOptions;
      // element的原始宽高.
      const originalW = w;
      const originalH = h;

      let newData = convertObjIn(data);

      let imageOptions = new Element(merge({},
        newData,
        getDefaultCropLRXY(newData.width, newData.height, width, height),
        {
          width: originalW,
          height: originalH
        }));

      const elementsOptions = this.state.currentSpread.elementsOptions;
      if (elementsOptions && elementsOptions.length) {
        imageOptions = merge({}, elementsOptions[0], imageOptions);
      }

      const { imageBaseUrl, activePhotoElementIndex } = this.state;
      const imageUrl = combineImgCopperUrl(imageBaseUrl + IMAGES_CROPPER_PARAMS,
        imageOptions,
        // 为了获取更清晰的图片, 我们获取容器2倍大的图片.
        width / (imageOptions.cropRLX - imageOptions.cropLUX),
        height / (imageOptions.cropRLY - imageOptions.cropLUY));

      // 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
      this.createOrUpdateElement(imageOptions);

      // 预加载图片.
      loadImg(imageUrl).then((img) => {
        // 隐藏loading icon
        boundSystemActions.hideLoading();
        //
        // const currentSpread = merge({}, this.state.currentSpread, set(this.state.currentSpread, `elementsOptions[${activePhotoElementIndex}]`, imageOptions));
        // boundWorkspaceActions.changeSpread(currentSpread);
      }, () => {
        // 隐藏loading icon
        boundSystemActions.hideLoading();
      });
    }

    event.dataTransfer.clearData();
  }

  /**
   * 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
   */
  createOrUpdateElement(newAttribute, type = elementTypes.photo) {
    const { boundProjectActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;

    // 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
    const elements = currentSpread.spreadOptions.elements;
    if (newAttribute) {

      const hasPhotoElement = elements.some(element=> {
        return element.type === elementTypes.photo;
      });
      if (hasPhotoElement) {
        const activeElement = elements.filter(element=> {
          return element.type === elementTypes.photo;
        });
        //  同一图片不替换
        if (activeElement[0].encImgId === newAttribute.encImgId) {
          return;
        }
        const elementId = activeElement[0].id;
        boundProjectActions.deleteElement(spreadId, elementId);
      }
      boundProjectActions.createElement(spreadId, merge({}, newAttribute, { type }));
    }
  }

  /**
   * 在store上创建一个新的element
   */
  updateElement(newAttribute) {
    const { boundProjectActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { currentSpread } = this.state;
    const elements = currentSpread.spreadOptions.elements;
    const activePhotoElementIndex = elements.findIndex(element=>{
      return element.type === elementTypes.photo;
    });
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;
    const elementId = activePhotoElement.id;

    if (newAttribute) {
      boundProjectActions.updateElement(spreadId, elementId, newAttribute);
    }
  }

  getSpreadHtml() {
    let html = '';
    const currentSpread = this.state.currentSpread;
    const {
      baseUrls,
      imageArray,
      boundProjectActions,
      boundUploadedImagesActions,
      boundWorkspaceActions,
      boundTrackerActions,
      toggleModal,
      editText,
      getImageDetail,
      ratio
    } = this.props;
    const { imageBaseUrl, texts, activePhotoElementIndex } = this.state;
    if (currentSpread && currentSpread.spreadOptions) {
      html = (<Spread spreadId={currentSpread.spreadOptions.id}
                      spreadOptions={currentSpread.spreadOptions}
                      elementsOptions={currentSpread.elementsOptions}
                      boundProjectActions={boundProjectActions}
                      imageBaseUrl={imageBaseUrl}
                      toggleOperationPanel={this.toggleOperationPanel.bind(this)}
                      isPreview={false}
                      activePhotoElementIndex={activePhotoElementIndex}
                      baseUrls={baseUrls}
                      boundUploadedImagesActions={boundUploadedImagesActions}
                      boundWorkspaceActions={boundWorkspaceActions}
                      boundTrackerActions={boundTrackerActions}
                      toggleModal={toggleModal}
                      imageArray={imageArray}
                      getImageDetail={getImageDetail}
                      editText={editText}
                      ratio={ratio}
      />);
    }

    return html;
  }

  getMainRenderHtml() {
    let html = '';
    const currentSpread = this.state.currentSpread;
    const {
      baseUrls,
      imageArray,
      boundProjectActions,
      boundUploadedImagesActions,
      boundWorkspaceActions,
      boundTrackerActions,
      toggleModal,
      editText,
      getImageDetail,
      ratio
    } = this.props;
    const { imageBaseUrl, texts, activePhotoElementIndex } = this.state;
    if (currentSpread && currentSpread.spreadOptions) {
      html = (<MainRenderContainer
        spreadId={currentSpread.spreadOptions.id}
        spreadOptions={currentSpread.spreadOptions}
        elementsOptions={currentSpread.elementsOptions}
        boundProjectActions={boundProjectActions}
        imageBaseUrl={imageBaseUrl}
        toggleOperationPanel={this.toggleOperationPanel.bind(this)}
        isPreview={false}
        activePhotoElementIndex={activePhotoElementIndex}
        baseUrls={baseUrls}
        boundUploadedImagesActions={boundUploadedImagesActions}
        boundWorkspaceActions={boundWorkspaceActions}
        boundTrackerActions={boundTrackerActions}
        toggleModal={toggleModal}
        imageArray={imageArray}
        getImageDetail={getImageDetail}
        editText={editText}
        ratio={ratio}
        spreadHtml={this.getSpreadHtml()}
      />);
    }

    return html;
  }

  /**
   * 当panel type是 image wrapped时, 才需要显示切换按钮.
   */
  getBottomBtnHtml() {
    let html = '';
    const { setting } = this.props;
    if (setting && setting.type === panelTypes.imageWrapped) {
      html = (<OutInSide onLeftClicked={this.onOutside.bind(this)}
                         onRightClicked={this.onInside.bind(this)}
      />);
    }

    return html;
  }

  render() {
    // console.log('workspace state', this.state);
    // t方法是用于本地化, 通过传入的key, 来获取对应的value.
    const { children, t, loadingData, addText, operationPanel } = this.props;

    const workSpaceStyle = {
      width: `${this.state.currentSpread.workspaceWidth}px`,
      left: `${this.state.currentSpread.left}px`,
      position: 'absolute',
      display: this.state.currentSpread && this.state.currentSpread.left ? 'block' : 'none'
    };

    return (
      <section className="work-space" ref="workSpace" style={workSpaceStyle}>
        {children}
        <div className="btn-list">
          {/* add text 按钮 */}
          <XAddText text={t('ADD_TEXT')} onClicked={addText}/>
        </div>

        <div className="image-editor">
          {this.getMainRenderHtml()}
          { /*
            <XDrop onDroped={ this.onSpreadDroped.bind(this) }>
              {this.getSpreadHtml()}
            </XDrop>
          */ }
        </div>

        {/* 查看封面和里面的按钮 */}
        <div className="btn-list m-b-66">
          {this.getBottomBtnHtml()}
        </div>

        {/* 操作面板 */}
        <OperationPanel shown={operationPanel.status}
                        offset={operationPanel.offset}
                        onCropImage={this.onCropImage.bind(this)}
                        onRotateImage={this.onRotateImage.bind(this)}
                        onRemoveImage={this.onRemoveImage.bind(this)}
        />

        <Loading
          isShow={loadingData.isShow}
          isModalShow={loadingData.isModalShow}
        />
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
