import React, { Component, PropTypes } from 'react';
import { merge, template, isEqual, set } from  'lodash';


// 导入用于本地化的组件
import { translate } from 'react-translate';
import { elementTypes, spreadTypes } from '../../contants/strings';

import {
  getBorderLinesXY,
  getWrapLinesXY,
  getSpineThicknessLinesXY,
  getPreviewSpineThicknessLinesXY
} from '../../../common/utils/line';
import { makeId } from '../../../common/utils/math';
import { getScale } from '../../utils/scale';
import { combineImgCopperUrl, loadImg } from '../../../common/utils/image';
import classNames from 'classnames';
import { IMAGES_CROPPER_PARAMS, TEXT_SRC } from '../../contants/apiUrl';
import { getWrapBoxes } from '../../../common/utils/draw';
import XElements from '../../../common/ZNOComponents/XElements';
import XBGElement from '../../../common/ZNOComponents/XBGElement';
import XPhotoElement from '../../../common/ZNOComponents/XPhotoElement';
import XTextElement from '../../../common/ZNOComponents/XTextElement';
import XLines from '../../../common/ZNOComponents/XLines';
import XFileUpload from '../../../common/ZNOComponents/XFileUpload';
import XWarnTip from '../../../common/ZNOComponents/XWarnTip';
import Boxes from '../Boxes';
import { ClickCloudUploadImage } from '../../contants/trackerConfig';

import './index.scss';

class Spread extends Component {
  constructor(props) {
    super(props);

    const state = this.initSpread(this.props);
    this.state = merge({}, state, {
      autoOpen: false,
      resizeLimit: 50
    });
  }

  componentWillReceiveProps(nextProps) {
    const { elementsOptions } = nextProps;
    if (!this.state.liveUpdateCropImageUrl && elementsOptions.url) {
      this.setState({
        liveUpdateCropImageUrl: elementsOptions.url
      });
    }

    if (!isEqual(this.props.spreadOptions, nextProps.spreadOptions)
      || !isEqual(this.props.elementsOptions, nextProps.elementsOptions)
      || !isEqual(this.props.imageArray, nextProps.imageArray)) {
      this.setState(this.initSpread(nextProps));
    }
  }

  initSpread(props) {
    const { spreadOptions, elementsOptions, isPreview, imageBaseUrl, baseUrls, imageArray, ratio } = props;

    const getEncImgId = (imageid) => {
      let img = {};
      if (imageArray) {
        img = imageArray.find((v) => {
          return v.id == imageid;
        });
      }

      return img ? img.encImgId : '';
    };
    const getImageUrl = (m) => {
      // 根据spread的宽和高, 计算element的宽和高.
      const eWidth = width / (m.cropRLX - m.cropLUX);
      const eHeight = height / (m.cropRLY - m.cropLUY);
      const encImgId = getEncImgId(m.imageid);

      return imageBaseUrl && encImgId ? combineImgCopperUrl(imageBaseUrl + IMAGES_CROPPER_PARAMS,
        merge({}, m, { encImgId }),
        eWidth,
        eHeight) : ''
    };
    const _this = this;

    // 获取spread的宽和高.
    const { width, height } = spreadOptions;

    // photo元素的options设置
    const photoElements = [];
    const textElements = [];

    elementsOptions.forEach((m) => {
      if (m.type === elementTypes.photo) {
        photoElements.push(merge({}, m, {
          lineWidth,
          imageUrl: getImageUrl(m)
        }, {
          wrapSize: spreadOptions.wrapSize + spreadOptions.bleedTop,
          bleedTop: 0,
          bleedBottom: 0,
          bleedLeft: 0,
          bleedRight: 0,
          scale: _this.getCurrentScale(m)
        }));
      } else if (m.type === elementTypes.text) {
        if (baseUrls) {
          const textUrl = template(TEXT_SRC)({
            baseUrl: baseUrls.baseUrl,
            text: m.text,
            fontSize: m.fontSize * spreadOptions.h * ratio,
            fontColor: m.color,
            fontFamily: m.fontFamily,
            textAlign: m.textAlign
          });
          textElements.push(merge({}, m, {
            textUrl: textUrl,
            fontSize: m.fontSize * spreadOptions.h,
            text: decodeURIComponent(m.text),
            width: m.width * ratio,
            height: m.height * ratio
          }));
        }
      }
    });

    // 获取各种线的坐标.
    const lineWidth = 1;
    const borderLines = getBorderLinesXY(width, height, lineWidth, '#bcbcbc', true, 10);

    // 包括包边和出血区域在当前的case中, 因为没有设计出血线.
    const wrapLines = getWrapLinesXY(width, height, spreadOptions.wrapSize + spreadOptions.bleedTop, lineWidth, '#95989a');
    const spineThicknessLines = getSpineThicknessLinesXY(width, height, spreadOptions.spineThicknessWidth, lineWidth, '#bcbcbc', true, 12);
    const previewSpineThicknessLines = getPreviewSpineThicknessLinesXY(spreadOptions.wrapSize + spreadOptions.bleedTop, width, height, spreadOptions.spineThicknessWidth, lineWidth, '#bcbcbc', false);


    // 包边区域元素的options设置
    const boxesOptions = merge({}, spreadOptions, {
      wrapSize: spreadOptions.wrapSize + spreadOptions.bleedTop,
      bleedTop: 0,
      bleedBottom: 0,
      bleedLeft: 0,
      bleedRight: 0
    });

    // 获取上下左右四个包边区域的坐标和宽高信息
    let boxColor = '';
    if (isPreview) {
      boxColor = 'rgba(255, 255, 255, 1)';
    } else {
      boxColor = 'rgba(255,255,255,0.3)';
    }
    const boxSize = {
      width,
      height,
      color: boxColor,
      bleedTop: boxesOptions.bleedTop,
      bleedBottom: boxesOptions.bleedBottom,
      bleedLeft: boxesOptions.bleedLeft,
      bleedRight: boxesOptions.bleedRight,
      wrapSize: isPreview ? boxesOptions.wrapSize + 2 : boxesOptions.wrapSize,
      lineWidth,
      marginTop: isPreview ? -2 : 0,
      marginLeft: isPreview ? -2 : 0,
    };

    // 各种线的信息
    let lines = (spreadOptions.type === spreadTypes.coverPage) ? previewSpineThicknessLines : [];
    if (!isPreview) {
      lines = spreadOptions.type === spreadTypes.coverPage ?
        [...borderLines, ...wrapLines, ...spineThicknessLines]
        : [...borderLines, ...wrapLines];
    }

    const state = {
      lineWidth,
      borderLines,
      wrapLines,
      spineThicknessLines,
      photoElements,
      textElements,
      boxesOptions,
      boxSize,
      lines,
      previewSpineThicknessLines,
      liveUpdateCropImageUrl: elementsOptions.url,
      allowDraw: false
    };
    return state;
  }

