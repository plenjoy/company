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
      userInfo
    } = data;


    const summary = paginationSpread.get('summary');
    const images = paginationSpread.get('images');
    const coverClass = classNames('book-cover-screenshot');

    const containerStyle = merge({},
      {},
      {
        width: `${get(size, 'renderCoverSize.width')}px`,
        height: `${get(size, 'renderCoverSize.height')}px`,
        cursor: 'default'
      },
      styles
    );



    const productType = get(settings, 'spec.product');
    const productSize = get(settings, 'spec.size');
    const effectImg = productType ? `./assets/${productType}/${productSize}/cover.png` : '';

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
      workspace: ratios.coverWorkspace
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
          y: get(size, 'renderCoverSheetSizeWithoutBleed.top') + get(size, 'renderCoverSheetSize.top'),
          userInfo
        };


        bookPages.push(

          <BookPageScreenshot key={index + "screenshot"} actions={pageActions} data={pageData} />
         );
      });
    }

    if(bookPages.length === 0){
      if (project.pageArray) {
          project.pageArray.forEach((page,index)=>{
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
              y: get(size, 'renderCoverSheetSizeWithoutBleed.top') + get(size, 'renderCoverSheetSize.top'),
              userInfo
            };

          if(index===0){
            bookPages.push(

              <BookPageScreenshot key={index + "screenshot"} actions={pageActions} data={pageData} />
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

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: get(size, 'renderCoverSize.width'),
      height: get(size, 'renderCoverSize.height'),
      className: bookPageClassName
    };

    const bgImageObj = new window.Image();
    bgImageObj.src = effectImg;

    const bgImageProps = {
      x: 0,
      y: 0,
      width: get(size, 'renderCoverSize.width'),
      height: get(size, 'renderCoverSize.height'),
      image: bgImageObj
    };
    const sheetGroupProps = {
      x: 0,
      y: 0,
      width: get(size, 'renderCoverSize.width'),
      height: get(size, 'renderCoverSize.height')
    };
    const backRectProps = {
      x: 0,
      y: 0,
      width: get(size, 'renderCoverSize.width'),
      height: get(size, 'renderCoverSize.height'),
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
