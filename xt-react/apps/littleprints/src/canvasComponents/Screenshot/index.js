import { merge, get } from 'lodash';
import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component } from 'react';
import { Layer, Stage, Group, Rect, Image } from 'react-konva';

import './index.scss';

import BookPageScreenshot from '../BookPageScreenshot';

class Screenshot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, data } = this.props;
    const {
      boundTemplateActions,
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      switchSheet,
      setMouseHoverDomNode
    } = actions;
    const {
      urls,
      size,
      ratios,
      styles,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      allImages,
      userId,
      project,
      isPreview,
      capability,
      useInUpgrade,
      isUpgradeTo8X6,
      isForUpgradeScreenshot
    } = data;


    const summary = paginationSpread.get('summary');
    const images = paginationSpread.get('images');
    const coverClass = classNames('book-cover-screenshot');

    const productType = get(settings, 'spec.product');
    const productSize = get(settings, 'spec.size');
    let isCoverPage = true;
    let isLandscapeShape = false;
    let newSize = size;

    const pageActions = {
      boundPaginationActions,
      boundProjectActions,
      boundImageEditModalActions,
      boundImagesActions,
      boundUploadImagesActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundTemplateActions,
      switchSheet,
      setMouseHoverDomNode
    };

    const ratio = {
      workspace: useInUpgrade ? ratios.innerWorkspaceForUpgrade : ratios.coverWorkspace
    };

    const bookPages = [];

    if (project.cover.get('containers')) {
      const containers = project.cover.get('containers');
      containers.forEach((page, index) => {
        const pageData = {
          isPreview,
          urls,
          summary,
          page,
          images,
          elements: page.get('elements'),
          pagination,
          ratio,
          index,
          settings,
          template,
          paginationSpread,
          parameters,
          size: merge(size),
          variables,
          allImages,
          userId,
          project,
          capability,
          x: get(size, 'renderCoverSheetSizeWithoutBleed.left') + get(size, 'renderCoverSheetSize.left'),
          y: get(size, 'renderCoverSheetSizeWithoutBleed.top') + get(size, 'renderCoverSheetSize.top')
        };

        bookPages.push(
          <BookPageScreenshot key={`${index}screenshot`} actions={pageActions} data={pageData} />
         );
      });
    }

    if (bookPages.length === 0) {
      if (project.pageArray) {
        project.pageArray.some((page, index) => {
          isLandscapeShape = page.get('width') > page.get('height');
          if (isLandscapeShape) {
            newSize = merge({}, size, {
              renderCoverSheetSize: get(size, 'renderCoverSheetSize'),
              renderInnerSize: get(size, 'renderInnerSizeLandscape'),
              renderInnerContainerSize: get(size, 'renderInnerContainerSizeLandscape'),
              renderInnerSheetSize: get(size, 'renderInnerSheetSizeLandscape'),
              renderInnerSheetSizeWithoutBleed: get(size, 'renderInnerSheetSizeWithoutBleedLandscape')
            });
          }
          const pageRatio = {
            workspace: useInUpgrade
            ? isLandscapeShape
              ? get(ratios, 'innerWorkspaceForUpgradeLandscape')
              : get(ratios, 'innerWorkspaceForUpgrade')
            : isLandscapeShape
              ? get(ratios, 'innerWorkspaceLandscape')
              : get(ratios, 'innerWorkspace')
          };

          const pageData = {
            isPreview,
            urls,
            summary,
            page,
            images,
            elements: page.get('elements'),
            pagination,
            ratio: pageRatio,
            index,
            settings,
            template,
            paginationSpread,
            parameters,
            size: newSize,
            variables,
            allImages,
            userId,
            project,
            capability,
            x: get(newSize, 'renderCoverSheetSizeWithoutBleed.left') + get(newSize, 'renderCoverSheetSize.left')+2,
            y: get(newSize, 'renderCoverSheetSizeWithoutBleed.top') + get(newSize, 'renderCoverSheetSize.top'),
            isUpgradeTo8X6
          };

          if (index === 0) {
            isCoverPage = false;
            return bookPages.push(
              <BookPageScreenshot key={`${index}screenshot`} actions={pageActions} data={pageData} />
            );
          }
        });
      }
    }
    const bookPageClassName = classNames('book-page', {
      enabled: false,
      disabled: true,

      cover: true,
      inner: false
    });

    let upgradeCover = useInUpgrade ? 'upgradecover' : 'cover';
    upgradeCover = isForUpgradeScreenshot ? 'cover' : upgradeCover;
    const landscapeShapeExtralString = isLandscapeShape ? '_landscape' : '';
    const effectImg = productType ? `./assets/${productType}/${productSize}/${upgradeCover}${landscapeShapeExtralString}.png` : '';

    const containerSize = isCoverPage
      ? get(newSize, 'renderCoverSize')
      : get(newSize, 'renderInnerSize');

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: get(containerSize, 'width'),
      height: get(containerSize, 'height'),
      className: bookPageClassName
    };

    const containerStyle = merge({},
      {},
      {
        width: `${get(containerSize, 'width')}px`,
        height: `${get(containerSize, 'height')}px`,
        cursor: 'default'
      },
      styles,
      useInUpgrade ? { display: 'block' } : {}
    );

    const bgImageObj = new window.Image();
    bgImageObj.src = effectImg;

    const bgImageProps = {
      x: 0,
      y: 0,
      width: get(containerSize, 'width'),
      height: get(containerSize, 'height'),
      image: bgImageObj
    };
    const sheetGroupProps = {
      x: 0,
      y: 0,
      width: get(containerSize, 'width'),
      height: get(containerSize, 'height')
    };
    const backRectProps = {
      x: 0,
      y: 0,
      width: get(containerSize, 'width'),
      height: get(containerSize, 'height'),
      fill: '#fff'
    };

    return (
      <div
        key="cover"
        className={coverClass}
        style={containerStyle}
        draggable="false"
        onDragStart={this.stopDragEvent}
        ref={(c) => {
          this.componentRef = c;
        }}
      >
        <div className="cover-overflow-container" style={containerStyle}>

          <Stage {...stageProps}>
            <Layer ref={layer => (this.layerNodeOfElements = layer)}>
              <Group {...sheetGroupProps}>
                <Rect {...backRectProps} />
              </Group>
              {bookPages}
              <Group {...sheetGroupProps}>
                <Image {...bgImageProps} />
              </Group>
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

Screenshot.propTypes = {};

Screenshot.defaultProps = {};

export default translate('Screenshot')(Screenshot);
