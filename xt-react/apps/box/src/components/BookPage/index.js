import React, { Component } from 'react';
import { get, isEqual, merge } from 'lodash';
import { translate } from 'react-translate';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import { makeId } from '../../../common/utils/math';

import XFileUpload from '../../../common/ZNOComponents/XFileUpload';
import Handler from '../Handler';
import DisableHandler from '../DisableHandler';
import PhotoElement from '../PhotoElement';
import CameoElement from '../CameoElement';
import DvdElement from '../DvdElement';
import USBTextElement from '../USBTextElement';
import TextElement from '../TextElement';
import SpineTextElement from '../SpineTextElement';
import SnackBar from '../SnackBar';
import { convertElements } from './handler/computeElements';

import { elementTypes, pageTypes, productTypes } from '../../contants/strings';
import { ClickCloudUploadImage } from '../../contants/trackerConfig';

import * as pageHandler from './handler/page';
import * as textHandler from './handler/textHandler';

import './index.scss';

class BookPage extends Component {
  constructor(props) {
    super(props);

    this.onPageDragOver = event => pageHandler.onPageDragOver(event);
    this.onPageDroped = event => pageHandler.onPageDroped(this, event);
    this.switchPage = e => pageHandler.switchPage(this, e);

    this.convertElements = (nextProps, elements, ratio) =>
      convertElements(this, nextProps, elements, ratio);

    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.getRenderHandlerHtml = this.getRenderHandlerHtml.bind(this);
    this.openUploadImageModal = this.openUploadImageModal.bind(this);

    this.handleTextMouseDown = (elementId, event) =>
      textHandler.handleTextMouseDown(this, elementId, event);
    this.handleTextMove = opt => textHandler.handleTextMove(this, opt);
    this.handleTextMouseUp = (elementId, mx, my, rwidth, rheight) =>
      textHandler.handleTextMouseUp(this, elementId, mx, my, rwidth, rheight);
    this.handleTextRemove = elementId =>
      textHandler.handleTextRemove(this, elementId);
    this.checkPrintedTextPosition = opt =>
      textHandler.checkPrintedTextPosition(this, opt);
    this.clearHideSnackBarTimer = this.clearHideSnackBarTimer.bind(this);
    this.delayHideSnackBar = this.delayHideSnackBar.bind(this);
    this.setShowSnackBarStatus = status =>
      pageHandler.setShowSnackBarStatus(this, status);

    const { data, actions } = this.props;
    const { elements, rate } = data;
    const {
      boundProjectActions,
      boundPaginationActions,
      toggleOperationPanel,
      boundWorkspaceActions,
      editText,
      editTextWithoutJustify
    } = actions;

    // this.ignorePageRender = false;
    this.state = {
      elementArray: this.convertElements(this.props, elements, rate),
      photoActions: {
        boundProjectActions,
        boundPaginationActions,
        toggleOperationPanel,
        handleDblClick: () => {
          //this.onCropImage();
        },
        openUploadImageModal: this.openUploadImageModal,
        boundWorkspaceActions
      },
      textActions: {
        handleMouseDown: this.handleTextMouseDown,
        handleDblClick: editTextWithoutJustify,
        handleTextRemove: this.handleTextRemove,
        editTextWithoutJustify
      },
      hideSnackBarTimer: null,
      showSnackBar: false
    };
  }

  openUploadImageModal() {
    const { actions } = this.props;
    const { boundTrackerActions } = actions;
    findDOMNode(this.refs.fileUpload).click();
    boundTrackerActions.addTracker(ClickCloudUploadImage);
  }

  clearHideSnackBarTimer() {
    const { hideSnackBarTimer } = this.state;
    this.setShowSnackBarStatus(true);
    window.clearTimeout(hideSnackBarTimer);
  }

  delayHideSnackBar() {
    const hideSnackBarTimer = window.setTimeout(() => {
      this.setShowSnackBarStatus(false);
    }, 30);
    this.setState({
      hideSnackBarTimer
    });
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props.data;
    const newData = nextProps.data;

    const oldElements = oldData.elements;
    const newElements = newData.elements;

    const oldRate = oldData.rate;
    const newRate = newData.rate;

    const pageId = oldData.page.id;
    const paginationPageId = newData.pagination.pageId;

    if (!isEqual(oldElements, newElements) || oldRate !== newRate) {
      const newElementArray = this.convertElements(
        nextProps,
        newElements,
        newRate
      );

      this.setState({
        elementArray: newElementArray
      });
    }

    if (pageId !== paginationPageId) {
      this.setState({
        isOperationPanelShow: false
      });
    }

    // 如果是 IW 的左内页只有空的 photoElement 且是 preview 状态时，给页面添加皮革背景 且 不render 任何元素。
    // let ignorePageRender = false;
    // const { page, elements, isPreview } = newData;
    // if (isPreview && get(page, 'type') === pageTypes.page && elements.length === 1) {
    //   const isPhotoElement = get(elements[0], 'type') === elementTypes.photo;
    //   const elementEncImgId = get(elements[0], 'encImgId');
    //   if (isPhotoElement && !elementEncImgId) {
    //     ignorePageRender = true;
    //   }
    // }
    // this.ignorePageRender = ignorePageRender;
  }