  /**
   * phpotoElement render
   */
  getPhotoElementHtml() {
    const { spreadId, spreadOptions, ratio, toggleOperationPanel, getImageDetail, t } = this.props;
    const { width, height } = spreadOptions;
    const { resizeLimit } = this.state;

    const elements = this.state.photoElements.map((p, i) => {
      const warnTipProps = {
        isShown: p.scale > resizeLimit,
        title: t('BEYOND_SIZE_TIP', { n: p.scale, m: resizeLimit })
      };
      return (
        <XPhotoElement key={i} canvasId={makeId(spreadId)}
                       containerWidth={width}
                       containerHeight={height}
                       ratio={ratio}
                       getImageDetail={getImageDetail}
                       onClicked={toggleOperationPanel}
                       options={p}>
          <XWarnTip {...warnTipProps} />
        </XPhotoElement>
      );
    });

    return elements;
  }

  /**
   * textElement render
   */
  getTextElementHtml() {
    const { spreadId, spreadOptions, ratio } = this.props;
    const { width, height } = spreadOptions;

    const elements = this.state.textElements.map((p, i) => {
      return (
        <XTextElement canvasId={makeId(spreadId)}
                      containerWidth={width}
                      containerHeight={height}
                      options={p}
                      disableCustomEvents={this.props.isPreview}
                      handleMouseMove={this.handleTextMove.bind(this)}
                      handleMouseDown={this.handleOnText.bind(this)}
                      handleDblClick={this.handleTextDblClick.bind(this)}
                      handleMouseUp={this.handleMouseUp.bind(this)}
                      ratio={ratio}
                      key={i}>
        </XTextElement>
      );
    });

    return elements;
  }


  handleOnText(event) {

  }

  /**
   * 处理textElement移动，主要做便捷检测
   */
  handleTextMove(opt) {
    const { spreadOptions } = this.props;
    const { width, height } = spreadOptions;
    //边界检测
    if (opt.x <= -opt.width / 2) {
      opt.x = -opt.width / 2;
    } else if (opt.x >= width - opt.width / 2) {
      opt.x = width - opt.width / 2;
    }
    if (opt.y <= -opt.height / 2) {
      opt.y = -opt.height / 2;
    } else if (opt.y >= height - opt.height / 2) {
      opt.y = height - opt.height / 2;
    }
    return opt;
  }

