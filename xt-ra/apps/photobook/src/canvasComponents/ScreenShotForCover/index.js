import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { Layer, Stage, Group, Rect, Text, Image } from 'react-konva';
import { merge, get } from 'lodash';

import { pageTypes } from '../../contants/strings';

import { toDownload } from '../BookPage/canvas/downloadImage';

import BookPageScreenShot from '../BookPageScreenShot';
import ShadowElement from '../ShadowElement';

import * as handler from './handler';

import './index.scss';

class ScreenShotForCover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),
      bgImageObj: null,
      effectImageObj: null
    };

    // canvas的渲染.
    this.computedCoverSheet = (workspaceRatio, size, pages, pageIndex, isCrystalOrMetal) => handler.computedCoverSheet(workspaceRatio, size, pages, pageIndex, isCrystalOrMetal);

  }


  render() {
    const {
      paginationSpread,
      variables,
      materials,
      size,
      ratio,
      pagination,
      template,
      position,
      settings,
      isPreview,
      parameters,
      urls,
      env
       } = this.props;

    const { bgImageObj, effectImageObj } = this.state;

    const summary = paginationSpread.get('summary');

    const containerRect = {
      width: size.renderCoverSize.width,
      height: size.renderCoverSize.height
    };

    const bgImageProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height
    };

    if (bgImageObj) {
      bgImageProps.image = bgImageObj;
    }

    const sheetGroupProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height,
    };

    const effectImageProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height,
    };


    let bookPages = [];

    const screenshotClass = 'screenshot';

    let backRectProps;

    if (summary) {

      const pages = paginationSpread.get('pages');
      const images = paginationSpread.get('images');

      const effectImg = materials.getIn(['cover', 'img']);

      const normalPage = pages.find((p) => {
        return p.get('type') !== pageTypes.spine;
      });

      backRectProps = {
        x: 0,
        y: 0,
        width: containerRect.width,
        height: containerRect.height
      };

      const coverimage = variables && variables.getIn(['coverAsset', 'coverimage']);
      const bgImage = coverimage && effectImg ? `url("${urls.baseUrl}${coverimage.substring(1)}")` : '';

      const spinePage = pages.find((p) => {
        return p.get('type') === pageTypes.spine;
      });
      if (pages && pages.size) {
        pages.forEach((page, index) => {
          // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
          const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');
          const coverSheetSizeObj = this.computedCoverSheet(ratio.coverWorkspace, size, pages, index, position, isCrystalOrMetal);
          const newSize = merge({}, size, coverSheetSizeObj);
          const flop = true;
          const pageData = {
            isPreview,
            urls,
            summary,
            page,
            images,
            elements: page.get('elements'),
            ratio,
            index,
            settings,
            template,
            paginationSpread,
            parameters,
            variables,
            size: newSize,
            spinePage,
            materials,
            position,
            flop,
            env
          };

          const isSpine = page.get('type') === pageTypes.spine;

          const { renderCoverSheetSizeWithoutBleed } = newSize;

          const { left, top, width, height } = renderCoverSheetSizeWithoutBleed;

          const sheetGroupProps = {
            x: left,
            y: top,
            width,
            height,
            id: 'sheet'
          };

           bookPages.unshift(
              <Group {...sheetGroupProps} key={page.get('id')}>
                <BookPageScreenShot data={pageData} />
              </Group>
          );

        });
      }
    }

    return (
        <Group {...sheetGroupProps}>
          { bookPages }
        </Group>
    );
  }
}

export default ScreenShotForCover;
