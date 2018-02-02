import React, { Component } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import { elementTypes, pageTypes } from '../../contants/strings';

// 默认设置.
import * as canvasOptions from '../../contants/canvas';

// canvas
import * as helperHandler from '../../utils/canvas/helper';
import * as pageHandler from './handler/page';
import * as elementHandler from './handler/element';
import { toDownload } from './canvas/downloadImage';

import PhotoElementShot from '../PhotoElementShot';
import TextElementShot from '../TextElementShot';
import CameoElementShot from '../CameoElementShot';
import SpineTextElementShot from '../SpineTextElementShot';
import ShadowElement from '../ShadowElement';
import StickerElement from '../StickerElementShot';
import BackgroundElement from '../BackgroundElementShot';

import './index.scss';

class BookPageScreenShot extends Component {
  constructor(props) {
    super(props);

    // element的相关方法.
    this.computedElementOptions = (props, element, ratio) => {
      return elementHandler.computedElementOptions(this, props, element, ratio);
    };


    // canvas的渲染.
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.toDownload = elementArray => toDownload(this, elementArray);

    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),
      isRatioChanged: false,
    };
  }

  componentWillMount() {
    pageHandler.componentWillMount(this);
  }

  componentWillReceiveProps(nextProps) {
    pageHandler.componentWillReceiveProps(this, nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.unselectElements);
  }

 /**
    * 组合所有的元素的html.
    */
  getRenderHtml(elementArray) {
    const { data, t } = this.props;
    const { isPreview, page, summary, ratio, settings, parameters, paginationSpread, isBookCoverInnerWarp, materials } = data;
    const pageId = page.get('id');
    const html = [];

    const { downloadData } = this.state;


    const sortedElementArray = helperHandler.sortElementsByZIndex(elementArray);

     // 如果页面上有元素.
    if (sortedElementArray && sortedElementArray.size) {
      sortedElementArray.forEach((element) => {
        const elementId = element.get('id');
        const theDownloadData = downloadData.get(elementId) || Immutable.Map();

        const textElementProps = {
          key: elementId,
          element,
          isPreview,
          imageObj: theDownloadData.get('imageObj'),
          downloadStatus: theDownloadData.get('downloadStatus'),
          isShowTextNotFit: theDownloadData.get('isShowTextNotFit'),
          tryToDownload: () => this.toDownload(Immutable.List([element]))
        };

        switch (element.get('type')) {
          case elementTypes.photo: {
            if (!element.get('encImgId')) {
              return null;
            }
            const photoElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              isBookCoverInnerWarp
            };
            html.push(<PhotoElementShot {...photoElementProps} />);
            break;
          }

          case elementTypes.sticker: {
            const forceToDownload = true;
            const stickerElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp
            };
            html.push(<StickerElement {...stickerElementProps} />);
            break;
          }

          case elementTypes.background: {
            const forceToDownload = true;
            const backgroundElementProps = {
              key: elementId,
              element,
              isPreview,
              pageId,
              imageObj: theDownloadData.get('imageObj'),
              downloadStatus: theDownloadData.get('downloadStatus'),
              tryToDownload: () =>
                this.toDownload(Immutable.List([element]), forceToDownload),
              isBookCoverInnerWarp
            };
            html.push(<BackgroundElement {...backgroundElementProps} />);
            break;
          }

          case elementTypes.text: {
            // 如果是spine不渲染任何text
            if (page.get('type') === pageTypes.spine) {
              return;
            }
            if (isPreview && !element.get('text')) {
              return;
            }

            if (element.get('isSpineText')) {
              html.push(<SpineTextElementShot {...textElementProps} />);
              return;
            }
            // isBookCoverInnerWarp 不渲染文字
            if (!isBookCoverInnerWarp) {
              html.push(<TextElementShot {...textElementProps} />);
            }
            break;
          }
          case elementTypes.cameo : {
            const cameoElementsProps = {
              key: elementId,
              element,
              isPreview,
              summary,
              ratio,
              settings,
              parameters,
              paginationSpread,
              materials
            };
            html.push(<CameoElementShot {...cameoElementsProps} />);
            break;
          }
          case elementTypes.paintedText : {
             // 在预览模式下, 要过滤空的文本框.
            if (!element.get('text')) {
              return null;
            }
            if (page.get('type') === pageTypes.spine) {
              const spineTextElementProps = {
                key: elementId,
                element,
                isPreview,
                imageObj: downloadData.getIn([elementId, 'imageObj']),
              };
              html.push(<SpineTextElementShot {...spineTextElementProps} />);
            } else {
              html.push(<TextElementShot {...textElementProps} />);
            }
            break;
          }
          default:
        }
      });
    }

    return html;
  }

  render() {
    const { data, actions, t } = this.props;
    const { page, ratio, size, zIndex, parameters, summary, position, paginationSpread, index } = data;

    const { elementArray } = this.state;

    const { renderCoverSheetSize, renderInnerSheetSize, renderInnerSheetSizeWithoutBleed } = size;
    const isSpinePage = page.get('type') === pageTypes.spine;

    const isCover = summary.get('isCover');
    const shadow = paginationSpread.get('shadow');

    const sheetWithBleedPosition = {
      top:
        renderInnerSheetSize ? ((renderInnerSheetSize.height -
                  renderInnerSheetSizeWithoutBleed.height) /
                  2) : 0,
      left:
        renderInnerSheetSize ? ((renderInnerSheetSize.width -
                  renderInnerSheetSizeWithoutBleed.width) /
                  2) : 0
    };

    const positionTop = position ? position.render ? position.render.top : position.inner.render.top : 0;
    const positionLeft = position ? position.render ? position.render.left : position.inner.render.left : 0;

    const innerSheetPosition = {
      top: positionTop + renderInnerSheetSizeWithoutBleed.top,
      left: positionLeft + renderInnerSheetSizeWithoutBleed.left
    };

    const innerSheetWithBleedPosition = {
      top: renderInnerSheetSize.top -
        (renderInnerSheetSize.height -
          renderInnerSheetSizeWithoutBleed.height) /
          2 + innerSheetPosition.top,
      left: renderInnerSheetSize.left -
        (renderInnerSheetSize.width -
          renderInnerSheetSizeWithoutBleed.width) /
          2 + innerSheetPosition.left
    };

    let bookPageProps = {
      x: innerSheetWithBleedPosition.left,
      y: innerSheetWithBleedPosition.top,
      width: renderInnerSheetSize.width,
      height: renderInnerSheetSize.height,
      zIndex
    };

    let backRectProps = {
      x: -(innerSheetWithBleedPosition.left - innerSheetPosition.left),
      y: -(innerSheetWithBleedPosition.top - innerSheetPosition.top),
      width: renderInnerSheetSizeWithoutBleed.width,
      height: renderInnerSheetSizeWithoutBleed.height,
      fill: page.get('bgColor') || '#fff'
    };

    if (!isSpinePage) {
      bookPageProps = merge({}, bookPageProps, {
        clipFunc: (ctx) => {
          ctx.rect(backRectProps.x, backRectProps.y, renderInnerSheetSizeWithoutBleed.width, renderInnerSheetSizeWithoutBleed.height);
        }
      });
    }

    if (isCover) {
      const spineWidth = parameters.getIn(['spineWidth', 'baseValue']) * ratio.workspace;
      const isFrontPage = page.get('type') === pageTypes.front;

      bookPageProps = {
        x: renderCoverSheetSize.left,
        y: renderCoverSheetSize.top,
        width: renderCoverSheetSize.width,
        height: renderCoverSheetSize.height,
        fill: '#fff',
        zIndex
      };

      backRectProps = {
        x: renderCoverSheetSize.left + spineWidth,
        y: renderCoverSheetSize.top,
        width: renderCoverSheetSize.width,
        height: renderCoverSheetSize.height,
        fill: page.get('bgColor') || '#fff'
      };

      if (isFrontPage) {
        bookPageProps = merge({}, bookPageProps, {
          clipFunc: (ctx) => {
            ctx.rect(renderCoverSheetSize.left + spineWidth, renderCoverSheetSize.top, renderCoverSheetSize.width, renderCoverSheetSize.height);
          }
        });
      }
    }

    const shadowElements = [];
    // 给内页的sheet添加一个shadow.
    if (!isCover) {
      let shadowElement = shadow;
      if (index === 1) {
        shadowElement = shadowElement.set('left', shadowElement.get('left') - (shadowElement.get('width') / 2));
      }
      const shadowData = { element: shadowElement, ratio };
      shadowElements.push(
        <ShadowElement
          key="shadow-element"
          data={shadowData}
        />
      );
    }

    const shadowGroupProps = {
      x: backRectProps.x,
      y: backRectProps.y,
      width: renderInnerSheetSizeWithoutBleed.width,
      width: renderInnerSheetSizeWithoutBleed.width,
    }

    return (
      <Group {...bookPageProps}>
        {
            !isSpinePage ?
              <Rect {...backRectProps} /> :
                null
          }
        { this.getRenderHtml(elementArray) }
        <Group {...shadowGroupProps}>
        </Group>
      </Group>
    );
  }
}

BookPageScreenShot.propTypes = {
};

BookPageScreenShot.defaultProps = {
};

export default translate('BookPageScreenShot')(BookPageScreenShot);
