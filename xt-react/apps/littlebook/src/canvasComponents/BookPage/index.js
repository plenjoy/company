import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { translate } from 'react-translate';
import { merge, isEqual, get } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import {
  elementTypes,
  shapeType,
  userMistakeLimit,
  pageTypes,
  logoInfo,
  spineShodawRatioForHardCover,
  spineShodawRatioForPaperCover,
  coverTypes
} from '../../contants/strings';
import { getCropOptions } from '../../utils/crop';

// 导入组件
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';

import ProductLogo from '../ProductLogo';
import PhotoElement from '../PhotoElement';
import TextElement from '../TextElement';
import SpineTextElement from '../SpineTextElement';

// 导入处理函数
import * as elementHandler from './handler/element';
import * as pageHandler from './handler/page';
import * as layoutHandler from './handler/autoLayout';
import * as selectElementHandler from './handler/selectElement';

import * as actionbarEvents from './handler/actionbarEvents';

import * as canvasOptions from '../../contants/canvas';
import * as helperHandler from '../../utils/canvas/helper';
import * as layerEvents from './canvas/layerEvents';
import * as elementEvents from './canvas/elementEvents';
import { toDownload } from './canvas/downloadImage';

import Tooltip from '../../components/Tooltip';
import SnackBar from '../../components/SnackBar';
import OriginalPhotoLayer from '../../components/OriginalPhotoLayer';

import {
  checkElementTemplateType,
  templateTypes
} from '../../utils/customeTemplate';
import { getCoverPhotoElementRect } from '../../utils/elementHelper';

