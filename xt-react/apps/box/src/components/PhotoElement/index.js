import classNames from 'classnames';
import { get, merge } from 'lodash';
import React, { Component } from 'react';
import { translate } from 'react-translate';

// 导入组件
import XLoading from '../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../common/ZNOComponents/XWarnTip';
import Element from '../Element';
import BgUploadImage from '../BgUploadImage';

import * as handler from './handler';
import { RESIZE_LIMIT } from '../../contants/strings';

import './index.scss';

class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.handleDragOver = event => handler.handleDragOver(this, event);
    this.onDrop = event => handler.onDrop(this, event);
    this.handlerClick = (data, event) => handler.handlerClick(this, data, event);
    this.onMouseMove = event => handler.onMouseMove(this, event);
    this.onMouseOut = event => handler.onMouseOut(this, event);
    this.onImageLoaded = this.onImageLoaded.bind(this);

    this.state = {
      isImgLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const newEncImgId = nextProps.data.element.encImgId;
    const oldImgUrl = get(this.props.data.element, 'computed.imgUrl');
    const newImgUrl = get(nextProps.data.element, 'computed.imgUrl');

    if (newEncImgId && oldImgUrl !== newImgUrl && newImgUrl) {
      // 清空原来的图片.
      this.setState({
        isImgLoading: true
      });
    }
  }

  onImageLoaded() {
    this.setState({
      isImgLoading: false
    });
  }

  render() {
    const { t, actions, data } = this.props;
    const { element, rate, page, isPreview, isCover } = data;
    const computed = get(element, 'computed');
    const imgUrl = get(element, 'computed.imgUrl');
    const scale = get(element, 'computed.scale');

    const left = get(computed, 'left');
    const top = get(computed, 'top');
    const width = get(computed, 'width');
    const height = get(computed, 'height');

    const { isImgLoading, src } = this.state;

    const containerStyle = {
      zIndex: get(element, 'dep') + 100,
      width,
      height,
      left,
      top,
      transform: `rotate(${get(element, 'rot')}deg)`
    };
    const handlerStyle = {
      position: 'absolute',
      width: `${get(computed, 'width')}px`,
      height: `${get(computed, 'height')}px`,
      top: 0,
      left: 0
    };

    // 边框.
    const imgStyle = merge({}, handlerStyle, {
      display: imgUrl ? 'block' : 'none',
    });

    // element
    const elementActions = merge({}, actions, {
      handleDrop: this.onDrop,
      handleClick: this.handlerClick,
      handleDragOver: this.handleDragOver,
      onHandleMouseEnter:this.handlerClick,
      handleMouseMove:this.onMouseMove,
      handleMouseOut:this.onMouseOut
    });

    const elementData = merge({}, data, {
      className: classNames('photo-element', {
        'has-image': !!imgUrl,
        // 图片地址存在但是下载图片失败.
        'error-image': !!imgUrl && !src
      }),
      style: containerStyle,
      handlerStyle
    });

    const warnTipBottom = (get(page, 'bleed.bottom') + get(page, 'wrapSize.bottom')) * rate + 8;
    const warnTipLeft = (get(page, 'bleed.left') + get(page, 'wrapSize.left')) * rate + 8;

    const warnTipProps = {
      isShown: scale > RESIZE_LIMIT,
      title: t('BEYOND_SIZE_TIP', { n: scale, m: RESIZE_LIMIT }),
      left: warnTipLeft,
      bottom: warnTipBottom
    };

    return (
      <Element actions={elementActions} data={elementData}>
        <XLoading isShown={isImgLoading} />

        <img
          className="photo-img"
          src={imgUrl}
          style={imgStyle}
          onLoad={this.onImageLoaded}
        />

        {
          isPreview
            ? null
            : <BgUploadImage viewWidth={width} viewHeight={height} hasImage={imgUrl} />
        }

        {
          isPreview
          ? null
          : <XWarnTip {...warnTipProps} />
        }
      </Element>
    );
  }

}

export default translate('PhotoElement')(PhotoElement);
