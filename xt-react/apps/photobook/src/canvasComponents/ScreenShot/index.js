import React, { Component, PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { Layer, Stage, Group, Rect, Text, Image } from 'react-konva';
import { merge, get } from 'lodash';

import { pageTypes } from '../../contants/strings';
import classNames from 'classnames';

import { toDownload } from '../BookPage/canvas/downloadImage';

import BookPageScreenShot from '../BookPageScreenShot';
import ScreenShotForCover from '../ScreenShotForCover';
import ShadowElement from '../ShadowElement';

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
    this.computedCoverSheet = (workspaceRatio, size, pages, pageIndex, isCrystalOrMetal) => handler.computedCoverSheet(workspaceRatio, size, pages, pageIndex, isCrystalOrMetal);
    this.computedInnerSheet = (workspaceRatio, size, pages, pageIndex, bookShape) => handler.computedInnerSheet(workspaceRatio, size, pages, pageIndex, bookShape);

  }

  componentWillReceiveProps(nextProps) {
    const { urls } = this.props;

    const oldVariables = this.props.variables;
    const newVariables = nextProps.variables;

    const oldMateriales = this.props.materials;
    const newMateriales = nextProps.materials;

    const oldPaginationSpread = this.props.paginationSpread;
    const newPaginationSpread = nextProps.paginationSpread;

    if (!Immutable.is(oldVariables, newVariables) ||
        !Immutable.is(oldMateriales, newMateriales) ||
        !Immutable.is(oldPaginationSpread, newPaginationSpread)) {

      const isCover = get(nextProps, 'paginationSpread').getIn(['summary', 'isCover']);

      const coverimage = newVariables && newVariables.getIn(['coverAsset', 'coverimage']);
      const effectImg = isCover ? newMateriales.getIn(['cover', 'img']) : newMateriales.getIn(['inner', 'img']);
      const bgImage = coverimage && effectImg ? `${urls.get('baseUrl')}${coverimage.substring(1)}` : '';

      const totalImg = Number(!!effectImg) + Number(!!bgImage);

      window.isStopRetry = false;

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
        loadedImg ++;
        if (loadedImg === totalImg) {
          window.isStopRetry = true;
        }
        this.setState({effectImageObj});
      };
      effectImageObj.src = effectImg || '';

      const bgImageObj = new window.Image();
      bgImageObj.onload = () => {
        loadedImg ++;
        if (loadedImg === totalImg) {
          window.isStopRetry = true;
        }
        this.setState({bgImageObj});
      };
      bgImageObj.src = bgImage || '';
    }
  }

  componentWillMount() {
    const { urls, variables, materials, paginationSpread } = this.props;

    const isCover = paginationSpread.getIn(['summary', 'isCover']);

    const coverimage = variables && variables.getIn(['coverAsset', 'coverimage']);
    const effectImg = isCover ? materials.getIn(['cover', 'img']) : materials.getIn(['inner', 'img']);
    const bgImage = coverimage && effectImg ? `${urls.get('baseUrl')}${coverimage.substring(1)}` : '';

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
      this.setState({effectImageObj});
    };
    effectImageObj.src = effectImg || '';

    const bgImageObj = new window.Image();
    bgImageObj.onload = () => {
      this.setState({bgImageObj});
    };
    bgImageObj.src = bgImage || '';
  }


  render() {
    const {
      paginationSpread,
      paginationSpreadForCover,
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
      isCurrentPage,
      urls,
      env
      } = this.props;

    const { bgImageObj, effectImageObj } = this.state;

    const summary = paginationSpread.get('summary');
    const isCover = summary.get('isCover');

    const containerRect = {
      width: isCover ? size.renderCoverSize.width : size.renderInnerSize.width,
      height: isCover ? size.renderCoverSize.height : size.renderInnerSize.height
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

    if (effectImageObj) {
      effectImageProps.image = effectImageObj;
    }

    let bookPages = [];

    const screenshotClass = classNames('', {
      'screenshot': !isCurrentPage,
      'current-page-screenshot': isCurrentPage
    });

    let backRectProps;

    if (summary) {

      const pages = paginationSpread.get('pages');
      const images = paginationSpread.get('images');

      const effectImg = isCover ? materials.getIn(['cover', 'img']) : materials.getIn(['inner', 'img']);

      const normalPage = pages.find((p) => {
        return p.get('type') !== pageTypes.spine;
      });

      backRectProps = {
        x: 0,
        y: 0,
        width: containerRect.width,
        height: containerRect.height,
        fill: normalPage && normalPage.get('bgColor') ? normalPage.get('bgColor') : '#fff'
      };

      if (isCover) {
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

             bookPages.push(
                <Group {...sheetGroupProps} key={page.get('id')}>
                  <BookPageScreenShot data={pageData} />
                </Group>
            );
          });
        }
      } else {
        if (pages.size) {
          const bookShape = summary.get('bookShape');
          pages.forEach((page, index) => {
            const innerSheetSizeObj = this.computedInnerSheet(
              ratio.innerWorkspace,
              size,
              pages,
              index,
              bookShape
            );
            const newSize = merge({}, size, innerSheetSizeObj);

            let pageData = {
              urls,
              size: newSize,
              summary,
              page,
              elements: page.get('elements'),
              template,
              pagination,
              ratio,
              paginationSpread,
              index,
              images,
              settings,
              isPreview,
              parameters,
              variables,
              materials,
              position,
              env
            };

            const { renderInnerSize } = newSize;

            const { left, top, width, height } = renderInnerSize;

            const sheetGroupProps = {
              x: left,
              y: top,
              width,
              height,
              id: 'sheet'
            };

            const shadowElements = [];

            let shadowGroupProps = {
              x: 0,
              y: 0,
              width: 0,
              height: 0
            };


            // 给内页的sheet添加一个shadow.
            if (!isCover && (pages.size === 1 || index === 1)) {
              const shadow = paginationSpread.get('shadow');

              const { renderInnerSheetSizeWithoutBleed } = newSize;

              const positionTop = position ? position.inner.render.top : 0;
              const positionLeft = position ? position.inner.render.left : 0;

              const innerSheetPosition = {
                top: positionTop + renderInnerSheetSizeWithoutBleed.top,
                left: positionLeft
              };

              shadowGroupProps = {
                x: innerSheetPosition.left - page.getIn(['bleed', 'left']) * ratio.workspace,
                y: innerSheetPosition.top,
                width: renderInnerSheetSizeWithoutBleed.width * 2,
                height: renderInnerSheetSizeWithoutBleed.height,
                clipFunc: (ctx) => {
                  ctx.rect(0, 0, renderInnerSheetSizeWithoutBleed.width * 2, renderInnerSheetSizeWithoutBleed.height)
                }
              };

              const shadowData = { element: shadow, ratio };
              shadowElements.push(
                <ShadowElement
                  key="shadow-element"
                  data={shadowData}
                />
              );
            }

            bookPages.push(
                <Group>
                  <Group {...sheetGroupProps} key={page.get('id')}>
                    <BookPageScreenShot data={pageData} />
                  </Group>
                  <Group {...shadowGroupProps}>
                    { shadowElements }
                  </Group>
                </Group>
            );
          });
        }
      }
    }

    let coverScreenShot = [];

    if (!isCover) {
      const screenshotData = {
        variables,
        materials,
        size,
        isPreview,
        settings,
        template,
        parameters,
        position,
        ratio,
        paginationSpread:  paginationSpreadForCover,
        urls,
        env
      };
      coverScreenShot.push(<ScreenShotForCover {...screenshotData} />)
    }

    return (
        <Stage
          ref={stage => this.screenshot = stage}
          width={containerRect.width}
          height={containerRect.height}
          className={screenshotClass}
        >
          <Layer>
            <Group {...sheetGroupProps}>
              { coverScreenShot }
              <Rect {...backRectProps} />
              <Image {...bgImageProps} />
              { bookPages }
              <Image {...effectImageProps} />
            </Group>
          </Layer>
        </Stage>
    );
  }
}

export default ScreenShot;
