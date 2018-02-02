import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { translate } from 'react-translate';
import { merge, isEqual, get } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';

import {
  elementTypes,
  userMistakeLimit,
  pageTypes,
  logoInfo
} from '../../contants/strings';
import { getCropOptions } from '../../utils/crop';

// 导入组件
import BackgroundElement from '../BackgroundElement';
import ProductLogo from '../ProductLogo';
import PhotoElement from '../PhotoElement';
import TextElement from '../TextElement';
import SpineTextElement from '../SpineTextElement';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import Handler from '../Handler';
import DisableHandler from '../DisableHandler';
import Tooltip from '../Tooltip';

import ElementControls from '../ElementControls';
// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as selectElementHandler from './handler/selectElement';

import * as actionbarEvents from './handler/actionbarEvents';

import { getSelectedElementPosition } from './handler/guideLines';

import './index.scss';

function getOffset(el) {
  if (!el) return null;
  return el.getBoundingClientRect();
}

class BookPage extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    // element的相关方法.
    this.computedElementOptions = (props, element, ratio) => {
      return elementHandler.computedElementOptions(this, props, element, ratio);
    };

    // bookPage基本的处理函数
    this.isPhotoElement = element => pageHandler.isPhotoElement(element);
    this.switchPage = e => pageHandler.switchPage(this, e);

    this.onPageDroped = event => pageHandler.onPageDroped(this, event);
    this.onPageDragOver = event => pageHandler.onPageDragOver(this, event);
    this.onPageDragLeave = event => pageHandler.onPageDragLeave(this, event);
    this.onPageDragEnter = event => pageHandler.onPageDragEnter(this, event);
    this.onPageDragEnd = event => pageHandler.onPageDragEnd(this, event);

    this.onMouseDown = (data, e) => {
      const { isRatioChanged } = this.state;
      if (isRatioChanged) {
        this.updateOffset();
        this.setState({
          isRatioChanged: false
        });
      }
    };

    this.onMouseUp = (data, e) => {
      return selectElementHandler.unSelectElements(this);
    };

    this.onBlur = (e) => {
      return selectElementHandler.unSelectElements(this);
    };

    window.addEventListener('mouseup', this.onMouseUp);

    // 右键菜单的点击事件
    this.actionbarActions = {
      onEditImage: (element) => {
        return actionbarEvents.onEditImage(this, element);
      },
      onRotateImage: (element) => {
        return actionbarEvents.onRotateImage(this, element);
      },
      onFlipImage: (element) => {
        return actionbarEvents.onFlipImage(this, element);
      },
      onExpandToFullSheet: (element) => {
        return actionbarEvents.onExpandToFullSheet(this, element);
      },
      onExpandToLeftPage: (element) => {
        return actionbarEvents.onExpandToLeftPage(this, element);
      },
      onExpandToRightPage: (element) => {
        return actionbarEvents.onExpandToRightPage(this, element);
      },
      onFilter: (element) => {
        return actionbarEvents.onFilter(this, element);
      },
      onRemoveImage: (element) => {
        return actionbarEvents.onRemoveImage(this, element);
      },
      onUploadImage: (element) => {
        // return actionbarEvents.onUploadImage(this, element);
      },
      onBringToFront: (element) => {
        return actionbarEvents.onBringToFront(this, element);
      },
      onSendToback: (element) => {
        return actionbarEvents.onSendToback(this, element);
      },
      onBringForward: (element) => {
        return actionbarEvents.onBringForward(this, element);
      },
      onSendBackward: (element) => {
        return actionbarEvents.onSendBackward(this, element);
      },
      onEditText: (element, editType) => {
        return actionbarEvents.onEditText(this, element, editType);
      },
      onAlignLeft: (selectedElementArray) => {
        return actionbarEvents.onAlignLeft(this, selectedElementArray);
      },
      onAlignCenter: (selectedElementArray) => {
        return actionbarEvents.onAlignCenter(this, selectedElementArray);
      },
      onAlignRight: (selectedElementArray) => {
        return actionbarEvents.onAlignRight(this, selectedElementArray);
      },
      onAlignTop: (selectedElementArray) => {
        return actionbarEvents.onAlignTop(this, selectedElementArray);
      },
      onAlignMiddle: (selectedElementArray) => {
        return actionbarEvents.onAlignMiddle(this, selectedElementArray);
      },
      onAlignBottom: (selectedElementArray) => {
        return actionbarEvents.onAlignBottom(this, selectedElementArray);
      },
      onSpaceHorizontal: (selectedElementArray) => {
        return actionbarEvents.onSpaceHorizontal(this, selectedElementArray);
      },
      onSpaceVertical: (selectedElementArray) => {
        return actionbarEvents.onSpaceVertical(this, selectedElementArray);
      },
      onClearAll: (selectedElementArray) => {
        return actionbarEvents.onClearAll(this, selectedElementArray);
      }
    };

    this.toggleModal = (type, status) => {
      const { actions } = this.props;
      const { boundUploadImagesActions } = actions;
      boundUploadImagesActions.toggleUpload(status);
    };

    // 获取待渲染的html
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.getRenderHandlerHtml = this.getRenderHandlerHtml.bind(this);

    const { actions } = this.props;

    const self = this;
    const basicActions = merge({}, actions, {
      handleMouseUp: (data, e) => {
        selectElementHandler.onMouseUp(this, data, e);
        self.setState({
          tooltip: {
            isShown: false
          }
        });
      },
      handleMouseEnter: (data, e) => {
        const { element } = data;

        if (
          element.get('type') === elementTypes.text ||
          element.get('type') === elementTypes.paintedText
        ) {
          const elementDegree = element.get('rot');
          const { containerOffset } = self.state;
          const computed = element.get('computed');

          let tooltipTop = 0;

          // 性能优化，只有当元素的角度不为0度角时，才去访问dom的接口
          if (elementDegree % 360 === 0) {
            tooltipTop =
              computed.get('top') +
              computed.get('height') +
              containerOffset.top +
              15;
          } else {
            const elementNode = ReactDOM.findDOMNode(
              self.refs[`element-${element.get('id')}`]
            );
            const rect = elementNode.getBoundingClientRect();

            tooltipTop = rect.top + rect.height + 15;
          }

          const halfWidth = computed.get('width') / 2;
          self.setState({
            tooltip: {
              isShown: true,
              style: {
                left: computed.get('left') + containerOffset.left + halfWidth,
                top: tooltipTop,
                height: 14,
                transform: 'translate(-50%, 0)'
              },
              content: t('CLICK_TO_EDIT_TEXT')
            }
          });
        }
      },
      handleMouseOut: (data, e) => {
        self.setState({
          tooltip: {
            isShown: false
          }
        });
      }
    });
    this.state = {
      elementArray: Immutable.List(),
      photoActions: merge({}, basicActions, {
        applyTemplate: this.applyTemplate
      }),
      textActions: basicActions,
      decorationActions: basicActions,
      isRatioChanged: false,
      tooltip: {
        isShown: false,
        style: null,
        content: ''
      },
      isHover: false
    };

    this.onElementArrayChange = this.onElementArrayChange.bind(this);
    this.submitElementArray = this.submitElementArray.bind(this);
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentDidMount() {
    this.updateOffset();
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  updateOffset() {
    const { page, ratio, paginationSpread, size } = this.props.data;
    this.setState({
      containerOffset: getOffset(this.bookPage)
    });
  }

  renderElement(element, index) {
    const { actions, data } = this.props;
    const { containerOffset } = this.state;
    const {
      // 渲染时忽略空的图片框.
      ignoreEmpty = false,

      isPreview,
      summary,
      page,
      ratio,
      paginationSpread,
      settings,
      parameters,
      size,
      pagination
    } = data;
    const isCover = summary.get('isCover');

    const elementRefId = `element-${element.get('id')}`;

    switch (element.get('type')) {
      case elementTypes.photo: {
        const { photoActions, elementArray } = this.state;

        const photoData = {
          summary,
          element,
          ratio,
          page,
          paginationSpread,
          isPreview,
          pagination,
          parameters,
          elementArray,
          isCover,
          containerOffset,
          size
        };

        return (
          <PhotoElement
            ref={elementRefId}
            key={index}
            actions={photoActions}
            data={photoData}
          />
        );
      }
      case elementTypes.text: {
        // 在预览模式下, 要过滤空的文本框.
        if (isPreview && !element.get('text')) {
          return null;
        }

        const { textActions, elementArray } = this.state;
        const textData = {
          summary,
          element,
          ratio,
          page,
          paginationSpread,
          isPreview,
          pagination,
          parameters,
          elementArray,
          isCover,
          containerOffset
        };

        if (page.get('type') === pageTypes.spine) {
          return (
            <SpineTextElement
              ref={elementRefId}
              key={index}
              actions={textActions}
              data={textData}
            />
          );
        }

        return (
          <TextElement
            ref={elementRefId}
            key={index}
            actions={textActions}
            data={textData}
          />
        );
      }
      default:
        return null;
    }
  }

  getRenderHtml() {
    const { elementArray } = this.state;
    const { data, t } = this.props;
    const { summary, page, ratio, isPreview, variables } = data;
    const html = [];
    const pageEnabled = page.get('enabled');
    const isCover = summary.get('isCover');

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;

    // backgroundElement的数据.
    const backgroundActions = {};
    const backgroundElementData = {
      element: Immutable.fromJS({
        computed: {
          width: Math.round(pageWidth),
          height: Math.round(pageHeight),
          left: 0,
          top: 0
        }
      }),
      style: {
        background: pageEnabled ? page.get('bgColor') : isPreview ? '#fff' : ''
      },
      ratio,
      page
    };

    // 给封面的背面添加一个product logo.
    if (isCover) {
      if (
        page.get('type') === pageTypes.full &&
        page.getIn(['backend', 'isPrint'])
      ) {
        const logo = summary.get('logo');
        const coverForegroundColor = variables.get('coverForegroundColor');
        const logoWidth = logoInfo.ratio * page.get('width') * ratio.workspace;

        const productLogoData = {
          style: {
            top: `${logo.get('top') * ratio.workspace}px`,
            left: `${logo.get('left') * ratio.workspace - logoWidth / 2}px`,
            width: `${logoWidth}px`
          },
          logoType: coverForegroundColor === '#fefefe' ? 1 : 2
        };

        html.push(<ProductLogo key="ProductLogo" data={productLogoData} />);
      }
    }

    if (elementArray.size) {
      elementArray.forEach((element, index) => {
        if (
          element.get('type') === elementTypes.cameo &&
          summary.get('cameo') === 'none'
        ) {
          // nothing to do here.
        } else {
          html.push(this.renderElement(element, index));
        }
      });
    } else if (!isPreview) {
      if (pageEnabled) {
        // 如果不是封面, 就给它添加一个默认的提示性的元素.
        const enableBackgroundElementData = merge({}, backgroundElementData, {
          text: t('ENABLED_BACKGROUND_TIP')
        });
        html.push(
          <BackgroundElement
            key="BackgroundElement"
            actions={backgroundActions}
            data={backgroundElementData}
          />
        );
      }
    }

    return html;
  }

  getRenderHandlerHtml() {
    const { data } = this.props;
    const { page, isPreview, summary } = data;
    const isSupportPaintedText = summary.get('isSupportPaintedText');
    const pageEnabled = page.get('enabled');
    let html;

    // handler的action和data.
    const handlerActions = {
      handleDragOver: this.onPageDragOver,
      handleDragLeave: this.onPageDragLeave,
      handleDragEnd: this.onPageDragLeave,
      handleDragEnter: this.onPageDragEnter,
      handleDrop: this.onPageDroped
    };
    const handlerData = {};
    const disableHandlerData = {};

    // 如果为预览模式, 一律添加disablehandler
    if (isPreview) {
      html = <DisableHandler data={disableHandlerData} />;
    } else {
      html = <Handler data={handlerData} actions={handlerActions} />;
    }

    return html;
  }

  onElementArrayChange(selectedElementArray, callback) {
    const { elementArray } = this.state;
    this.setState(
      {
        elementArray: elementArray.map((element) => {
          const elementId = element.get('id');
          const selectedElement = selectedElementArray.find((o) => {
            return o.get('id') === elementId;
          });

          if (selectedElement) {
            return selectedElement;
          }

          return element;
        })
      },
      () => {
        callback && callback();
      }
    );
  }

  submitElementArray(selectedElementArray, doingType) {
    const { data, actions } = this.props;
    const { ratio, page, paginationSpread, elements } = data;
    const { boundProjectActions } = actions;

    const summary = paginationSpread.get('summary');
    const isCover = summary.get('isCover');
    const isHalfCover =
      page.get('type') === pageTypes.back ||
      page.get('type') === pageTypes.front;
    const isSupportPaintedText = summary.get('isSupportPaintedText');

    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;

    const pageBleed = page.get('bleed');
    const bleedLeft = pageBleed.get('left') * ratio.workspace;
    const bleedRight = pageBleed.get('right') * ratio.workspace;
    const bleedTop = pageBleed.get('top') * ratio.workspace;
    const bleedBottom = pageBleed.get('bottom') * ratio.workspace;

    const bottomEdge = pageHeight - bleedBottom;
    let rightEdge = pageWidth - bleedRight;

    const spinePage = paginationSpread.get('pages').find((p) => {
      return p.get('type') === pageTypes.spine;
    });

    let spineLeft = 0;
    let spineRight = 0;
    let spineWidth = 0;

    if (isCover) {
      spineWidth = spinePage.get('width') * ratio.workspace;
      spineLeft = (pageWidth - spineWidth) / 2 + bleedLeft;
      spineRight = (pageWidth + spineWidth) / 2 - bleedLeft;

      if (isHalfCover) {
        spineLeft = pageWidth - spineWidth / 2 + bleedLeft;
        rightEdge = pageWidth;
      }
    }

    const [minPos, middlePos, maxPos] = getSelectedElementPosition(this);

    let updateObjectArray = Immutable.List();
    selectedElementArray.forEach((element) => {
      const computed = element.get('computed');
      const width = computed.get('width') / ratio.workspace;
      const height = computed.get('height') / ratio.workspace;
      const x = computed.get('left') / ratio.workspace;
      const y = computed.get('top') / ratio.workspace;

      // 更新之前的element.
      const oldElement = elements.find(
        ele => ele.get('id') === element.get('id')
      );

      let updateObject = Immutable.Map({
        id: element.get('id')
      });

      switch (doingType) {
        case 'move':
          // 判断是否为用户的无意操作.
          if (
            oldElement &&
            Math.abs(x - oldElement.get('x')) < userMistakeLimit.x &&
            Math.abs(y - oldElement.get('y')) < userMistakeLimit.y
          ) {
            updateObject = null;
          } else {
            updateObject = updateObject.merge({
              x,
              y,
              px: x / page.get('width'),
              py: y / page.get('height')
            });
          }

          break;
        case 'resize': {
          let cropProps = null;
          if (element.get('type') === elementTypes.photo) {
            const theImage = data.images.get(element.get('encImgId'));
            if (theImage) {
              const { cropLUX, cropLUY, cropRLX, cropRLY } = getCropOptions(
                theImage.get('width'),
                theImage.get('height'),
                computed.get('width'),
                computed.get('height'),
                element.get('imgRot')
              );

              cropProps = { cropLUX, cropLUY, cropRLX, cropRLY };
            }
          }

          // 判断是否为用户的无意操作.
          if (
            oldElement &&
            Math.abs(width - oldElement.get('width')) <
              userMistakeLimit.width &&
            Math.abs(height - oldElement.get('height')) <
              userMistakeLimit.height
          ) {
            updateObject = null;
          } else {
            updateObject = updateObject.merge(
              {
                x,
                y,
                width,
                height,
                px: x / page.get('width'),
                py: y / page.get('height'),
                pw: width / page.get('width'),
                ph: height / page.get('height')
              },
              cropProps
            );
          }

          break;
        }
        case 'rotate':
          if (
            (minPos.x >= bleedLeft &&
              maxPos.x <= spineLeft &&
              minPos.y >= bleedTop &&
              maxPos.y <= bottomEdge) ||
            (minPos.x >= spineRight &&
              maxPos.x <= rightEdge &&
              minPos.y >= bleedTop &&
              maxPos.y <= bottomEdge)
          ) {
            if (
              oldElement &&
              Math.abs(element.get('rot') - oldElement.get('rot')) <
                userMistakeLimit.rot
            ) {
              updateObject = null;
            } else {
              updateObject = updateObject.merge({
                rot: Math.round(element.get('rot'))
              });
            }
          } else if (
            isSupportPaintedText &&
            isCover &&
            page.get('type') !== pageTypes.front
          ) {
            updateObject = updateObject.merge({
              lastModified: Date.now()
            });
          } else if (
            oldElement &&
            Math.abs(element.get('rot') - oldElement.get('rot')) <
              userMistakeLimit.rot
          ) {
            updateObject = null;
          } else {
            updateObject = updateObject.merge({
              rot: Math.round(element.get('rot'))
            });
          }

          break;
        case 'editImage':
          updateObject = updateObject.merge({
            encImgId: element.get('encImgId'),
            cropLUX: element.get('cropLUX'),
            cropLUY: element.get('cropLUY'),
            cropRLX: element.get('cropRLX'),
            cropRLY: element.get('cropRLY')
          });
          break;
        default:
      }

      if (updateObject) {
        updateObjectArray = updateObjectArray.push(updateObject);
      }
    });

    if (updateObjectArray.size) {
      boundProjectActions.updateElements(updateObjectArray);
    }
  }

  render() {
    const { data, actions, t } = this.props;
    const { isHover } = this.state;
    const { boundImagesActions } = actions;
    const { page, ratio, summary, size } = data;

    const offset = page.get('offset');
    const pageEnabled = page.get('enabled');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');
    const isActive = page.get('isActive');
    const isSupportHalfImageInCover = summary.get('isSupportHalfImageInCover');
    const isSpinePage = page.get('type') === pageTypes.spine;

    const bookPageClassName = classNames('book-page', {
      enabled: pageEnabled,
      disabled: !pageEnabled,

      cover: isCover,
      inner: !isCover,

      pressbook: isPressBook
    });

    // 对水晶封面的front page做特殊处理.
    // 该封面的front页, 左边有一小段皮.
    const left = offset.get('left');

    const bookPageStyle = {
      position: 'absolute',
      top: `${offset.get('top') * ratio.workspace}px`,
      left: `${left * ratio.workspace}px`,
      width: `${Math.round(page.get('width') * ratio.workspace)}px`,
      height: `${Math.round(page.get('height') * ratio.workspace)}px`,
      // background: isSpinePage ? 'transparent' : page.get('bgColor'),
      userSelect: 'none'
    };

    const pageBackgroundStyle = {
      position: 'absolute',
      top: `${offset.get('top') * ratio.workspace + 2}px`,
      left: `${left * ratio.workspace + 2}px`,
      width: `${Math.round(page.get('width') * ratio.workspace - 4)}px`,
      height: `${Math.round(page.get('height') * ratio.workspace - 4)}px`,
      background: isSpinePage ? 'transparent' : page.get('bgColor'),
      userSelect: 'none'
    };

    const pageBleed = page.get('bleed');
    let sheetSizeWithoutBleed = size.renderInnerSheetSizeWithoutBleed;
    if (isCover) {
      sheetSizeWithoutBleed = size.renderCoverSheetSizeWithoutBleed;
    }

    const hoverBoxStyle = {
      position: 'absolute',
      top: `${Math.floor(pageBleed.get('top') * ratio.workspace)}px`,
      left: `${Math.floor(pageBleed.get('left') * ratio.workspace)}px`,
      width: `${sheetSizeWithoutBleed.width}px`,
      height: `${sheetSizeWithoutBleed.height}px`
    };

    const hoverBoxClass = classNames('box', {
      hover: isHover && page.get('type') !== pageTypes.spine
    });

    const { elementArray, containerOffset, tooltip } = this.state;

    const selectedElementArray = elementArray.filter(o => o.get('isSelected'));
    const isOnlyExpandFull =
      (isCover && isSupportHalfImageInCover) || (!isCover && isPressBook);

    const elementControlsProps = {
      t,
      page,
      selectedElementArray,
      containerOffset,
      isOnlyExpandFull,
      elementRefs: this.refs,
      onElementArrayChange: this.onElementArrayChange,
      submitElementArray: this.submitElementArray,
      actionbarActions: this.actionbarActions,
      minContainerWidth: 360 * ratio.workspace
    };

    return (
      <div
        ref={(div) => {
          this.bookPage = div;
        }}
        className={bookPageClassName}
        style={bookPageStyle}
        onMouseDown={this.switchPage}
        onMouseUp={this.onMouseUp}
        onBlur={this.onBlur}
        tabIndex={0}
      >
        <div className="page-background" style={pageBackgroundStyle} />

        {this.getRenderHtml()}
        <div className={hoverBoxClass} style={hoverBoxStyle} />
        {this.getRenderHandlerHtml()}

        {pageEnabled ? (
          <XFileUpload
            className="hide"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref="fileUpload"
          />
        ) : null}

        {containerOffset ? <ElementControls {...elementControlsProps} /> : null}

        {tooltip.isShown ? (
          <Tooltip style={tooltip.style}>{tooltip.content}</Tooltip>
        ) : null}
      </div>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
