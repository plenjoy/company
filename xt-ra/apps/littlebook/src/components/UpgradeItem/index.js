import React, { Component } from 'react';
import { is } from 'immutable';
import { merge } from 'lodash';
import classNames from 'classnames';
import { elementTypes } from '../../contants/strings';

import * as handler from './handle';
import './index.scss';

class UpgradeItem extends Component {
  constructor(props) {
    super(props);

    const { updateArrowMarginBottom } = props.actions;

    const {
      ratio,
      spineWidth,
      containerSize,
      effectSize,
      sheetSize,
      sheetSizeWithBleed
    } = handler.doComputed(props);

    this.state = {
      ratio,
      spineWidth,
      containerSize,
      effectSize,
      sheetSize,
      sheetSizeWithBleed
    };
    updateArrowMarginBottom && updateArrowMarginBottom(containerSize);
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.data.element, nextProps.data.element)) {
      const { updateArrowMarginBottom } = nextProps.actions;

      const {
        ratio,
        spineWidth,
        containerSize,
        effectSize,
        sheetSize,
        sheetSizeWithBleed
      } = handler.doComputed(nextProps);

      this.state = {
        ratio,
        spineWidth,
        containerSize,
        effectSize,
        sheetSize,
        sheetSizeWithBleed
      };

      updateArrowMarginBottom && updateArrowMarginBottom(containerSize);
    }
  }

  render() {
    const { children, actions, data } = this.props;
    const {
      className,
      style,
      effectImage,
      element,
      bgColor,
      baseUrl,
      isHardCover,
      spinePage,
      allImages,
      shouldReComputedCrops,
      from,
      env
    } = data;

    const isPhotoElement = element.get('type') === elementTypes.photo;
    const productSize = element.getIn(['summary', 'productSize']);

    const {
      ratio,
      spineWidth,
      containerSize,
      effectSize,
      sheetSize,
      sheetSizeWithBleed
    } = this.state;

    // 1. 容器
    const containerClass = classNames('upgrade-container', className);
    const containerStyle = merge({}, style, {
      width: `${Math.floor(containerSize.width)}px`,
      height: `${Math.floor(containerSize.height)}px`,
      top: `${Math.floor(containerSize.top)}px`,
      left: `${Math.floor(containerSize.left)}px`,
      backgroundColor: bgColor
    });

    // 2. 效果图
    const effectClass = classNames('upgrade-effect pos-abs');
    const effectStyle = merge({}, style, {
      width: `${Math.floor(effectSize.width)}px`,
      height: `${Math.floor(effectSize.height)}px`,
      top: `${Math.floor(effectSize.top)}px`,
      left: `${Math.floor(effectSize.left)}px`,
      backgroundColor: bgColor
    });

    // 3. sheetsize
    const sheetSizeClass = classNames('upgrade-sheet-size pos-abs');
    const sheetSizeStyle = merge({}, style, {
      width: `${Math.floor(sheetSize.width)}px`,
      height: `${Math.floor(sheetSize.height)}px`,
      top: `${Math.floor(sheetSize.top)}px`,
      left: `${Math.floor(sheetSize.left)}px`
    });

    // 4. sheetsizewithbleed
    const sheetSizeWithBleedClass = classNames('upgrade-sheet-size-with-bleed pos-abs');
    const sheetSizeWithBleedStyle = merge({}, style, {
      width: `${Math.floor(sheetSizeWithBleed.width)}px`,
      height: `${Math.floor(sheetSizeWithBleed.height)}px`,
      top: `${Math.floor(sheetSizeWithBleed.top)}px`,
      left: `${Math.floor(sheetSizeWithBleed.left)}px`
    });

    // 5. element.
    const computed = handler.computedElementOptions(
      sheetSizeWithBleed,
      spineWidth,
      ratio,
      element,
      baseUrl,
      isHardCover,
      productSize,
      allImages,
      from,
      shouldReComputedCrops,
      env
    );

    const elementStyle = {};
    if (element && element.get('type') === elementTypes.photo) {
      elementStyle.width = `${Math.ceil(computed.get('width'))}px`;
      elementStyle.height = `${Math.ceil(computed.get('height'))}px`;
      elementStyle.top = `${Math.ceil(computed.get('top'))}px`;
      elementStyle.left = `${Math.ceil(computed.get('left'))}px`;
    }

    const imgUrl = computed.get('imgUrl');
    const elementClass = classNames('element', {
      // 'has-img': !!imgUrl,
      'has-text': !isPhotoElement
    });

    // 6. upgrade options
    const upgradeOptionsClass = classNames('upgrade-options');
    const upgradeOptionsStyle = {
      top: `${Math.floor(containerSize.height)}px`,
      left: `${Math.floor(sheetSize.left)}px`,
      right: 0
    };

    return (<div className={containerClass} style={containerStyle}>
      {/* 效果图 */}
      <img className={effectClass} style={effectStyle} src={effectImage} />

      {/* sheet size */}
      <div className={sheetSizeClass} style={sheetSizeStyle}>
        <div className={sheetSizeWithBleedClass} style={sheetSizeWithBleedStyle}>
          {
            imgUrl ? <img
              className={elementClass}
              style={elementStyle}
              src={imgUrl}
            /> : null
          }
        </div>
      </div>

      <div className={upgradeOptionsClass} style={upgradeOptionsStyle}>
        { children }
      </div>
    </div>);
  }
}

export default UpgradeItem;