import './index.scss';

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

    this.onPageDroped = event => pageHandler.onPageDroped(this, event);
    this.onPageDragOver = event => pageHandler.onPageDragOver(this, event);
    this.onPageDragLeave = event => pageHandler.onPageDragLeave(this, event);
    this.onPageDragEnter = event => pageHandler.onPageDragEnter(this, event);
    this.onPageDragEnd = event => pageHandler.onPageDragEnd(this, event);
    this.changeCurrentElement = element =>
      pageHandler.changeCurrentElement(this, element);
    this.checkIfHasElementInLimit = (elements, limit) =>
      pageHandler.checkIfHasElementInLimit(elements, limit);

    // layer events
    this.addEventsToLayerOfElements = () =>
      layerEvents.addEventsToLayerOfElements(this);

    this.onMouseEnter = (element, e) =>
      elementEvents.onMouseEnter(this, element, e);
    this.onMouseLeave = (element, e) =>
      elementEvents.onMouseLeave(this, element, e);
    this.onClick = (element, e) => elementEvents.onClick(this, element, e);
    this.onMouseOver = (elementGroupNode, e) =>
      elementEvents.onMouseOver(this, elementGroupNode, e);
    this.onMouseMove = (element, e) =>
      elementEvents.onMouseMove(this, element, e);
    this.onMouseOut = (elementGroupNode, e) =>
      elementEvents.onMouseOut(this, elementGroupNode, e);

    this.switchPage = e => pageHandler.switchPage(this, e);
    this.activePage = e => pageHandler.activePage(this, e);

    this.toDownload = (elementArray, forceToDownload) =>
      toDownload(this, elementArray, forceToDownload);

    this.clearSelected = this.clearSelected.bind(this);

    window.addEventListener('mousedown', this.clearSelected);

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
      },
      onSwitchLayout: () => {
        return actionbarEvents.onSwitchLayout(
          this,
          this.state.currentPointPhotoElementId
        );
      }
    };

    this.toggleModal = (type, status) => {
      const { actions } = this.props;
      const { boundUploadImagesActions } = actions;
      boundUploadImagesActions.toggleUpload(status);
    };

    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),
      tooltip: {
        isShown: false,
        style: null,
        content: ''
      },
      snackBar: {
        isShown: false,
        left: 0,
        bottom: 0,
        width: 0,
        templateId: 0
      },
      isDragOver: false,
      containerRect: null,
      hideSnackBarTimer: null,
      currentPointPhotoElementId: -1,
      hoverBoxStyle: {},

      originalPhotoLayer: {
        isShown: false,
        x: 0,
        y: 0,
        imageUrl: ''
      }
    };

    this.onElementArrayChange = this.onElementArrayChange.bind(this);
    this.updateElement = this.updateElement.bind(this);

    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.clearHideSnackBarTimer = this.clearHideSnackBarTimer.bind(this);
    this.delayHideSnackBar = this.delayHideSnackBar.bind(this);

    this.clicksObj = {
      num: 0,
      clickElementId: null
    };
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentDidMount() {
    this.toDownload(this.state.elementArray);

    this.addEventsToLayerOfElements();

    this.updateOffset();
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.clearSelected);
  }

  updateOffset() {
    if (this.stage) {
      this.setState({
        containerRect: this.stage
          .getStage()
          .getContainer()
          .getBoundingClientRect()
      });
    }
  }

  clearSelected() {
    const { elementArray } = this.state;

    const newElementArray = elementArray.map((element) => {
      return element.set('isSelected', false);
    });

    if (!Immutable.is(elementArray, newElementArray)) {
      this.setState({
        elementArray: newElementArray
      });
    }
  }

  renderBackgroundTextElement() {
    const { data, t } = this.props;
    const {
      isPreview,
      page,
      summary,
      paginationSpread,
      parameters,
      settings,
      ratio,
      project
    } = data;
    const isSpinePage = page.get('type') === pageTypes.spine;
    const pageEnabled = page.get('enabled');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');

    const elements = paginationSpread.get('elements');

    const backgroundElements = [];

    if (!isPreview && !isSpinePage) {
      // 只有不是preview, 并且也不是spine的情况下, 才加上默认的提示语.

      // 没有元素时, 就添加一个提示文字.
      let text = pageEnabled ? t('ENABLED_BACKGROUND_TIP') : '';
      let color = canvasOptions.defaultTextColor;

      // 如果是pressbook, 并且page为disable并且是内页. 那么就直接添加一个默认的提示元素.
      if (isPressBook && !pageEnabled && !isCover) {
        text = t('DISABLED_BACKGROUND_TIP');
        color = '#b7b7b7';
      }

      if (text) {
        const pageWidth = page.get('width');
        const pageHeight = page.get('height') * ratio.workspace;

        const bleed = page.get('bleed');

        const attrs = helperHandler.getBackgroundElementOptions(
          this,
          text,
          '#b7b7b7'
        );
        attrs.ref = (node) => {
          this.backgroundTextNode = node;
        };
        let rectProps = {};
        if (isCover) {
          const pages = paginationSpread.get('pages');
          const fullPage = pages.find(
            c =>
              c.get('type') === pageTypes.full &&
              c.getIn(['backend', 'isPrint'])
          );
          const spinePage = pages.find(c => c.get('type') === pageTypes.spine);
          const coverThickness = parameters.get('coverThickness');
          const expandingOverFrontcover = parameters.getIn([
            'spineExpanding',
            'expandingOverFrontcover'
          ]);
          const expandingOverBackcover = parameters.getIn([
            'spineExpanding',
            'expandingOverBackcover'
          ]);
          const coverType = settings.spec.cover;

          // 书脊阴影的大小.
          let spineShodawWidth = 0;
          if (coverType === coverTypes.LBPAC) {
            spineShodawWidth =
              spineShodawRatioForPaperCover * pageWidth * ratio.workspace;
          } else if (coverType === coverTypes.LBHC) {
            spineShodawWidth =
              spineShodawRatioForHardCover * pageWidth * ratio.workspace;
          }

          const { x, y, width, height } = getCoverPhotoElementRect(
            fullPage,
            spinePage,
            coverThickness,
            expandingOverFrontcover,
            coverType
          );

          let newWidth = width * ratio.workspace - spineShodawWidth;

          if (coverType === coverTypes.LBPAC) {
            newWidth -= bleed.get('right') * ratio.workspace;
          } else if (coverType === coverTypes.LBHC) {
            newWidth -= coverThickness.get('right') * ratio.workspace;
          }

          attrs.width = newWidth;

          attrs.x =
            (x - expandingOverFrontcover - expandingOverBackcover) *
            ratio.workspace;

          const fontHeight = this.backgroundTextNode
            ? this.backgroundTextNode.getHeight()
            : 14;

          attrs.y = (pageHeight - fontHeight) / 2;
          // attrs.y = 0;

          rectProps = {
            x: attrs.x + spineShodawWidth,
            y: y * ratio.workspace,
            width: width * ratio.workspace,
            height: height * ratio.workspace,
            fill: '#f6f6f6'
          };

          backgroundElements.push(
            <Group>
              <Rect {...rectProps} />
              <Text {...attrs} />
            </Group>
          );
        } else {
          // 左右两页
          const halfWidth = pageWidth / 2 * ratio.workspace;
          const eWidth = pageWidth / 2;
          for (let i = 0; i < 2; i++) {
            attrs.x = i * halfWidth;
            attrs.width = halfWidth;
            if (
              !this.checkIfHasElementInLimit(elements, [
                i * eWidth,
                (i + 1) * eWidth
              ])
            ) {
              backgroundElements.push(
                <Group>
                  <Text {...attrs} />
                </Group>
              );
            }
          }
        }

        return <Group>{backgroundElements}</Group>;
      }
    }
    return null;
  }

  renderProductLogo() {
    const { data } = this.props;
    const { summary, page, ratio, isPreview, variables } = data;

    const isCover = summary.get('isCover');

    if (
      isCover &&
      page.get('type') === pageTypes.full &&
      page.getIn(['backend', 'isPrint'])
    ) {
      const logoObj = summary.get('logo');
      const coverForegroundColor = logoObj.get('coverForegroundColor') || '';
      const logoWidth = logoInfo.ratio * page.get('width') * ratio.workspace;

      const logoType = coverForegroundColor.toLowerCase() === '#fefefe' ? 1 : 2;

      const productLogoProps = {
        x: Math.round(
          logoObj.get('left') * ratio.workspace - logoWidth / 2
        ),
        y: Math.round(logoObj.get('top') * ratio.workspace),
        width: Math.round(logoWidth),
        height: Math.round(logoWidth / logoInfo.imageRatio),
        logoType
      };

      return <ProductLogo {...productLogoProps} />;
    }

    return null;
  }

  getRenderHtml(elementArray) {
    const { data, t, actions } = this.props;
    const { boundTrackerActions } = actions;
    const {
      isPreview,
      page,
      ratio,
      isBookCoverInnerWarp,
      images,
      capability
    } = data;
    const pageId = page.get('id');
    const html = [];

    const { downloadData } = this.state;

    const sortedElementArray = helperHandler.sortElementsByZIndex(elementArray);

    const basicActions = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      onClick: this.onClick,
      onMouseMove: this.onMouseMove
    };

    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach((element) => {
        const elementId = element.get('id');

        const theDownloadData = downloadData.get(elementId) || Immutable.Map();

        const textElementProps = {
          key: elementId,
          element,
          isPreview,
          actions: basicActions,
          imageObj: theDownloadData.get('imageObj'),
          downloadStatus: theDownloadData.get('downloadStatus'),
          isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
          tryToDownload: () => this.toDownload(Immutable.List([element]))
        };
        switch (element.get('type')) {
          case elementTypes.photo: {
            const forceToDownload = true;
            const photoElementProps = {
              key: elementId,
              element,
              images,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              actions: merge({}, basicActions, {
                onElementArrayChange: this.onElementArrayChange,
                updateElement: this.updateElement,
                changeCurrentElement: this.changeCurrentElement
              }),
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp,
              boundTrackerActions,
              capability,
              actualPageBleed: page.get('bleed').map((o) => {
                return Math.floor(o * ratio.workspace);
              })
            };
            html.push(<PhotoElement {...photoElementProps} />);
            break;
          }
          case elementTypes.text: {
            // 在预览模式下, 要过滤空的文本框.
            if (isPreview && !element.get('text')) {
              return null;
            }
            if (page.get('type') === pageTypes.spine) {
              html.push(<SpineTextElement {...textElementProps} />);
            } else {
              html.push(<TextElement {...textElementProps} />);
            }
            break;
          }
          default:
            break;
        }
      });
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

  updateElement(element) {
    const { actions } = this.props;
    const { boundProjectActions } = actions;
    delete element.computed;
    boundProjectActions.updateElement(element);
  }

  clearHideSnackBarTimer() {
    const { hideSnackBarTimer } = this.state;
    window.clearTimeout(hideSnackBarTimer);
  }

  delayHideSnackBar() {
    const hideSnackBarTimer = window.setTimeout(() => {
      this.setState({
        snackBar: Object.assign({}, this.state.snackBar, {
          isShown: false
        })
      });
    }, 30);
    this.setState({
      hideSnackBarTimer
    });
  }

  render() {
    const { data, actions, t } = this.props;
    const { isDragOver, hoverBoxStyle } = this.state;
    const { boundImagesActions } = actions;
    const {
      page,
      ratio,
      summary,
      size,
      isBookCoverInnerWarp,
      innerEffectValue
    } = data;

    const pageEnabled = page.get('enabled');
    const isPressBook = summary.get('isPressBook');
    const isCover = summary.get('isCover');

    const bookPageClassName = classNames('book-page', {
      enabled: pageEnabled,
      disabled: !pageEnabled,

      cover: isCover,
      inner: !isCover,

      pressbook: isPressBook
    });

    const canvasSize = {
      width: isBookCoverInnerWarp
        ? innerEffectValue.width - 1
        : Math.round(page.get('width') * ratio.workspace),
      height: isBookCoverInnerWarp
        ? innerEffectValue.height - 1
        : Math.round(page.get('height') * ratio.workspace)
    };

    const pageBleed = page.get('bleed');
    let sheetSizeWithoutBleed = size.renderInnerSheetSizeWithoutBleed;
    if (isCover) {
      sheetSizeWithoutBleed = size.renderCoverSheetSizeWithoutBleed;
    }

    const hoverBoxClass = classNames('box', {
      hover: isDragOver && page.get('type') !== pageTypes.spine
    });

    const {
      elementArray,
      tooltip,
      snackBar,

      originalPhotoLayer,
      currentPointPhotoElementId
    } = this.state;

    const newCurrentPointPhotoElement = elementArray.find((element) => {
      return element.get('id') === currentPointPhotoElementId;
    });

    const backgroundRect = {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill:
        isPressBook && !pageEnabled && !isCover
          ? '#ffffff'
          : page.get('bgColor'),
      id: shapeType.backgroundRect
    };

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: canvasSize.width,
      height: canvasSize.height,
      className: bookPageClassName,
      onMouseDown: this.switchPage
    };

    if (actions.activePage) {
      stageProps.onMouseUp = this.activePage;
    }

    const isShowEdit =
      newCurrentPointPhotoElement &&
      newCurrentPointPhotoElement.get('encImgId');
    const snackBarProps = {
      ...snackBar,
      isShowEdit,
      isShowDelete: isShowEdit,
      actions: {
        onMouseEnter: this.clearHideSnackBarTimer,
        onMouseLeave: this.delayHideSnackBar,
        onEditImage: () => {
          this.actionbarActions.onEditImage(newCurrentPointPhotoElement);
        },
        onSwitchLayout: this.actionbarActions.onSwitchLayout,
        onDelete: () => {
          this.actionbarActions.onRemoveImage(newCurrentPointPhotoElement);
        }
      },
      element: newCurrentPointPhotoElement
    };

    const firstElement = elementArray.first();
    const hasEmptyPhotoElement =
      elementArray.size === 1 &&
      firstElement.get('type') === elementTypes.photo &&
      !firstElement.get('encImgId');

    return (
      <div className="stage-container">
        <Stage {...stageProps}>
          <Layer ref={layer => (this.layerNodeOfElements = layer)}>
            {pageEnabled || (isPressBook && !pageEnabled && !isCover) ? (
              <Rect {...backgroundRect} />
            ) : null}
            {this.renderProductLogo()}

            <Group ref={group => (this.unselectElements = group)}>
              {this.getRenderHtml(elementArray)}
            </Group>

            {(isCover && !elementArray.size) ||
            (!isCover && elementArray.size < 2) ? (
              this.renderBackgroundTextElement()
            ) : null}
          </Layer>
        </Stage>
        {pageEnabled ? (
          <div className={hoverBoxClass} style={hoverBoxStyle} />
        ) : null}
        {pageEnabled ? (
          <XFileUpload
            className="hide"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref={fileUpload => (this.fileUpload = fileUpload)}
          />
        ) : null}
        {tooltip.isShown ? (
          <Tooltip style={tooltip.style}>{tooltip.content}</Tooltip>
        ) : null}
        {newCurrentPointPhotoElement ? <SnackBar {...snackBarProps} /> : null}
        <OriginalPhotoLayer {...originalPhotoLayer} />
      </div>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