  /**
   * 当textElement移动鼠标弹起时更新真实数据
   */
  handleMouseUp(id, mx, my) {
    const { spreadOptions, ratio } = this.props;
    const { width, height } = spreadOptions;
    const { boundProjectActions, spreadId } = this.props;
    const px = mx / width;
    const py = my / height;
    const x = mx / ratio;
    const y = my / ratio;
    boundProjectActions.updateElement(
      spreadId,
      id,
      {
        x,
        y,
        px,
        py
      }
    );
  }

  /**
   *  textElement双击弹出编辑框
   */
  handleTextDblClick(options) {
    const { editText } = this.props;
    editText(options);
  }

  /**
   * bgElement 点击
   */
  handleBgClick(event) {
    // 标记, 图片上传完成后, 自动添加到canvas中.
    const { boundWorkspaceActions, spreadId, spreadOptions, boundTrackerActions } = this.props;
    boundWorkspaceActions.autoAddPhotoToCanvas(true, spreadId, spreadOptions.w, spreadOptions.h);
    boundTrackerActions.addTracker(ClickCloudUploadImage);
    this.setState({
      autoOpen: true
    });
  }

  /**
   * 重置点击背景打开照片选择器状态
   */
  resetOpenState() {
    this.setState({
      autoOpen: false
    });
  }

  // 计算缩放比例
  getCurrentScale(options) {
    const { getImageDetail } = this.props;
    let scale;
    if (getImageDetail) {
      const { imgRot, width, height, cropLUX, cropLUY, cropRLX, cropRLY, imageid } = options;
      const imageDetail = getImageDetail(imageid);
      if (imageDetail) {
        scale = getScale({
          imgRot,
          imageDetail,
          width,
          height,
          cropRLX,
          cropLUX,
          cropRLY,
          cropLUY
        });
      } else {
        scale = 0;
      }
    } else {
      scale = 0;
    }
    return scale;
  }

  render() {
    const { className, spreadId, spreadOptions, t, boundUploadedImagesActions, toggleModal, isPreview } = this.props;
    const { width, height, bgColor } = spreadOptions;

    const customClass = classNames('spread', className);

    // spread的样式: 在preview模式下spread的高度一定要比canvase高1px，不然会造成canvas的1px溢出
    const styles = {
      width: `${width}px`,
      height: `${!isPreview ? height : height + 1}px`
    };

    return (
      <div className={customClass} style={styles}>
        <XFileUpload className="hidden"
                     isAutoOpen={this.state.autoOpen}
                     boundUploadedImagesActions={boundUploadedImagesActions}
                     toggleModal={toggleModal}
                     resetOpenState={this.resetOpenState.bind(this)}>
        </XFileUpload>
        <XElements>
          {/* 背景元素, 设置画布背景 */}
          <XBGElement canvasId={makeId(spreadId)}
                      bgColor={bgColor}
                      width={width}
                      height={height}
                      isHide={!!this.state.photoElements && !!this.state.photoElements.length}
                      isHideUploadIcon={isPreview}
                      textInCenter={t('CLICK_TO_ADD_PHOTO') || ''}
                      handleClick={this.handleBgClick.bind(this)}
          />

          {/* 图片元素, 用于渲染图片 */}
          { this.getPhotoElementHtml() }

          {/* 文本元素, 用于渲染文本 */}
          { this.getTextElementHtml() }

        </XElements>

        {/* 四个包边区域 */}
        <Boxes width={isPreview ? width + 4 : width}
               height={isPreview ? height + 4 : height}
               boxSize={this.state.boxSize}
        />


        {/* 线条元素, 用于绘制各种线条 */}
        <XLines canvasId={makeId(spreadId)}
                width={width}
                height={height}
                lines={this.state.lines}
        />

      </div>
    );
  }
}

Spread.propTypes = {
  spreadId: PropTypes.string.isRequired,

  // spread的参数设置
  spreadOptions: PropTypes.shape({
    bgColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,
    spineThicknessWidth: PropTypes.number,
    wrapSize: PropTypes.number,
  }).isRequired,

  // 在spread上绘制图片的参数设置.
  elementsOptions: PropTypes.arrayOf(PropTypes.shape({
    // 图片的原始大小
    width: PropTypes.number,
    height: PropTypes.number,

    // 容器的大小
    targetWidth: PropTypes.number,
    targetHeight: PropTypes.number,

    // 图片的id
    encImgId: PropTypes.string,
    imageId: PropTypes.string
  })),

  imageBaseUrl: PropTypes.string,
  onClicked: PropTypes.func,
  className: PropTypes.string,
  isPreview: PropTypes.bool
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('Spread')(Spread);