  renderElement(element, index) {
    const { actions, data } = this.props;
    // const { containerOffset } = this.state;
    const {
      isPreview,
      summary,
      page,
      rate,
      paginationSpread,
      parameterMap,
      setting,
      elements,
      size,
      pagination,
      urls
    } = data;

    const { editText, boundProjectActions } = actions;
    const isCover = get(summary, 'isCover');
    const elementRefId = `element-${get(element, 'id')}`;

    switch (get(element, 'type')) {
      case elementTypes.cameo: {
        const cameoData = {
          summary,
          element,
          rate,
          page,
          parameterMap,
          paginationSpread,
          setting,
          // parameters,
          isPreview
          // isCameoActionBarShow,
          // containerOffset
        };
        const cameoActions = merge({}, actions, {
          openUploadImageModal: this.openUploadImageModal
        });
        return (
          <CameoElement key={index} actions={cameoActions} data={cameoData} />
        );
      }

      case elementTypes.usbText: {
        // 在预览模式下, 要过滤空的文本框.
        if (isPreview && !element.text) {
          return null;
        }

        const USBTextData = {
          urls,
          summary,
          element,
          rate,
          page,
          paginationSpread,
          setting,
          size,
          isPreview
        };

        return (
          <USBTextElement key={index} actions={actions} data={USBTextData} />
        );
      }

      case elementTypes.paintedText: {
        // 在预览模式下, 要过滤空的文本框.
        if (isPreview && !get(element, 'text')) {
          return null;
        }

        const { textActions, elementArray } = this.state;
        const textData = {
          summary,
          element,
          rate,
          page,
          paginationSpread,
          isPreview,
          pagination,
          elementArray,
          isCover
        };
        if (get(page, 'type') === pageTypes.spine) {
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
            canvasId={makeId(get(element, 'id'))}
            containerWidth={get(element, 'computed.width')}
            containerHeight={get(element, 'computed.height')}
            options={element}
            pageWidth={get(page, 'width')}
            pageHeight={get(page, 'height')}
            updateElement={boundProjectActions.updateElement}
            disableCustomEvents={isPreview}
            handleTextMove={this.handleTextMove}
            handleMouseDown={this.handleTextMouseDown}
            handleDblClick={editText}
            handleMouseUp={this.handleTextMouseUp}
            handleTextRemove={this.handleTextRemove}
            checkPrintedTextPosition={this.checkPrintedTextPosition}
            handleTextEdit={editText}
            ratio={rate}
            key={index}
          />
        );
      }

      case elementTypes.text: {
        // 在预览模式下, 要过滤空的文本框.
        if (isPreview && !get(element, 'text')) {
          return null;
        }
        return (
          <TextElement
            canvasId={makeId(get(element, 'id'))}
            containerWidth={get(element, 'computed.width')}
            containerHeight={get(element, 'computed.height')}
            options={element}
            pageWidth={get(page, 'width')}
            pageHeight={get(page, 'height')}
            updateElement={boundProjectActions.updateElement}
            disableCustomEvents={isPreview}
            handleTextMove={this.handleTextMove}
            handleMouseDown={this.handleTextMouseDown}
            handleDblClick={editText}
            handleMouseUp={this.handleTextMouseUp}
            handleTextRemove={this.handleTextRemove}
            ratio={rate}
            key={index}
            handleTextEdit={editText}
          />
        );
      }

      case elementTypes.photo: {
        // 在预览模式下, 要过滤空的图片框.
        // if (ignoreEmpty && !element.get('encImgId')) {
        //   return null;
        // }
        const { photoActions, elementArray, isOperationPanelShow } = this.state;

        const newPhotoActions = merge({}, photoActions, {
          setShowSnackBarStatus: this.setShowSnackBarStatus
        });

        const photoData = {
          summary,
          element,
          rate,
          page,
          paginationSpread,
          isPreview,
          pagination,
          elements,
          isCover,
          operationPanelStatus: this.state.isOperationPanelShow
        };

        return (
          <PhotoElement
            key={index}
            data={photoData}
            actions={newPhotoActions}
          />
        );
      }

      case elementTypes.dvd: {
        // 在预览模式下, 要过滤空的图片框.
        // if (ignoreEmpty && !element.get('encImgId')) {
        //   return null;
        // }
        const { photoActions, elementArray, isOperationPanelShow } = this.state;

        const newPhotoActions = merge({}, photoActions, {
          setShowSnackBarStatus: this.setShowSnackBarStatus
        });

        const dvdData = {
          summary,
          element,
          rate,
          page,
          paginationSpread,
          isPreview,
          pagination,
          elements,
          isCover,
          operationPanelStatus: this.state.isOperationPanelShow
        };

        return (
          <DvdElement key={index} data={dvdData} actions={newPhotoActions} />
        );
      }
      default:
        return null;
    }
  }

