import React, { Component } from 'react';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';
import { Layer, Stage, Group, Rect, Text } from 'react-konva';

import { elementTypes, pageTypes, logoInfo } from '../../contants/strings';

// canvas
import * as helperHandler from '../../utils/canvas/helper';
import * as pageHandler from './handler/page';
import * as elementHandler from './handler/element';
import { toDownload } from './canvas/downloadImage';

import PhotoElementShot from '../PhotoElementShot';
import TextElementShot from '../TextElementShot';
import SpineTextElementShot from '../SpineTextElementShot';
import ProductLogoShot from '../ProductLogoShot';

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
    const { isPreview, page, summary, ratio, settings, parameters, paginationSpread, variables, isImageCover } = data;
    const pageId = page.get('id');
    const html = [];

    const { downloadData } = this.state;

    if(page.get('type') === pageTypes.full && page.getIn(['backend', 'isPrint'])){
      const logo = summary.get('logo');
      const coverForegroundColor = variables.get('coverForegroundColor');
      const logoWidth = logoInfo.ratio * page.get('width') * ratio.coverWorkspace;


      const productLogoData = {
        position: {
          y: Math.round(logo.get('top') * ratio.coverWorkspace),
          x: Math.round(logo.get('left') * ratio.coverWorkspace - logoWidth / 2),
          width: Math.round(logoWidth),
          height: Math.round(logoWidth / logoInfo.imageRatio)
        },
        logoType: coverForegroundColor === '#fefefe' ? 1 : 2
      };

      html.push(<ProductLogoShot data={productLogoData} />);
    }

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
          tryToDownload: () => this.toDownload(Immutable.List([element]))
        };

        if (page.get('type') === pageTypes.spine) {
          const spineTextElementProps = {
            key: elementId,
            element,
            isPreview,
            imageObj: downloadData.getIn([elementId, 'imageObj']),
          };
          html.push(<SpineTextElementShot {...spineTextElementProps} />);
        } else {
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
                  tryToDownload: () => this.toDownload(Immutable.List([element]))
                };
                html.push(<PhotoElementShot {...photoElementProps} />);
                break;
              }
              case elementTypes.text: {
                if (!element.get('text')) {
                  return null;
                }
                html.push(<TextElementShot {...textElementProps} />);
                break;
              }
              default:
            }
        }
        });
    }

    return html;
  }

  render() {
    const { data, actions, t } = this.props;
    const { page, ratio, size, spinePage } = data;

    const isFrontPage = page.get('type') === pageTypes.front;
    const isSpinePage = page.get('type') === pageTypes.spine;

    const { elementArray } = this.state;

    const { renderCoverSheetSize } = size;

    const offset = page.get('offset');

    const bookPageProps = {
      x: renderCoverSheetSize.left + offset.get('left') * ratio.coverWorkspace,
      y: renderCoverSheetSize.top + offset.get('top') * ratio.coverWorkspace,
      width: renderCoverSheetSize.width,
      height: renderCoverSheetSize.height
    };

    const backRectProps = {
      x: renderCoverSheetSize.left,
      y: renderCoverSheetSize.top,
      width: renderCoverSheetSize.width,
      height: renderCoverSheetSize.height,
      fill: '#fff'
    };

    return (
          <Group {...bookPageProps}>
          {
            isFrontPage ?
              <Rect {...backRectProps} /> :
                null
          }
            { this.getRenderHtml(elementArray) }
          </Group>
    );
  }
}

BookPageScreenShot.propTypes = {
};

BookPageScreenShot.defaultProps = {
};

export default translate('BookPageScreenShot')(BookPageScreenShot);
