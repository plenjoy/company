import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Layer, Stage, Group, Rect, Text, Image } from 'react-konva';
import { merge } from 'lodash';

import { pageTypes } from '../../contants/strings';

import BookPageScreenShot from '../BookPageScreenShot';

import * as handler from './handler';

import './index.scss';

class ScreenShot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementArray: Immutable.List(),
      downloadData: Immutable.Map(),
      bgImageObj: null,
      effectImageObj: null
    };

    // canvas的渲染.
    this.computedCoverSheet = (
      workspaceRatio,
      size,
      pages,
      pageIndex,
      isCrystalOrMetal
    ) =>
      handler.computedCoverSheet(
        workspaceRatio,
        size,
        pages,
        pageIndex,
        isCrystalOrMetal
      );
    this.getPageElements = (page, elements) =>
      handler.getPageElements(this, page, elements);
  }

  componentWillReceiveProps(nextProps) {
    const { urls } = this.props;

    const oldVariables = this.props.variables;
    const newVariables = nextProps.variables;

    const oldMateriales = this.props.materials;
    const newMateriales = nextProps.materials;

    if (
      !Immutable.is(oldVariables, newVariables) ||
      !Immutable.is(oldMateriales, newMateriales)
    ) {
      window.isStopRetry = false;

      const coverimage =
        newVariables && newVariables.getIn(['coverAsset', 'coverimage']);
      const effectImg = newMateriales.getIn(['cover', 'img']);
      const bgImage =
        coverimage && effectImg
          ? `${urls.get('baseUrl')}${coverimage.substring(1)}`
          : '';

      const totalImg = Number(!!effectImg) + Number(!!bgImage);

      let loadedImg = 0;

      if (!effectImg) {
        this.setState({
          effectImageObj: null
        });
      }

      if (!bgImage) {
        this.setState({
          bgImageObj: null
        });
      }

      const effectImageObj = new window.Image();
      effectImageObj.onload = () => {
        loadedImg++;
        if (loadedImg === totalImg) {
          window.isStopRetry = true;
        }
        this.setState({ effectImageObj });
      };
      effectImageObj.src = effectImg || '';

      const bgImageObj = new window.Image();
      bgImageObj.onload = () => {
        loadedImg++;
        if (loadedImg === totalImg) {
          window.isStopRetry = true;
        }
        this.setState({ bgImageObj });
      };
      bgImageObj.src = bgImage || '';
    }
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
      elementArray,
      isImageCover,
      urls,
      env
    } = this.props;

    const { bgImageObj, effectImageObj } = this.state;

    const containerRect = {
      width: size.renderCoverSize.width,
      height: size.renderCoverSize.height
    };

    const bgImageProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height,
      image: bgImageObj
    };

    const sheetGroupProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height
    };

    const effectImageProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height,
      image: effectImageObj
    };

    const summary = paginationSpread.get('summary');
    const pages = paginationSpread.get('pages');
    const images = paginationSpread.get('images');

    const elements = paginationSpread.get('elements');

    const coverimage =
      variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = materials.getIn(['cover', 'img']);
    const bgImage =
      coverimage && effectImg
        ? `url("${urls.baseUrl}${coverimage.substring(1)}")`
        : '';

    const screenshotClass = 'screenshot';

    const spinePage = pages.find((p) => {
      return p.get('type') === pageTypes.spine;
    });

    const page = pages.find((p) => {
      return p.get('type') === pageTypes.full;
    });

    const backRectProps = {
      x: 0,
      y: 0,
      width: containerRect.width,
      height: containerRect.height,
      fill: page ? page.get('bgColor') : '#fff'
    };

    const bookPages = [];

    if (pages && pages.size) {
      pages.forEach((page, index) => {
        // 计算当前page的renderInnerSheetSize和renderInnerSheetSizeWithoutBleed的值.
        const isCrystalOrMetal = summary.get('isSupportHalfImageInCover');
        const coverSheetSizeObj = this.computedCoverSheet(
          ratio.coverWorkspace,
          size,
          pages,
          index,
          position,
          isCrystalOrMetal
        );
        const newSize = merge({}, size, coverSheetSizeObj);
        const pageData = {
          isPreview,
          urls,
          summary,
          page,
          images,
          elements: this.getPageElements(page, elements),
          ratio,
          index,
          settings,
          template,
          paginationSpread,
          parameters,
          variables,
          size: newSize,
          spinePage,
          elementArray,
          isImageCover,
          env
        };

        const isHardCover = summary.get('isHardCover');

        const isSpine = page.get('type') === pageTypes.spine;

        const correctOffset = {
          width: isHardCover ? 2 : 2,
          height: isHardCover ? 6 : 6,
          top: isHardCover ? -3 : -2,
          left: 0
        };

        const { renderCoverSheetSizeWithoutBleed } = newSize;

        const { left, top, width, height } = renderCoverSheetSizeWithoutBleed;

        const sheetWithoutBleedGroupProps = {
          x: left + correctOffset.left,
          y: top + correctOffset.top,
          width: width + correctOffset.width,
          height: height + correctOffset.height,
          id: 'sheet'
        };

        bookPages.push(
          <Group {...sheetWithoutBleedGroupProps}>
            <BookPageScreenShot data={pageData} />
          </Group>
        );
      });
    }

    return (
      <Stage
        ref={stage => (this.screenshot = stage)}
        width={containerRect.width}
        height={containerRect.height}
        className={screenshotClass}
      >
        <Layer>
          <Group {...sheetGroupProps}>
            <Rect {...backRectProps} />
            <Image {...bgImageProps} />
            {bookPages}
            <Image {...effectImageProps} />
          </Group>
        </Layer>
      </Stage>
    );
  }
}

export default ScreenShot;