  getRenderHtml() {
    const { data, t } = this.props;
    const { summary, page, rate, isPreview, settings, elements } = data;
    const html = [];
    const pageEnabled = get(page, 'enabled');
    const isCover = get(summary, 'isCover');

    const { elementArray } = this.state;

    /* 如果是 IW 的左内页只有空的 photoElement 且是 preview 状态时，不 render 内容。
    if (this.ignorePageRender) return null; */

    //  渲染当前页面中的所有元素。
    if (elementArray.length) {
      elementArray.forEach((element, index) => {
        if (
          get(element, 'type') === elementTypes.cameo &&
          get(summary, 'cameo') === 'none'
        ) {
          // nothing to do here.
        } else {
          html.push(this.renderElement(element, index));
        }
      });
    }

    return html;
  }

  getRenderHandlerHtml() {
    const { data } = this.props;
    const { page, isPreview } = data;
    const pageEnabled = get(page, 'enabled');
    let html;

    // handler的action和data.
    const handlerActions = {
      handleDragOver: this.onPageDragOver,
      handleDrop: this.onPageDroped
    };
    const handlerData = {};
    const disableHandlerData = {};

    // 如果为预览模式, 一律添加disablehandler
    if (isPreview) {
      html = <DisableHandler data={disableHandlerData} />;
    } else {
      html = pageEnabled ? (
        <Handler data={handlerData} actions={handlerActions} />
      ) : null;
    }

    return html;
  }

  render() {
    const { data, actions, renderCoverSheetSize } = this.props;
    const { setting, page, centerRenderArea, rate } = data;
    const { elementArray, showSnackBar } = this.state;
    const elementHasEncImgId = elementArray.find(
      ele =>
        (get(ele, 'type') == elementTypes.photo ||
          get(ele, 'type') == elementTypes.dvd) &&
        get(ele, 'encImgId')
    );
    const wrapSize = get(page, 'wrapSize');
    const dvdElement = elementArray.find(ele=>get(ele, 'type') == elementTypes.dvd )
    const photoOrDvdEle = elementArray.find(
      ele =>
        get(ele, 'type') == elementTypes.dvd ||
        get(ele, 'type') == elementTypes.photo
    );
    let snackBarLeft;
    let snackBarTop;
    let snackBarWidth;
    // 封面有出血
    const pageBleedBottom = get(page, 'bleed.bottom') || 0;
    if (renderCoverSheetSize) {
      snackBarLeft =
        renderCoverSheetSize && -parseInt(renderCoverSheetSize.left);
      snackBarTop =
        renderCoverSheetSize &&
        centerRenderArea.height - 46 - parseInt(renderCoverSheetSize.top);
      snackBarWidth = centerRenderArea && centerRenderArea.width;
    } else if (photoOrDvdEle) {
      // 内页的普通element
      snackBarLeft = photoOrDvdEle.computed;
      snackBarTop =
        photoOrDvdEle.computed.height - 46 - parseInt((wrapSize.bottom + pageBleedBottom) * rate);
      snackBarWidth = photoOrDvdEle.computed.width;
    }

    const pageType = get(page, 'type');
    const {
      boundUploadedImagesActions,
      toggleModal,
      onRemoveImage,
      onCropImage
    } = actions;
    const bookPageClass = classNames('book-page', {
      notHidden: pageType === pageTypes.spine
    });

    const snackBarProps = {
      left: snackBarLeft,
      top: snackBarTop,
      width: snackBarWidth,
      isShown: showSnackBar,
      minIcon: dvdElement,
      actions: {
        onMouseEnter: this.clearHideSnackBarTimer,
        onMouseLeave: this.delayHideSnackBar,
        onEditImage: () => {
          onCropImage();
        },
        onSwitchLayout: () => {},
        onDelete: () => {
          onRemoveImage();
        }
      }
    };

    /*
    const bookPageStyle = {};
    if (this.ignorePageRender) {
      switch (get(setting, 'product')) {
        case productTypes.imageBox:
          bookPageStyle.backgroundImage = 'url(./assets/bgMaterial/black.jpg)';
          break;
        case productTypes.usbCase:
        case productTypes.dvdCase:
          bookPageStyle.backgroundImage = 'url(./assets/bgMaterial/dvd_black.png)';
          break;
        default:
          break;
      }
    } */

    return (
      <div className={bookPageClass} onMouseDown={this.switchPage}>
        <XFileUpload
          className="hidden"
          boundUploadedImagesActions={boundUploadedImagesActions}
          toggleModal={toggleModal}
          ref="fileUpload"
        />
        {this.getRenderHtml()}
        {this.getRenderHandlerHtml()}
        {elementHasEncImgId ? <SnackBar {...snackBarProps} /> : null}
      </div>
    );
  }
}

BookPage.propTypes = {};

BookPage.defaultProps = {};

export default translate('BookPage')(BookPage);
