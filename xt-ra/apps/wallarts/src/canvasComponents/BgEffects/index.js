import React, { Component, PropTypes } from 'react';
import { get, merge, isEqual } from 'lodash';
import { Group, Image, Rect } from 'react-konva';

import { productTypes, acrylicPrintSourceInfo } from '../../constants/strings';

class BgEffects extends Component {
  constructor(props) {
    super(props);
    this.getAcrylicIcons = this.getAcrylicIcons.bind(this);
  }

  getAcrylicIcons() {
    const { size, variables, ratio } = this.props;
    const acrylicIcons = [];
    const acrylicPrintAsset = variables.get('acrylicPrintAsset');
    const acrylicIconsSource = window._APPMATERIALS.backgrounds.acrylic_icons;
    if (!acrylicPrintAsset) return acrylicIcons;
    const renderBgSize = get(size, 'renderBgSize');
    const containerProps = get(size, 'renderContainerProps');
    const renderFrameBorderInnerSize = get(size, 'renderFrameBorderInnerSize');

    const acrylicButtonWidth = acrylicPrintAsset.get('cylinder');
    const distanceH = acrylicPrintAsset.get('left') * ratio;
    const distanceV = acrylicPrintAsset.get('top') * ratio;
    const baseX = get(renderBgSize, 'centerLeft');
    const baseY = get(renderBgSize, 'centerTop');
    const bgCenterWidth = get(renderFrameBorderInnerSize, 'width');
    const bgCenterHeight = get(renderFrameBorderInnerSize, 'height');

    const acrylicButtonDisplayWidth = acrylicButtonWidth * ratio;
    const acrylicIconsDisplayWidth = acrylicButtonDisplayWidth / acrylicPrintSourceInfo.centerWidthRatio;
    const acrylicIconsDisplayHeight = acrylicIconsDisplayWidth;

    const acrylicTopLeftImage = new window.Image();
    acrylicTopLeftImage.src = acrylicIconsSource[0];
    const acrylicTopLeftImageProps = {
      key: 'acrylicTopLeftImage',
      x: baseX + distanceH - (acrylicIconsDisplayWidth * acrylicPrintSourceInfo.lefRatio),
      y: baseY + distanceV - (acrylicIconsDisplayHeight * acrylicPrintSourceInfo.lefRatio),
      width: acrylicIconsDisplayWidth,
      height: acrylicIconsDisplayHeight,
      image: acrylicTopLeftImage
    };
    acrylicIcons.push(<Image {...acrylicTopLeftImageProps} />);

    const acrylicTopRightImage = new window.Image();
    acrylicTopRightImage.src = acrylicIconsSource[1];
    const acrylicTopRightImageProps = {
      key: 'acrylicTopRightImage',
      x: baseX + bgCenterWidth - distanceH - (acrylicIconsDisplayWidth * (1 - acrylicPrintSourceInfo.rightRatio)),
      y: baseY + distanceV - (acrylicIconsDisplayHeight * acrylicPrintSourceInfo.lefRatio),
      width: acrylicIconsDisplayWidth,
      height: acrylicIconsDisplayHeight,
      image: acrylicTopRightImage
    };
    acrylicIcons.push(<Image {...acrylicTopRightImageProps} />);

    const acrylicBottomLeftImage = new window.Image();
    acrylicBottomLeftImage.src = acrylicIconsSource[2];
    const acrylicBottomLeftImageProps = {
      key: 'acrylicBottomLeftImage',
      x: baseX + distanceH - (acrylicIconsDisplayWidth * acrylicPrintSourceInfo.lefRatio),
      y: baseY + bgCenterHeight - distanceV - (acrylicIconsDisplayHeight * (1 - acrylicPrintSourceInfo.bottomRatio)),
      width: acrylicIconsDisplayWidth,
      height: acrylicIconsDisplayHeight,
      image: acrylicBottomLeftImage
    };
    acrylicIcons.push(<Image {...acrylicBottomLeftImageProps} />);

    const acrylicBottomRightImage = new window.Image();
    acrylicBottomRightImage.src = acrylicIconsSource[3];
    const acrylicBottomRightImageProps = {
      key: 'acrylicBottomRightImage',
      x: baseX + bgCenterWidth - distanceH - (acrylicIconsDisplayWidth * (1 - acrylicPrintSourceInfo.rightRatio)),
      y: baseY + bgCenterHeight - distanceV - (acrylicIconsDisplayHeight * (1 - acrylicPrintSourceInfo.bottomRatio)),
      width: acrylicIconsDisplayWidth,
      height: acrylicIconsDisplayHeight,
      image: acrylicBottomRightImage
    };
    acrylicIcons.push(<Image {...acrylicBottomRightImageProps} />);

    return acrylicIcons;
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const {
      pagination,
      materials,
      size,
      settings,
      isPreview
    } = this.props;
    const productType = settings.get('product');
    const isCanvas = productType === productTypes.canvas;
    const isAcrylic = productType === productTypes.acrylicPrint;
    const isMatteShow = settings.get('matte') !== 'none';
    const sheetIndex = get(pagination, 'sheetIndex');
    const effectImagesSrc = isPreview
      ? materials.getIn(['previewBackgrounds', String(sheetIndex)])
      : materials.getIn(['backgrounds', String(sheetIndex)]);
    const matteImagesSrc = materials.getIn(['mattes', String(sheetIndex)]);
    const containerProps = get(size, 'renderContainerProps');
    const renderBgSize = get(size, 'renderBgSize');
    const renderFrameBorderInnerSize = get(size, 'renderFrameBorderInnerSize');
    const effectGroupProps = merge({}, containerProps, { x: 0, y: 0, listening: false });
    const effectImageProps = merge({}, effectGroupProps);
    if (effectImagesSrc) {
      const effectImageObj = new window.Image();
      effectImageObj.src = effectImagesSrc;
      effectImageProps.image = effectImageObj;
    }
    const matteImageProps = merge({}, size.renderMatteProps);
    if (matteImagesSrc) {
      const matteImageObj = new window.Image();
      matteImageObj.src = matteImagesSrc;
      matteImageProps.image = matteImageObj;
    }

    const wenliImages = [];
    if (isCanvas) {
      const wenliSrc = window._APPMATERIALS.backgrounds.wenli1;
      const wenliImageObj = new window.Image();
      wenliImageObj.src = wenliSrc || '';
      const centerWenliProps = merge({
        key: 'centerWenli',
        x: get(renderBgSize, 'centerLeft'),
        y: get(renderBgSize, 'centerTop'),
        width: get(renderFrameBorderInnerSize, 'width'),
        height: get(renderFrameBorderInnerSize, 'height'),
        fillPatternImage: wenliImageObj
      });
      const topWenliProps = {
        key: 'topWenli',
        x: get(renderBgSize, 'centerLeft'),
        y: 0,
        width: get(renderFrameBorderInnerSize, 'width'),
        height: get(renderBgSize, 'centerTop'),
        fillPatternImage: wenliImageObj,
        skewX: -1,
        offsetX: -get(renderBgSize, 'centerTop')
      };
      const rightWenliProps = {
        key: 'rightWenli',
        x: get(renderBgSize, 'centerLeft') + get(renderFrameBorderInnerSize, 'width'),
        y: get(renderBgSize, 'centerTop'),
        width: get(renderBgSize, 'centerLeft'),
        height: get(renderFrameBorderInnerSize, 'height'),
        fillPatternImage: wenliImageObj,
        skewY: -1
      };

      wenliImages.push(<Image {...centerWenliProps} />);
      wenliImages.push(<Image {...topWenliProps} />);
      wenliImages.push(<Image {...rightWenliProps} />);
    }

    let acrylicIcons = null;
    if (isAcrylic) {
      acrylicIcons = this.getAcrylicIcons();
    }

    return (<Group {...effectGroupProps} >
      {
        isMatteShow
          ? <Image {...matteImageProps} />
          : null
      }

      {
        isCanvas
          ? wenliImages
          : null
      }

      {
        isAcrylic
          ? acrylicIcons
          : null
      }

      <Image {...effectImageProps} />

    </Group>);
  }
}

export default BgEffects;
