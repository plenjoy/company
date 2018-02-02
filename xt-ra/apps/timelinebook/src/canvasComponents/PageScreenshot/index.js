import React, { Component } from 'react';
import { Layer, Stage, Image, Rect, Group } from 'react-konva';
import { zIndex, elementTypes } from '../../constants/strings';
import { is } from 'immutable';
import { get } from 'lodash';
import { fetchImage } from '../../../../common/utils/image';

import PhotoElement from '../PhotoElementShot';
import SpineTextElement from '../SpineTextElementShot';
import LogoElement from '../LogoElementShot';

class PageScreenshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materialObj: null
    }
    this.getRenderElement = this.getRenderElement.bind(this);
    this.loadMaterial = this.loadMaterial.bind(this);
  }

  loadMaterial(nextProps) {
    const { data } = nextProps;
    const {
      materials
    } = data;

    const materialSrc = materials.getIn(['fullCover', 'url']);

    if (materialSrc) {
      fetchImage(materialSrc).then((materialObj) => {
        this.setState({
          materialObj
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldMaterial = get(this.props, 'data.materials');
    const newMaterial = get(nextProps, 'data.materials');

    if (!is(oldMaterial, newMaterial)) {
      this.loadMaterial(nextProps);
    }
  }

  componentWillMount() {
    this.loadMaterial(this.props);
  }

  getRenderElement() {
    const { data } = this.props;
    const {
      computedPage,
      env
    } = data;

    const computedSize = computedPage.get('computed');
    const elements = computedSize.get('elements');

    const html = [];

    elements && elements.forEach((element, idx) => {
      const elementData = { env, element };
      switch (element.get('type')) {
        case elementTypes.photoElement: {
            html.push(
              <PhotoElement key={idx} data={elementData} />
            );
          }
          break;
        case elementTypes.logoElement: {
            html.push(
              <LogoElement key={idx} data={elementData} />
            );
          }
          break;
        case elementTypes.spineTextElement: {
            html.push(
              <SpineTextElement key={idx} data={elementData} />
            );
          }
          break;
      }
    });

    return html;
  }

  render() {
    const { data } = this.props;
    const { materialObj } = this.state;
    const {
      env,
      materials,
      computedPage,
      pIndex
    } = data;

    const computedSize = computedPage.get('computed');

    const stageProps = {
      ref: stage => (this.stage = stage),
      width: computedSize.getIn(['backgroundImageSize', 'width']),
      height: computedSize.getIn(['backgroundImageSize', 'height']),
      className: 'screenshot page-screenshot'
    };

    const containerRectProps = {
      fill: '#fff',
      x: 0,
      y: 0,
      width: computedSize.getIn(['backgroundImageSize', 'width']),
            height: computedSize.getIn(['backgroundImageSize', 'height'])
    };

    const materialProps = {
      x: computedSize.getIn(['backgroundImageSize', 'x']),
      y: computedSize.getIn(['backgroundImageSize', 'y']),
      width: computedSize.getIn(['backgroundImageSize', 'width']),
      height: computedSize.getIn(['backgroundImageSize', 'height']),
      image: materialObj
    };

    const groupProps = {
      x: -computedSize.getIn(['backgroundImageSize', 'x']),
      y: -computedSize.getIn(['backgroundImageSize', 'y']),
      width: computedSize.getIn(['backgroundImageSize', 'width']),
      height: computedSize.getIn(['backgroundImageSize', 'height'])
    };

    return (
      <div className={`page-screenshots${pIndex}`}>
        <Stage {...stageProps}>
          <Layer>
            <Rect {...containerRectProps} />
            <Group {...groupProps}>
              {this.getRenderElement()}
              <Image {...materialProps} />
            </Group>
          </Layer>
        </Stage>
      </div>
    )
  }
}


export default PageScreenshot;
